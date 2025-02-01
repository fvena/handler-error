import type { HandlerError } from "../handler-error";

interface InterfaceErrorFormatter {
  /**
   * Formats a single error into a string.
   */
  format(): string;

  /**
   * Formats a chain of errors into a string.
   */
  formatChain?(): string;
}

/**
 * Base class for error formatters.
 */
export abstract class ErrorFormatter implements InterfaceErrorFormatter {
  constructor(protected readonly error: HandlerError) {
    /* empty */
  }

  public abstract format(): string;
}
