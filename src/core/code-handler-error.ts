import type { Metadata } from "./types/handler-error.types";
import { ErrorCatalog } from "../modules/catalogs/base-catalog";
import { HandlerError } from "./handler-error";

export class CodeHandlerError extends HandlerError {
  private static catalog?: ErrorCatalog;

  constructor(
    code: string,
    argument2?: Error | Metadata | string,
    argument3?: Error | Metadata,
    argument4?: Error,
  ) {
    // Retrieve the catalog entry based on the error code
    const currentCatalog = new.target.catalog;

    if (!currentCatalog) {
      throw new Error(
        "The error catalog must be set before creating an instance of CodeHandlerError.",
      );
    }

    const catalogEntry = currentCatalog.getEntry(code);

    // Reorganize arguments for the base class constructor
    // - If the second argument is a string, it is the error message
    // - In all other cases, only could have two more arguments, metadata and cause
    if (typeof argument2 === "string") {
      // override the catalog entry message with the provided message
      const message = argument2;
      super(message, code, argument3, argument4);
    } else {
      const message = catalogEntry.message;
      super(message, code, argument2, argument3 as Error);
    }

    // Set the severity of the error based on the catalog entry
    Object.defineProperty(this, "severity", { value: catalogEntry.severity, writable: false });
  }

  /**
   * Set the error catalog to use for error resolution
   *
   * @param catalog - The error catalog to use for error resolution
   */
  public static registerCatalog(catalog: ErrorCatalog) {
    this.catalog = catalog;
    return this;
  }
}
