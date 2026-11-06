// Daemons (glossary: daemon): BOS's supervisor runs a service's instances, logs their
// lines, flags alerts in its monitor threads, restarts by policy and answers signals.
// The services here are small node scripts in a temporary workshop.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { backoff, instanceEnv, restarts, serviceProblems } from "../src/index.ts";
import { bosFor, tempWorkshop, write } from "./helpers.ts";

const until = async (check: () => boolean, ms = 8000) => {
  for (let waited = 0; waited < ms && !check(); waited += 50) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return check();
};

// a service printing its instance, the SECRET it can see, an error line, then staying up
const SCRIPT = `
console.log("instance " + process.env.BOS_INSTANCE + " secret=" + (process.env.SECRET ?? "none"));
console.error("level=ERROR something broke");
setInterval(() => {}, 1000);
process.on("SIGTERM", () => { console.log("bye"); process.exit(0); });
`;

const started: (() => Promise<unknown>)[] = [];
afterEach(async () => {
  await Promise.all(started.splice(0).map((stop) => stop()));
});

function workshopWith(service: object) {
  const root = tempWorkshop();
  write(join(root, ".BOS/setup/daemons/fake.json"), JSON.stringify(service));
  const bos = bosFor(root);
  started.push(() => bos.daemon("fake", "stop"));
  return { root, bos, files: bos.daemons().files("fake") };
}

describe("daemon (pure)", () => {
  it("shares or separates the environment of an instance", () => {
    const parent = { PATH: "/bin", HOME: "/h", SECRET: "s", KEEP: "k" };
    const shared = instanceEnv({ name: "x", command: "x", env: { A: "1" } }, 2, parent);
    expect(shared).toMatchObject({ SECRET: "s", A: "1", BOS_DAEMON: "x", BOS_INSTANCE: "2" });
    const separate = instanceEnv(
      { name: "x", command: "x", context: "separate", inherit: ["KEEP"] },
      0,
      parent,
    );
    expect(separate).toEqual({
      PATH: "/bin",
      HOME: "/h",
      KEEP: "k",
      BOS_DAEMON: "x",
      BOS_INSTANCE: "0",
    });
  });

  it("restarts by policy, backs off, checks a service", () => {
    expect(restarts({ name: "x", command: "x" }, 1, false)).toBe(true);
    expect(restarts({ name: "x", command: "x" }, 0, false)).toBe(false);
    expect(restarts({ name: "x", command: "x", restart: "always" }, 0, false)).toBe(true);
    expect(restarts({ name: "x", command: "x", restart: "always" }, 1, true)).toBe(false);
    expect([0, 1, 2, 10].map(backoff)).toEqual([500, 1000, 2000, 30000]);
    expect(serviceProblems({ name: "a b", alerts: ["("] })).toHaveLength(3);
  });
});

describe("daemon (supervised)", () => {
  it("runs a cluster, logs and flags lines, keeps contexts apart, reloads, rotates, stops", async () => {
    process.env.SECRET = "from-the-supervisor";
    const { bos, files } = workshopWith({
      command: process.execPath,
      args: ["-e", SCRIPT],
      context: "separate",
      instances: 2,
      alerts: ["level=ERROR"],
      threads: 2,
      grace: 2000,
    });
    const start = await bos.daemon("fake", "start");
    expect(start).toMatchObject({ done: "started", alive: true });
    expect(start.state?.instances.map((i) => typeof i.pid)).toEqual(["number", "number"]);
    expect((await bos.daemon("fake", "start")).done).toBe("running-already");

    const log = () => (existsSync(files.log) ? readFileSync(files.log, "utf8") : "");
    expect(await until(() => /fake#1 out instance 1 secret=none/.test(log()))).toBe(true);
    expect(log()).toContain("fake#0 out instance 0 secret=none");
    const alerts = () => (existsSync(files.alerts) ? readFileSync(files.alerts, "utf8") : "");
    expect(await until(() => alerts().split("level=ERROR").length === 3)).toBe(true);

    const pids = start.state?.instances.map((i) => i.pid);
    expect((await bos.daemon("fake", "reload")).done).toBe("signalled");
    expect(
      await until(() => {
        const now = bos
          .daemons()
          .state("fake")
          ?.instances.map((i) => i.pid);
        return Boolean(now?.every((pid, n) => pid && pid !== pids?.[n]));
      }),
    ).toBe(true);

    await bos.daemon("fake", "rotate");
    expect(await until(() => existsSync(`${files.log}.1`))).toBe(true);

    const stop = await bos.daemon("fake", "stop");
    expect(stop).toMatchObject({ done: "signalled", alive: false });
    expect(stop.state?.status).toBe("stopped");
    expect(log()).toContain("supervisor info stopped");
    expect((await bos.daemon("fake", "status")).alive).toBe(false);
    delete process.env.SECRET;
  });

  it("restarts a failing instance, then gives it up; a shared context sees the supervisor's env", async () => {
    process.env.SECRET = "shared-one";
    const { bos, files } = workshopWith({
      command: process.execPath,
      args: ["-e", 'console.log("secret=" + process.env.SECRET); process.exit(3)'],
      maxRestarts: 1,
    });
    await bos.daemon("fake", "start");
    expect(
      await until(() => Boolean(bos.daemons().state("fake")?.instances[0]?.failed), 6000),
    ).toBe(true);
    const state = bos.daemons().state("fake");
    expect(state?.instances[0]).toMatchObject({ restarts: 1, exit: 3, failed: true });
    expect(readFileSync(files.log, "utf8")).toContain("secret=shared-one");
    delete process.env.SECRET;
  });

  it("says which services it knows, and refuses an unknown one", async () => {
    const { bos } = workshopWith({ command: "true" });
    expect(bos.daemons().names()).toEqual(["fake", "ollama"]);
    await expect(bos.daemon("nope", "start")).rejects.toThrow('no service "nope"');
    expect((await bos.daemon("fake", "start", { dryRun: true })).done).toBe("would-start");
  });
});
