import { ErrorSeverity } from "../constants";

/**
 * Represents the severity levels for an error.
 */
export type Severity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity];

/**
 * Represents the additional data associated with an error.
 */
export type Metadata = Record<string, unknown>;
