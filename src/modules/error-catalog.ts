import type { Metadata } from "../types/handler-error.types";
import type { Catalog, CatalogEntry } from "../types/error-catalog.types";

export abstract class ErrorCatalog {
  constructor(protected readonly catalog: Catalog) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Non typescript error handling
    if (!catalog) {
      throw new Error("Catalog cannot be null or undefined.");
    }
  }

  /**
   * Retrieves a catalog entry by its code.
   *
   * @param code - The error code to search for in the catalog.
   * @param metadata - Additional metadata to provide context for the error.
   * @returns The catalog entry for the specified error code.
   */
  public abstract getEntry(code: string, metadata?: Metadata): CatalogEntry;
}
