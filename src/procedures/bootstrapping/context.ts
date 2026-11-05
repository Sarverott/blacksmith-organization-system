import type { Context } from "../../core/context.ts";
import type { Workshop } from "../../models/_index.ts";

export type BootstrapContext = Context & { workshop: Workshop };
