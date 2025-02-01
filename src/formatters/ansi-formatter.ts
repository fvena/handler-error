import type { HandlerError } from "../handler-error";
import { ErrorFormatter } from "../modules/error-formatter";
import { colors, formats } from "./constants";

/**
 * Options for the ANSI formatter
 */
export interface AnsiFormatterOptions {
  showMetadata: boolean;
  showTimestamp: boolean;
}

/**
 * ANSI color formatter for terminal output
 */
export class AnsiFormatter extends ErrorFormatter {
  private options: AnsiFormatterOptions = {
    showMetadata: false,
    showTimestamp: false,
  };

  constructor(error: HandlerError, options?: Partial<AnsiFormatterOptions>) {
    super(error);
    this.options = { ...this.options, ...options };
  }

  private formatError(error: HandlerError, options: AnsiFormatterOptions): string {
    let result = `${formats.bold}${colors.red}${error.name}${formats.reset}: `;
    result += error.message;

    if (options.showTimestamp) {
      result = `${colors.gray}[${error.timestamp.toISOString()}]${formats.reset} ${result}`;
    }

    if (options.showMetadata && error.metadata && Object.keys(error.metadata).length > 0) {
      result += `\n${formats.dim}Metadata: ${JSON.stringify(error.metadata)}${formats.reset}`;
    }

    return result;
  }

  /**
   * Formats the error into a string
   *
   * @param options - Options for the formatter
   */
  public format(options?: Partial<AnsiFormatterOptions>): string {
    const customOptions = { ...this.options, ...options };

    return this.formatError(this.error, customOptions);
  }

  /**
   * Formats the error chain into a string
   *
   * @param options - Options for the formatter
   */
  public formatChain(options?: Partial<AnsiFormatterOptions>): string {
    const customOptions = { ...this.options, ...options };

    const mapError = (error: HandlerError, index: number) => {
      const indent = index === 0 ? "" : "    ".repeat(index - 1);
      const prefix = index === 0 ? "" : `└── `;
      return `${indent}${prefix}${this.formatError(error, customOptions)}`;
    };

    return this.error.mapChain(mapError).join("\n");
  }
}
