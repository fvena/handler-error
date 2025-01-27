import type { Metadata } from "./types/handler-error.types";
import { HandlerError } from "./handler-error";
import { ErrorCatalog } from "./modules/error-catalog";

export class CodeHandlerError extends HandlerError {
  constructor(
    code: string,
    argument2?: Error | Metadata | string,
    argument3?: Error | Metadata,
    argument4?: Error,
  ) {
    // Retrieve the catalog entry based on the error code
    const catalogEntry = ErrorCatalog.getEntry(code);

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
}
