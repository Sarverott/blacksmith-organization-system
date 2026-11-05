// Every procedure of the core. A new behaviour is a new directory here:
// DESCRIPTION.md (why), one file per step (how), _index.ts (the order).

export { type AutomergeContext, automerging } from "./automerging/_index.ts";
export { type BootstrapContext, bootstrapping } from "./bootstrapping/_index.ts";
export { type BumpContext, type BumpOutcome, bumping, unbumped } from "./bumping/_index.ts";
export {
  emptyReport,
  type Finding,
  type InspectContext,
  inspecting,
  type ScopeReport,
  type WorkshopReport,
} from "./inspecting/_index.ts";
export { type FlowOutcome, type ProposeContext, proposing, undecided } from "./proposing/_index.ts";
export { type VersionContext, versioning } from "./versioning/_index.ts";
export { classify, isNoise, type WatchContext, type WorkshopEvent, watching } from "./watching/_index.ts";
