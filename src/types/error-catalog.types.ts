import type { Severity } from "./handler-error.types";

export type CatalogEntry = Record<string, unknown> & {
  message: string;
  severity?: Severity;
};

export type Catalog = Record<string, CatalogEntry>;
