import type { HandlerError } from "../handler-error";
import type { FormatterOptions } from "../types/error-formatter.types";
import { ErrorFormatter } from "../modules/error-formatter";
import { isHandlerError } from "../guards/handler-error.guard";

export interface JsonFormatterOptions extends FormatterOptions {
  indentSize: number;
  showMetadata: boolean;
  showStackTrace: boolean;
  showTimestamp: boolean;
}

/**
 * Formatter that outputs errors in JSON format.
 */
export class JsonFormatter extends ErrorFormatter<JsonFormatterOptions> {
  private defaultOptions: JsonFormatterOptions = {
    indentSize: 2,
    showMetadata: true,
    showStackTrace: true,
    showTimestamp: true,
  };

  constructor(options?: Partial<JsonFormatterOptions>) {
    super();
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  /**
   * Formats a single error into JSON.
   *
   * @param error - The `HandlerError` to format.
   * @param options - Partial options to override the default formatting options.
   * @returns The formatted error string in JSON format.
   * @throws If the error is not an instance of `HandlerError`.
   */
  format(error: HandlerError, options?: Partial<JsonFormatterOptions>): string {
    if (!isHandlerError(error)) {
      throw new Error("Error must be an instance of HandlerError");
    }

    const customOptions = { ...this.defaultOptions, ...options };

    const formatted = {
      message: error.message,
      name: error.name,
      ...(customOptions.showStackTrace ? { stack: error.stack } : {}),
      ...(customOptions.showTimestamp ? { timestamp: error.timestamp.toISOString() } : {}),
      ...(customOptions.showMetadata ? { metadata: error.metadata } : {}),
    };

    // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
    return JSON.stringify(formatted, null, customOptions.indentSize);
  }

  /**
   * Formats a chain of errors into JSON.
   *
   * @param errors - An array of `HandlerError` instances to format.
   * @param options - Partial options to override the default formatting options.
   * @returns The formatted error chain string in JSON format.
   */
  override formatChain(error: HandlerError, options?: Partial<JsonFormatterOptions>): string {
    const customOptions = { ...this.defaultOptions, ...options };

    const mapError = (item: HandlerError) =>
      JSON.parse(this.format(item, customOptions)) as Record<string, unknown>;
    const chain = error.mapChain(mapError);

    // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
    return JSON.stringify(chain, null, customOptions.indentSize);
  }
}
