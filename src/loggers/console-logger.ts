import type { HandlerError } from "../handler-error";
import type { ErrorFormatter } from "../modules/error-formatter";
import type { Severity } from "../types/handler-error.types";
import { ErrorLogger } from "../modules/error-logger";
import { ErrorSeverity, SEVERITY_WEIGHTS } from "../constants";

export interface ConsoleLoggerOptions {
  formatter?: new (error: HandlerError, options?: Record<string, unknown>) => ErrorFormatter;
  formatterOptions?: Record<string, unknown> | undefined;
  minSeverity: Severity;
}

export class ConsoleLogger extends ErrorLogger {
  private options: ConsoleLoggerOptions = {
    minSeverity: "debug",
  };

  constructor(error: HandlerError, options?: Partial<ConsoleLoggerOptions>) {
    super(error);
    this.options = { ...this.options, ...options };

    if (!Object.prototype.hasOwnProperty.call(SEVERITY_WEIGHTS, this.options.minSeverity)) {
      throw new Error(`Invalid severity level: ${this.options.minSeverity}`);
    }
  }

  private loggerError(error: HandlerError, message: string, minSeverity: Severity): void {
    if (SEVERITY_WEIGHTS[error.severity] >= SEVERITY_WEIGHTS[minSeverity]) {
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

  public log(options?: Partial<ConsoleLoggerOptions>): void {
    const customOptions = { ...this.options, ...options };
    let message = this.error.toString();

    if (customOptions.formatter) {
      const formatterOptions = customOptions.formatterOptions;
      message = new customOptions.formatter(this.error, formatterOptions).format();
    }

    this.loggerError(this.error, message, customOptions.minSeverity);
  }

  private hasFormatChain(
    formatter: ErrorFormatter,
  ): formatter is ErrorFormatter & { formatChain: () => string } {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any -- Checking for a optional method
    return typeof (formatter as any).formatChain === "function";
  }

  public logChain(options?: Partial<ConsoleLoggerOptions>): void {
    const customOptions = { ...this.options, ...options };
    let message = this.error.toStringChain();

    if (customOptions.formatter) {
      const formatterOptions = customOptions.formatterOptions;
      const formatterInstance = new customOptions.formatter(this.error, formatterOptions);

      if (this.hasFormatChain(formatterInstance)) {
        message = formatterInstance.formatChain();
      } else {
        throw new TypeError("Formatter does not support formatChain");
      }
    }

    this.loggerError(this.error, message, customOptions.minSeverity);
  }
}
