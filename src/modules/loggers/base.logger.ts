import type { HandlerError } from "../../core/handler-error";

interface InterfaceErrorLogger {
  /**
   * Logs an single error message.
   */
  log(): void;

  /**
   * Logs a chain of errors.
   */
  logChain?(): void;
}

/**
 * Abstract class representing an error logger.
 */
export abstract class ErrorLogger implements InterfaceErrorLogger {
  constructor(protected readonly error: HandlerError) {
    /* empty */
  }

  public abstract log(): void;
}
