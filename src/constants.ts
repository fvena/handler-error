/**
 * Represents the severity levels for an error.
 *
 * - `'critical'`: Indicates an issue that requires immediate attention and may cause a system failure.
 * - `'error'`: Indicates an issue that requires attention but does not necessarily require immediate action.
 * - `'warning'`: Indicates an issue that should be addressed but does not require immediate attention.
 * - `'info'`: Indicates an informational message.
 * - `'debug'`: Indicates an issue that is useful for debugging but does not require immediate attention.
 */
/* eslint-disable perfectionist/sort-objects -- Keep the order of the constants */
export const ErrorSeverity = {
  CRITICAL: "critical",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  DEBUG: "debug",
} as const;
/* eslint-enable perfectionist/sort-objects */