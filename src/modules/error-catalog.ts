import type { Metadata } from "../types";
import type { Catalog, CatalogEntry } from "../types/error-catalog.types";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- Class is used as a namespace
export class ErrorCatalog {
  private static catalog: Catalog | undefined;

  /**
   * Register a catalog of errors.
   *
   * @param catalog - The error catalog to register.
   */
  public static registerCatalog(catalog: Catalog): void {
    ErrorCatalog.catalog = catalog;
  }

  /**
   * Clear the error catalog.
   */
  public static clearCatalog(): void {
    ErrorCatalog.catalog = undefined;
  }

  /**
   * Retrieves the catalog entry for the specified error code.
   *
   * @param code - The error code to retrieve.
   * @param metadata - The metadata for replacing placeholders in the message.
   * @returns The catalog entry for the specified error code.
   */
  public static getEntry(code: string, metadata?: Metadata): CatalogEntry {
    if (typeof code !== "string") {
      throw new TypeError("Invalid error code");
    }

    if (!ErrorCatalog.catalog) {
      throw new Error("Error catalog is not registered");
    }

    const catalogEntry = ErrorCatalog.catalog[code.trim()];

    if (!catalogEntry) {
      throw new Error(`Error code ${code} not found in catalog`);
    }

    // Clone the entry to avoid mutating the original catalog entry
    const entryWithFormattedMessage = { ...catalogEntry };

    // Format the message with metadata if provided
    if (metadata) {
      entryWithFormattedMessage.message = ErrorCatalog.formatMessage(
        catalogEntry.message,
        metadata,
      );
    }

    return entryWithFormattedMessage;
  }

  /**
   * Formats a message by replacing placeholders with values from metadata.
   *
   * @param message - The message string containing placeholders.
   * @param metadata - The metadata object providing values for placeholders.
   * @returns The formatted message with placeholders replaced by metadata values.
   */
  private static formatMessage(message: string, metadata: Metadata): string {
    const MAX_REPLACEMENTS = 100;
    let replacements = 0;

    if (typeof metadata !== "object") {
      throw new TypeError("Metadata must be an object");
    }

    return message.replaceAll(/{{\s*([^}\s]+)\s*}}/g, (match, key) => {
      if (replacements++ > MAX_REPLACEMENTS) {
        throw new Error("Too many replacements in message template");
      }

      if (typeof key !== "string") {
        throw new TypeError(`Metadata key must be a string`);
      }

      if (!(key in metadata)) {
        throw new Error(`Metadata key '${key}' not provided for message template`);
      }

      const value = metadata[key];

      if (typeof value !== "string" && typeof value !== "number") {
        throw new TypeError(`Metadata key '${key}' must be a string or number`);
      }

      return String(value);
    });
  }
}
