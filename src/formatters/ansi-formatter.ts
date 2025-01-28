import type { FormatterOptions } from "../types/error-formatter.types";
import type { HandlerError } from "../handler-error";
import { ErrorFormatter } from "../modules/error-formatter";
import { isHandlerError } from "../guards/handler-error.guard";
import { TextFormatter } from "./text-formatter";
import { colors, formats } from "./constants";

/**
 * Options for the ANSI formatter
 */
export interface AnsiFormatterOptions extends FormatterOptions {
  colors: boolean;
  showMetadata: boolean;
  showTimestamp: boolean;
}

/**
 * ANSI color formatter for terminal output
 */
export class AnsiFormatter extends ErrorFormatter<AnsiFormatterOptions> {
  private defaultOptions: AnsiFormatterOptions = {
    colors: true,
    showMetadata: false,
    showTimestamp: false,
  };

  constructor(options?: Partial<AnsiFormatterOptions>) {
    super();
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  private _fallbackFormatter?: TextFormatter;

  format(error: HandlerError, options?: Partial<AnsiFormatterOptions>): string {
    if (!isHandlerError(error)) {
      throw new Error("Error must be an instance of HandlerError");
    }

    const customOptions = { ...this.defaultOptions, ...options };

    if (!customOptions.colors) {
      // Perform fallback to text formatter if colors are disabled
      // We don't want to create a TextFormatter instance every time this method is called
      if (!this._fallbackFormatter) {
        this._fallbackFormatter = new TextFormatter();
      }

      return this._fallbackFormatter.format(error, customOptions);
    }

    let result = `${formats.bold}${colors.red}${error.name}${formats.reset}: `;
    result += error.message;

    if (customOptions.showTimestamp) {
      result = `${colors.gray}[${error.timestamp.toISOString()}]${formats.reset} ${result}`;
    }

    if (customOptions.showMetadata && error.metadata && Object.keys(error.metadata).length > 0) {
      result += `\n${formats.dim}Metadata: ${JSON.stringify(error.metadata)}${formats.reset}`;
    }

    return result;
  }

  override formatChain(error: HandlerError, options?: Partial<AnsiFormatterOptions>): string {
    const customOptions = { ...this.defaultOptions, ...options };

    const mapError = (item: HandlerError, index: number) => {
      const indent = index === 0 ? "" : "    ".repeat(index - 1);
      const prefix = index === 0 ? "" : `└── `;
      return `${indent}${prefix}${this.format(item, customOptions)}`;
    };

    return error.mapChain(mapError).join("\n");
  }
}
