import type { Metadata, Severity } from "./types/handler-error.types";
import type { SerializedError, SerializedErrorChain } from "./types/serialize.types";
import { randomUUID } from "node:crypto";
import { ErrorSeverity } from "./constants";
import { processArguments } from "./utils/process-arguments.utils";
import { ErrorChain } from "./modules/error-chain";

/**
 * Base error class for handling errors.
 */
export class HandlerError extends Error {
  public readonly id: string; // Unique identifier for the error instance.
  public readonly timestamp: Date; // Timestamp of when the error occurred.
  public readonly severity: Severity; // Severity level of the error.
  public readonly code?: string; // Error code for the error.
  public readonly metadata?: Metadata; // Additional information to provide context for the error.
  public override cause?: HandlerError; // The cause of the error.

  constructor(
    message: string,
    argument2?: Error | Metadata | string,
    argument3?: Error | Metadata,
    argument4?: Error,
  ) {
    if (!message || typeof message !== "string") {
      throw new Error(
        "The `message` argument is required and must be a non-empty string. This argument is used to describe the error that occurred. Verify that the argument is not `undefined`, `null`, or an empty string. Example: `new CustomError('An error occurred.')`.",
      );
    }

    super(message);

    // Initialize basic properties
    this.id = randomUUID();
    this.name = this.constructor.name;
    this.severity = ErrorSeverity.ERROR;
    this.timestamp = new Date();

    // Parse constructor arguments
    const { cause, code, metadata } = processArguments(argument2, argument3, argument4);
    this.cause = cause;
    this.code = code;
    this.metadata = metadata;
  }

  /**
   * Creates a new `HandlerError` instance with the Critical severity.
   */
  public static critical = class CriticalHandlerError extends HandlerError {
    override readonly severity: Severity = ErrorSeverity.CRITICAL;
  };

  /**
   * Creates a new `HandlerError` instance with the Error severity.
   */
  public static error = class ErrorHandlerError extends HandlerError {
    override readonly severity: Severity = ErrorSeverity.ERROR;
  };

  /**
   * Creates a new `HandlerError` instance with the Warning severity.
   */
  public static warning = class WarningHandlerError extends HandlerError {
    override readonly severity: Severity = ErrorSeverity.WARNING;
  };

  /**
   * Creates a new `HandlerError` instance with the Info severity.
   */
  public static info = class InfoHandlerError extends HandlerError {
    override readonly severity: Severity = ErrorSeverity.INFO;
  };

  /**
   * Creates a new `HandlerError` instance with the Debug severity.
   */
  public static debug = class DebugHandlerError extends HandlerError {
    override readonly severity: Severity = ErrorSeverity.DEBUG;
  };

  /**
   * Retrieves the chain of errors starting from the root error.
   */
  public getChain(): HandlerError[] {
    return ErrorChain.getErrorChain(this);
  }

  /**
   * Retrieves the root error of the chain, which is the deepest error in the hierarchy.
   */
  public getChainRoot(): HandlerError {
    return ErrorChain.getRootCause(this);
  }

  /**
   * Applies a mapper function to each error in the chain and returns the resulting array.
   */
  public mapChain<T>(mapper: (error: HandlerError, index: number) => T): T[] {
    return ErrorChain.mapErrors(this, mapper);
  }

  /**
   * Retrieves the error with the highest severity in the chain.
   */
  public findMostSevereInChain(): HandlerError {
    return ErrorChain.findMostSevere(this);
  }

  /**
   * Serializes the chain of errors into an array of plain objects.
   */
  public serializeChain(): SerializedErrorChain[] {
    return ErrorChain.serialize(this);
  }

  public toStringChain(): string {
    return ErrorChain.toString(this);
  }

  /**
   * Serializes the error into a plain object.
   *
   * @returns An object representing the serialized error.
   */
  public serialize(): SerializedError {
    return {
      cause: this.cause?.serialize(),
      id: this.id,
      message: this.message,
      metadata: this.metadata,
      name: this.name,
      severity: this.severity,
      timestamp: this.timestamp.toISOString(),
    };
  }

  /**
   * Returns a human-readable string representation of the error.
   *
   * @returns A string representation of the error.
   */
  override toString() {
    return `[${this.severity.toUpperCase()}${this.code ? ` ${this.code}` : ""}] ${this.name}: ${this.message}`;
  }
}
