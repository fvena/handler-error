import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/handler-error";
import { AnsiFormatter } from "../../src/formatters/ansi-formatter";
import { colors, formats } from "../../src/formatters/constants";

describe("AnsiFormatter", () => {
  describe("format", () => {
    it("should format error", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new AnsiFormatter(error);

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toBe(
        `${formats.bold}${colors.red}HandlerError${formats.reset}: Test error`,
      );
    });

    it("should format error with timestamp", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new AnsiFormatter(error, { showTimestamp: true });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toBe(
        `${colors.gray}[${error.timestamp.toISOString()}]${formats.reset} ${formats.bold}${colors.red}HandlerError${formats.reset}: Test error`,
      );
    });

    it("should format error with metadata", () => {
      // Arrange
      const error = new HandlerError("Test error", { key: "value" });
      const formatter = new AnsiFormatter(error, { showMetadata: true });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toBe(
        `${formats.bold}${colors.red}HandlerError${formats.reset}: Test error\n${formats.dim}Metadata: {"key":"value"}${formats.reset}`,
      );
    });

    it("should format error with all options", () => {
      // Arrange
      const error = new HandlerError("Test error", { key: "value" });
      const formatter = new AnsiFormatter(error, { showMetadata: true, showTimestamp: true });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toBe(
        `${colors.gray}[${error.timestamp.toISOString()}]${formats.reset} ${formats.bold}${colors.red}HandlerError${formats.reset}: Test error\n${formats.dim}Metadata: {"key":"value"}${formats.reset}`,
      );
    });
  });

  describe("formatChain", () => {
    const rootError = new HandlerError("Root error");
    const middleError = new HandlerError("Middle error", rootError);
    const topError = new HandlerError("Top error", middleError);

    it("should format error chain", () => {
      // Arrange
      const formatter = new AnsiFormatter(topError);

      // Act
      const formatted = formatter.formatChain();

      // Assert
      expect(formatted).toBe(
        [
          `${formats.bold}${colors.red}HandlerError${formats.reset}: Top error`,
          `└── ${formats.bold}${colors.red}HandlerError${formats.reset}: Middle error`,
          `    └── ${formats.bold}${colors.red}HandlerError${formats.reset}: Root error`,
        ].join("\n"),
      );
    });

    it("should format error chain with timestamp", () => {
      // Arrange
      const formatter = new AnsiFormatter(topError, { showTimestamp: true });

      // Act
      const formatted = formatter.formatChain();

      // Assert
      expect(formatted).toBe(
        [
          `${colors.gray}[${topError.timestamp.toISOString()}]${formats.reset} ${formats.bold}${colors.red}HandlerError${formats.reset}: Top error`,
          `└── ${colors.gray}[${middleError.timestamp.toISOString()}]${formats.reset} ${formats.bold}${colors.red}HandlerError${formats.reset}: Middle error`,
          `    └── ${colors.gray}[${rootError.timestamp.toISOString()}]${formats.reset} ${formats.bold}${colors.red}HandlerError${formats.reset}: Root error`,
        ].join("\n"),
      );
    });
  });
});
