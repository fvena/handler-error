import type { HandlerError } from "../handler-error";
import type { Severity } from "../types";
import type { ErrorFormatter } from "./error-formatter";
import { isHandlerError } from "../guards";
import { ErrorSeverity, SEVERITY_WEIGHTS } from "../constants";

export class ErrorLogger {
  private minSeverity: Severity;
  private formatter?: ErrorFormatter;

  constructor(minSeverity?: Severity, formatter?: ErrorFormatter) {
    this.minSeverity = minSeverity ?? ErrorSeverity.DEBUG;
    this.formatter = formatter;
  }

  public log(error: HandlerError, displayChainErrors = false): void {
    if (!isHandlerError(error)) {
      throw new TypeError("The error must be an instance of HandlerError.");
    }

    if (SEVERITY_WEIGHTS[error.severity] >= SEVERITY_WEIGHTS[this.minSeverity]) {
      if (this.formatter) {
        const message = displayChainErrors
          ? this.formatter.formatChain(error)
          : this.formatter.format(error);
        console.log(message);
      }

      const message = displayChainErrors ? error.toStringChain() : error.toString();

      switch (error.severity) {
        case ErrorSeverity.CRITICAL: {
          console.error(message);
          break;
        }
        case ErrorSeverity.DEBUG: {
          console.debug(message);
          break;
        }
        case ErrorSeverity.ERROR: {
          console.error(message);
          break;
        }
        case ErrorSeverity.INFO: {
          console.info(message);
          break;
        }
        case ErrorSeverity.WARNING: {
          console.warn(message);
          break;
        }
        default: {
          console.log(message);
        }
      }
    }
  }
}
