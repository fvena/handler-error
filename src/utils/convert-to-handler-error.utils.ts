import { HandlerError } from "../handler-error";
import { isHandlerError } from "../guards/handler-error.guard";

/**
 * Converts a standard `Error` instance into a `HandlerError` instance.
 *
 * @param error - The error to convert
 * @returns A `HandlerError` instance, or `undefined` if the input is not an error.
 */
export function convertToHandlerError(error: Error | undefined): HandlerError | undefined {
  if (!error) return undefined;
  if (!(error instanceof Error)) return undefined;

  return isHandlerError(error) ? error : new HandlerError(error.message);
}
