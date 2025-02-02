import type { HandlerError } from "../../../core/handler-error";
import { ErrorFormatter } from "../base-formatter";

export interface TextFormatterOptions {
  showMetadata: boolean;
  showTimestamp: boolean;
}
/**
 * Simple text formatter
 */
export class TextFormatter extends ErrorFormatter {
  private options: TextFormatterOptions = {
    showMetadata: true,
    showTimestamp: true,
  };

  constructor(error: HandlerError, options?: Partial<TextFormatterOptions>) {
    super(error);
    this.options = { ...this.options, ...options };
  }

  private formatError(error: HandlerError, options: TextFormatterOptions): string {
    let result = `${error.name}: ${error.message}`;

    if (options.showTimestamp) {
      result = `[${error.timestamp.toISOString()}] ${result}`;
    }

    if (options.showMetadata) {
      const metadata = error.metadata;

      if (metadata && Object.keys(metadata).length > 0) {
        result += `\nMetadata: ${JSON.stringify(metadata)}`;
      }
    }

    return result;
  }

  public format(options?: Partial<TextFormatterOptions>): string {
    const customOptions = { ...this.options, ...options };

    return this.formatError(this.error, customOptions);
  }

  public formatChain(options?: Partial<TextFormatterOptions>): string {
    const customOptions = { ...this.options, ...options };

    const mapError = (error: HandlerError, index: number) => {
      const indent = index === 0 ? "" : "    ".repeat(index - 1);
      const prefix = index === 0 ? "" : `└── `;
      return `${indent}${prefix}${this.formatError(error, customOptions)}`;
    };

    return this.error.chain.map((error, index) => mapError(error, index)).join("\n");
  }
}
