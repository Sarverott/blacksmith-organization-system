import { BOS, NodeHost } from "blacksmith-organization-system";

console.log(BOS);
console.log("\n------");
console.log(new BOS());
console.log("\n------");
console.log(NodeHost);
console.log("\n------");
console.log(new NodeHost());
console.log("\n------");
const host = new NodeHost();
const config = { workshop: "/run/media/sarverott/setternet-A62/" };
const bos = new BOS(host, config);
console.log(bos);
console.log("\n------");
console.log(bos.authors);
console.log(await bos.authors());
bos.authors().then((d) => {
  console.log(d);
});
bos.authors().then((d) => {
  console.log(d.authors);
}); // well... hope that it has function somewhere

console.log("\n------");
console.log("\n------");
console.log("\n------");
console.log(bos.bootstrap());
console.log("\n---sometimes await faster than then callbacking--");

console.log("\n------");
console.log(await bos.bootstrap());
console.log("\n------");
bos.inspect().then((d) => console.log(d));

console.log(delete bos.workshop);
console.log(bos);

console.log("\n#######\n#######\n#######");

const rebos = new BOS(new NodeHost(), {
  workshop: "/run/media/sarverott/setternet-A62/__WORKSHOP",
});
console.log(rebos);
console.log("\n------");
rebos.bootstrap().then((result) => {
  console.log(result);
  console.log("\n------");
  rebos.inspect().then((d) => {
    console.log("\n------\n", d, "\n------");
  });
  console.log(result.host.cwd());
  console.log(result.workshop);
  console.log(result.workshop.child);
  console.log(result.workshop.areaNames);
  console.log(result.workshop.areas); // undefined
  console.log(rebos.workshop.areas); // undefined
  console.log(result.workshop.forge);
});
