import type { HandlerError } from "../../../core/handler-error";
import { ErrorFormatter } from "../base.formatter";
import { escapeText } from "../../../core/utils/escape-text.utils";

export interface HtmlFormatterOptions {
  showMetadata: boolean;
  showStackTrace: boolean;
  showTimestamp: boolean;
}

/**
 * Lowercase the first letter of a string.
 *
 * @param string_ - The string to lowercase.
 * @returns The string with the first letter lowercased.
 */
function lowercaseFirstLetter(string_: string) {
  if (!string_) return string_;
  return string_.charAt(0).toLowerCase() + string_.slice(1);
}

/**
 * HTML formatter for web display
 */
export class HtmlFormatter extends ErrorFormatter {
  private options: HtmlFormatterOptions = {
    showMetadata: true,
    showStackTrace: false,
    showTimestamp: true,
  };

  constructor(error: HandlerError, options?: Partial<HtmlFormatterOptions>) {
    super(error);
    this.options = { ...this.options, ...options };
  }

  private formatError(error: HandlerError, options: HtmlFormatterOptions): string {
    return `
      <div class="error ${lowercaseFirstLetter(error.name)}">
        <h3 class="error-title">${error.name}</h3>
        <p class="error-message">${escapeText(error.message)}</p>
        ${options.showTimestamp ? `<div class="error-timestamp">${error.timestamp.toISOString()}</div>` : ""}
        ${options.showMetadata && error.metadata ? `<div class="error-metadata"><pre>${escapeText(JSON.stringify(error.metadata))}</pre></div>` : ""}
        ${options.showStackTrace && error.stack ? `<pre class="error-stack">${escapeText(error.stack)}</pre>` : ""}
      </div>
    `;
  }

  public format(options?: Partial<HtmlFormatterOptions>): string {
    const customOptions = { ...this.options, ...options };

    return this.formatError(this.error, customOptions);
  }

  public formatChain(options?: Partial<HtmlFormatterOptions>): string {
    const customOptions = { ...this.options, ...options };
    const mapError = (error: HandlerError) => this.formatError(error, customOptions);

    const chain = this.error.chain.map((error) => mapError(error)).join("\n");

    return `<div class="error-chain">${chain}</div>`;
  }
}
