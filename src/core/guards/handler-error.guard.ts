import { HandlerError } from "../handler-error";

/**
 * Type guard function to determine if a given error is an instance of `HandlerError`.
 *
 * @param error - The error object to check.
 * @returns `true` if the error is an instance of `HandlerError`, otherwise `false`.
 */
export function isHandlerError(error: Error): error is HandlerError {
  return error instanceof HandlerError;
}
