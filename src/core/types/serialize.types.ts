import type { Metadata, Severity } from "./handler-error.types";

/**
 * Represents the serialized error.
 */
export interface SerializedError {
  [key: string]: unknown;
  cause?: SerializedError;
  code?: string;
  id: string;
  message: string;
  metadata?: Metadata;
  name: string;
  severity: Severity;
  timestamp: string;
}
