import type { HandlerError } from "../../../core/handler-error";
import { ErrorFormatter } from "../base-formatter";

export interface JsonFormatterOptions {
  indentSize: number;
  showMetadata: boolean;
  showStackTrace: boolean;
  showTimestamp: boolean;
}

/**
 * Formatter that outputs errors in JSON format.
 */
export class JsonFormatter extends ErrorFormatter {
  private options: JsonFormatterOptions = {
    indentSize: 2,
    showMetadata: true,
    showStackTrace: true,
    showTimestamp: true,
  };

  constructor(error: HandlerError, options?: Partial<JsonFormatterOptions>) {
    super(error);
    this.options = { ...this.options, ...options };
  }

  private formatError(error: HandlerError, options: JsonFormatterOptions): string {
    const formatted = {
      message: error.message,
      name: error.name,
      ...(options.showStackTrace ? { stack: error.stack } : {}),
      ...(options.showTimestamp ? { timestamp: error.timestamp.toISOString() } : {}),
      ...(options.showMetadata ? { metadata: error.metadata } : {}),
    };

    // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
    return JSON.stringify(formatted, null, options.indentSize);
  }

  /**
   * Formats a single error into JSON.
   *
   * @param error - The `HandlerError` to format.
   * @param options - Partial options to override the default formatting options.
   * @returns The formatted error string in JSON format.
   * @throws If the error is not an instance of `HandlerError`.
   */
  public format(options?: Partial<JsonFormatterOptions>): string {
    const customOptions = { ...this.options, ...options };

    return this.formatError(this.error, customOptions);
  }

  /**
   * Formats a chain of errors into JSON.
   *
   * @param errors - An array of `HandlerError` instances to format.
   * @param options - Partial options to override the default formatting options.
   * @returns The formatted error chain string in JSON format.
   */
  public formatChain(options?: Partial<JsonFormatterOptions>): string {
    const customOptions = { ...this.options, ...options };

    const mapError = (error: HandlerError) =>
      JSON.parse(this.formatError(error, customOptions)) as Record<string, unknown>;
    const chain = this.error.mapChain(mapError);

    // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
    return JSON.stringify(chain, null, customOptions.indentSize);
  }
}
