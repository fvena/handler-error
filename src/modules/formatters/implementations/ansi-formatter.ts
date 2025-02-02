import type { HandlerError } from "../../../core/handler-error";
import { ErrorFormatter } from "../base-formatter";

export const ANSI_COLORS = {
  black: "\u001B[30m",
  blue: "\u001B[34m",
  cyan: "\u001B[36m",
  gray: "\u001B[90m",
  green: "\u001B[32m",
  magenta: "\u001B[35m",
  red: "\u001B[31m",
  white: "\u001B[37m",
  yellow: "\u001B[33m",
};

export const ANSI_COLORS_BRIGHT = {
  blackBright: "\u001B[90m",
  blueBright: "\u001B[94m",
  cyanBright: "\u001B[96m",
  grayBright: "\u001B[37m",
  greenBright: "\u001B[92m",
  magentaBright: "\u001B[95m",
  redBright: "\u001B[91m",
  whiteBright: "\u001B[97m",
  yellowBright: "\u001B[93m",
};

export const ANSI_BACKGROUND_COLORS = {
  black: "\u001B[40m",
  blue: "\u001B[44m",
  cyan: "\u001B[46m",
  gray: "\u001B[90m",
  green: "\u001B[42m",
  magenta: "\u001B[45m",
  red: "\u001B[41m",
  white: "\u001B[47m",
  yellow: "\u001B[43m",
};

export const ANSI_BACKGROUND_COLORS_BRIGHT = {
  blackBright: "\u001B[100m",
  blueBright: "\u001B[104m",
  cyanBright: "\u001B[106m",
  grayBright: "\u001B[100m",
  greenBright: "\u001B[102m",
  magentaBright: "\u001B[105m",
  redBright: "\u001B[101m",
  whiteBright: "\u001B[107m",
  yellowBright: "\u001B[103m",
};

export const ANSI_FORMATS = {
  bold: "\u001B[1m",
  dim: "\u001B[2m",
  hidden: "\u001B[8m",
  inverse: "\u001B[7m",
  italic: "\u001B[3m",
  reset: "\u001B[0m",
  strikethrough: "\u001B[9m",
  underline: "\u001B[4m",
};

export const colors = { ...ANSI_COLORS, ...ANSI_COLORS_BRIGHT };
export const backgroundColors = { ...ANSI_BACKGROUND_COLORS, ...ANSI_BACKGROUND_COLORS_BRIGHT };
export const formats = { ...ANSI_FORMATS };

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
