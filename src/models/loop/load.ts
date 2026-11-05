// The loop of a project: the "loop" section of its .github/bos.json, else the default loop.
import type { Host } from "../../core/host.ts";
import { type Settings, settingsOf } from "../settings/load.ts";
import { Loop } from "./class.ts";
import { DEFAULT_LOOP } from "./data.ts";

export function loopOfSettings(settings: Settings): Loop {
  const own = settings.data.loop;
  if (!own) return new Loop();
  // fields left out keep the default
  return new Loop({ ...DEFAULT_LOOP, ...own }, settings.source);
}

export function loopOf(host: Host, projectPath: string): Loop {
  return loopOfSettings(settingsOf(host, projectPath));
}
