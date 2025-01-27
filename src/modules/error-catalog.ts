import type { Catalog, CatalogEntry } from "../types/error-catalog.types";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- Class is used as a namespace
export class ErrorCatalog {
  private static catalog: Catalog | undefined;

  /**
   * Registers the error catalog.
   *
   * @param catalog - The error catalog to register.
   */
  public static registerCatalog(catalog: Catalog): void {
    ErrorCatalog.catalog = catalog;
  }

  /**
   * Clears the error catalog.
   */
  public static clearCatalog(): void {
    ErrorCatalog.catalog = undefined;
  }

  /**
   * Retrieves the catalog entry for the specified error code.
   *
   * @param code - The error code to retrieve.
   * @returns The catalog entry for the specified error code.
   */
  public static getEntry(code: string): CatalogEntry {
    if (!ErrorCatalog.catalog) {
      throw new Error("Error catalog is not registered");
    }

    const catalogEntry = ErrorCatalog.catalog[code];

    if (!catalogEntry) {
      throw new Error(`Error code ${code} not found in catalog`);
    }

    return catalogEntry;
  }
}
