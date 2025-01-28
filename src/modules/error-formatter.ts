import type { FormatterOptions } from "../types/error-formatter.types";
import type { HandlerError } from "../handler-error";
import { isHandlerError } from "../guards";
import { ErrorChain } from "./error-chain";

/**
 * Base class for error formatters.
 */
export abstract class ErrorFormatter<T extends FormatterOptions | undefined = undefined> {
  /**
   * Formats a single error into a string.
   *
   * @param error - The error to format.
   * @param options - Optional additional formatting options.
   * @returns The formatted error string.
   */
  public abstract format(error: HandlerError, options?: T): string;

  /**
   * Formats a chain of errors into a string using the format method.
   *
   * @param errors - The array of errors to format.
   * @param options - Optional additional formatting options.
   * @returns The formatted error chain string.
   */
  public formatChain(error: HandlerError, options?: T): string {
    if (!isHandlerError(error)) {
      throw new TypeError("The error must be an instance of HandlerError.");
    }

    const chain = ErrorChain.mapErrors(error, (item) => this.format(item, options));
    return chain.join("\n");
  }
}
