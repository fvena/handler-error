import type { Metadata } from "../types/handler-error.types";
import { HandlerError } from "../handler-error";
import { convertToHandlerError } from "./convert-to-handler-error.utils";

function isMetadata(value: unknown): value is Metadata {
  return typeof value === "object" && value !== null;
}

/**
 * Processes the provided arguments and extracts the cause, code, and metadata for a `HandlerError` instance.
 *
 * @param argument2 - Can be an `Error`, `Metadata`, or a string representing the error code.
 * @param argument3 - Can be an `Error` or `Metadata`.
 * @param argument4 - Must be an `Error` if provided.
 * @returns An object containing:
 * - `cause`: The converted `HandlerError` instance if a cause is provided.
 * - `code`: The error code if provided.
 * - `metadata`: Additional metadata if provided.
 */
export function processArguments(
  argument2?: Error | Metadata | string,
  argument3?: Error | Metadata,
  argument4?: Error,
) {
  let cause: HandlerError | undefined;
  let code: string | undefined;
  let metadata: Metadata | undefined;

  if (typeof argument2 === "string") {
    code = argument2;

    if (argument3 && !(argument3 instanceof Error)) {
      metadata = isMetadata(argument3) ? argument3 : undefined;

      if (argument4 && argument4 instanceof Error) {
        cause = convertToHandlerError(argument4);
      }
    } else if (argument3 && argument3 instanceof Error) {
      cause = convertToHandlerError(argument3);
    }
  } else if (argument2 && argument2 instanceof Error) {
    cause = convertToHandlerError(argument2);
  } else if (argument2) {
    metadata = isMetadata(argument2) ? argument2 : undefined;

    if (argument3 && argument3 instanceof Error) {
      cause = convertToHandlerError(argument3);
    }
  }

  return { cause, code, metadata };
}
