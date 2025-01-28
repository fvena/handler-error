import type { HandlerError } from "../handler-error";
import type { FormatterOptions } from "../types/error-formatter.types";
import { ErrorFormatter } from "../modules/error-formatter";
import { isHandlerError } from "../guards/handler-error.guard";

export interface HtmlFormatterOptions extends FormatterOptions {
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

function escapeHTML(input: string): string {
  const map: Record<string, string> = {
    '"': "&quot;",
    "&": "&amp;",
    "'": "&#039;",
    "/": "&#x2F;",
    "<": "&lt;",
    ">": "&gt;",
    "`": "&#x60;",
  };

  return input.replaceAll(/[&<>"'`/]/g, (char) => map[char] ?? "");
}

/**
 * HTML formatter for web display
 */
export class HtmlFormatter extends ErrorFormatter<HtmlFormatterOptions> {
  private defaultOptions: HtmlFormatterOptions = {
    showMetadata: true,
    showStackTrace: false,
    showTimestamp: true,
  };

  constructor(options?: Partial<HtmlFormatterOptions>) {
    super();
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  format(error: HandlerError, options?: Partial<HtmlFormatterOptions>): string {
    if (!isHandlerError(error)) {
      throw new Error("Error must be an instance of HandlerError");
    }

    const customOptions = { ...this.defaultOptions, ...options };

    return `
      <div class="error ${lowercaseFirstLetter(error.name)}">
        <h3 class="error-title">${error.name}</h3>
        <p class="error-message">${escapeHTML(error.message)}</p>
        ${customOptions.showTimestamp ? `<div class="error-timestamp">${error.timestamp.toISOString()}</div>` : ""}
        ${customOptions.showMetadata && error.metadata ? `<div class="error-metadata"><pre>${escapeHTML(JSON.stringify(error.metadata))}</pre></div>` : ""}
        ${customOptions.showStackTrace && error.stack ? `<pre class="error-stack">${error.stack}</pre>` : ""}
      </div>
    `;
  }

  override formatChain(error: HandlerError, options?: Partial<HtmlFormatterOptions>): string {
    const customOptions = { ...this.defaultOptions, ...options };

    const mapError = (item: HandlerError) => this.format(item, customOptions);
    const chain = error.mapChain(mapError);

    return `<div class="error-chain">${chain.join("\n")}</div>`;
  }
}
