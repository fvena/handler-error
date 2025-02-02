import type { SerializedErrorChain } from "../types/serialize.types";
import { SEVERITY_WEIGHTS } from "../constants";
import { HandlerError } from "../handler-error";

/**
 * Retrieves the chain of errors starting from the root error.
 * Note: The return value is guaranteed to be non-null as the chain will always contain
 * at least the error passed to the function.
 *
 * @returns An array of `HandlerError` instances representing the chain.
 */
function getErrorsChain(error: HandlerError): HandlerError[] {
  const chain = new Set<HandlerError>([error]);

  let currentError = error;

  while (currentError.cause) {
    // Avoid infinite loops caused by circular references in the error chain.
    // Circular references would occur if an error is processed again after it has already been processed.
    if (chain.has(currentError.cause)) {
      break;
    }

    chain.add(currentError.cause);
    currentError = currentError.cause;
  }

  return [...chain];
}

/**
 * Retrieves the root error of the chain, which is the deepest error in the hierarchy.
 *
 * @returns The root `HandlerError` instance.
 */
function getRootCause(error: HandlerError): HandlerError {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Guaranteed by the constructor
  return getErrorsChain(error).at(-1)!;
}

/**
 * Applies a mapper function to each error in the chain and returns the resulting array.
 *
 * @param mapper - A function to apply to each `HandlerError` instance.
 * @returns An array of results from the mapper function.
 */
function mapErrors<T>(error: HandlerError, mapper: (error: HandlerError, index: number) => T): T[] {
  return getErrorsChain(error).map((item, index) => mapper(item, index));
}

/**
 * Retrieves the error with the highest severity in the chain.
 *
 * @returns The `HandlerError` instance with the maximum severity.
 */
function findMostSevere(error: HandlerError): HandlerError {
  return getErrorsChain(error).reduce((maxSeverity, error) => {
    const errorWeight = SEVERITY_WEIGHTS[error.severity];
    const maxWeight = SEVERITY_WEIGHTS[maxSeverity.severity];

    return errorWeight > maxWeight ? error : maxSeverity;
  });
}

/**
 * Serializes the chain of errors into an array of plain objects.
 *
 * @returns An array of serialized errors, each containing key properties.
 */
function chainSerialize(error: HandlerError): SerializedErrorChain[] {
  return getErrorsChain(error).map((item) => ({
    id: item.id,
    message: item.message,
    metadata: item.metadata,
    name: item.name,
    severity: item.severity,
    timestamp: item.timestamp.toISOString(),
  }));
}

/**
 * Returns a human-readable string representation of the error chain.
 *
 * @returns A string representation of the error chain.
 */
function chainToString(error: HandlerError): string {
  return getErrorsChain(error)
    .map((item) => item.toString())
    .join("\n");
}

export const ErrorChainUtils = {
  chainSerialize,
  chainToString,
  findMostSevere,
  getErrorsChain,
  getRootCause,
  mapErrors,
};
