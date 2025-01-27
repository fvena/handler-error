import type { SerializedErrorChain } from "../types/serialize.types";
import { SEVERITY_WEIGHTS } from "../constants";
import { HandlerError } from "../handler-error";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- Class is used as a namespace
export class ErrorChain {
  /**
   * Retrieves the chain of errors starting from the root error.
   *
   * @returns An array of `HandlerError` instances representing the chain.
   */
  public static getErrorChain(error: HandlerError): HandlerError[] {
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
  public static getRootCause(error: HandlerError): HandlerError {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Guaranteed by the constructor
    return ErrorChain.getErrorChain(error).at(-1)!;
  }

  /**
   * Applies a mapper function to each error in the chain and returns the resulting array.
   *
   * @param mapper - A function to apply to each `HandlerError` instance.
   * @returns An array of results from the mapper function.
   */
  public static mapErrors<T>(
    error: HandlerError,
    mapper: (error: HandlerError, index: number) => T,
  ): T[] {
    return ErrorChain.getErrorChain(error).map((item, index) => mapper(item, index));
  }

  /**
   * Retrieves the error with the highest severity in the chain.
   *
   * @returns The `HandlerError` instance with the maximum severity.
   */
  public static findMostSevere(error: HandlerError): HandlerError {
    return ErrorChain.getErrorChain(error).reduce((maxSeverity, error) => {
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
  public static serialize(error: HandlerError): SerializedErrorChain[] {
    return ErrorChain.getErrorChain(error).map((item) => ({
      id: item.id,
      message: item.message,
      metadata: item.metadata,
      name: item.name,
      severity: item.severity,
      timestamp: item.timestamp.toISOString(),
    }));
  }
}
