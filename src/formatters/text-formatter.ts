import type { HandlerError } from "../handler-error";
import type { FormatterOptions } from "../types/error-formatter.types";
import { ErrorFormatter } from "../modules/error-formatter";
import { isHandlerError } from "../guards/handler-error.guard";

export interface TextFormatterOptions extends FormatterOptions {
  showMetadata: boolean;
  showTimestamp: boolean;
}
/**
 * Simple text formatter
 */
export class TextFormatter extends ErrorFormatter<TextFormatterOptions> {
  private defaultOptions: TextFormatterOptions = {
    showMetadata: true,
    showTimestamp: true,
  };

  constructor(options?: Partial<TextFormatterOptions>) {
    super();
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  format(error: HandlerError, options?: Partial<TextFormatterOptions>): string {
    if (!isHandlerError(error)) {
      throw new Error("Error must be an instance of HandlerError");
    }

    const customOptions = { ...this.defaultOptions, ...options };

    let result = `${error.name}: ${error.message}`;

    if (customOptions.showTimestamp) {
      result = `[${error.timestamp.toISOString()}] ${result}`;
    }

    if (customOptions.showMetadata) {
      const metadata = error.metadata;

      if (metadata && Object.keys(metadata).length > 0) {
        result += `\nMetadata: ${JSON.stringify(metadata)}`;
      }
    }

    return result;
  }

  override formatChain(error: HandlerError, options?: Partial<TextFormatterOptions>): string {
    if (!isHandlerError(error)) {
      throw new Error("Error must be an instance of HandlerError");
    }

    const customOptions = { ...this.defaultOptions, ...options };

    const mapError = (item: HandlerError, index: number) => {
      const indent = index === 0 ? "" : "    ".repeat(index - 1);
      const prefix = index === 0 ? "" : `└── `;
      return `${indent}${prefix}${this.format(item, customOptions)}`;
    };

    return error.mapChain(mapError).join("\n");
  }
}
