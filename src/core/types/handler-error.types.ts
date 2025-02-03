import type { HandlerError } from "../handler-error";
import type { SerializedError } from "./serialize.types";
import { ErrorSeverity } from "../constants";

/**
 * Represents the severity levels for an error.
 */
export type Severity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity];

/**
 * Represents the additional data associated with an error.
 */
export type Metadata = Record<string, unknown>;

export interface HandlerErrorChainAPI {
  get: () => HandlerError[];
  map: <T>(mapper: (error: HandlerError, index: number) => T) => T[];
  mostSevere: () => HandlerError;
  root: () => HandlerError;
  serialize: () => SerializedError[];
  toString: () => string;
}

export interface ProcessedArguments {
  cause?: HandlerError;
  code?: string;
  metadata?: Metadata;
}
