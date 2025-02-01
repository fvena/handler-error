import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/handler-error";
import { TextFormatter } from "../../src/formatters/text-formatter";

describe("TextFormatter", () => {
  describe("format", () => {
    it("should format error with text", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new TextFormatter(error, { showMetadata: false, showTimestamp: false });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toBe(`HandlerError: Test error`);
    });

    it("should format error with text with timestamp", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new TextFormatter(error, { showMetadata: false, showTimestamp: true });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toBe(`[${error.timestamp.toISOString()}] HandlerError: Test error`);
    });

    it("should format error with text with metadata", () => {
      // Arrange
      const error = new HandlerError("Test error", { key: "value" });
      const formatter = new TextFormatter(error, { showMetadata: true, showTimestamp: false });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toBe(`HandlerError: Test error\nMetadata: {"key":"value"}`);
    });

    it("should format error with text with all options", () => {
      // Arrange
      const error = new HandlerError("Test error", { key: "value" });
      const formatter = new TextFormatter(error, { showMetadata: true, showTimestamp: true });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toContain(
        `[${error.timestamp.toISOString()}] HandlerError: Test error\nMetadata: {"key":"value"}`,
      );
    });
  });

  describe("formatChain", () => {
    it("should format error chain with text", () => {
      // Arrange
      const rootError = new HandlerError("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);
      const formatter = new TextFormatter(topError, { showMetadata: false, showTimestamp: false });

      // Act
      const formatted = formatter.formatChain();

      // Assert
      expect(formatted).toBe(
        [
          `HandlerError: Top error`,
          `└── HandlerError: Middle error`,
          `    └── HandlerError: Root error`,
        ].join("\n"),
      );
    });

    it("should format error chain with text with timestamp", () => {
      // Arrange
      const rootError = new HandlerError("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);
      const formatter = new TextFormatter(topError, { showMetadata: false, showTimestamp: true });

      // Act
      const formatted = formatter.formatChain();

      // Assert
      expect(formatted).toBe(
        [
          `[${topError.timestamp.toISOString()}] HandlerError: Top error`,
          `└── [${middleError.timestamp.toISOString()}] HandlerError: Middle error`,
          `    └── [${rootError.timestamp.toISOString()}] HandlerError: Root error`,
        ].join("\n"),
      );
    });

    it("should format error chain with text with metadata", () => {
      // Arrange
      const rootError = new HandlerError("Root error", { key: "value" });
      const middleError = new HandlerError("Middle error", { key: "value" }, rootError);
      const topError = new HandlerError("Top error", { key: "value" }, middleError);
      const formatter = new TextFormatter(topError, { showMetadata: true, showTimestamp: false });

      // Act
      const formatted = formatter.formatChain();

      // Assert
      expect(formatted).toBe(
        [
          `HandlerError: Top error\nMetadata: {"key":"value"}`,
          `└── HandlerError: Middle error\nMetadata: {"key":"value"}`,
          `    └── HandlerError: Root error\nMetadata: {"key":"value"}`,
        ].join("\n"),
      );
    });

    it("should format error chain with text with all options", () => {
      // Arrange
      const rootError = new HandlerError("Root error", { key: "value" });
      const middleError = new HandlerError("Middle error", { key: "value" }, rootError);
      const topError = new HandlerError("Top error", { key: "value" }, middleError);
      const formatter = new TextFormatter(topError, { showMetadata: true, showTimestamp: true });

      // Act
      const formatted = formatter.formatChain();

      // Assert
      expect(formatted).toBe(
        [
          `[${topError.timestamp.toISOString()}] HandlerError: Top error\nMetadata: {"key":"value"}`,
          `└── [${middleError.timestamp.toISOString()}] HandlerError: Middle error\nMetadata: {"key":"value"}`,
          `    └── [${rootError.timestamp.toISOString()}] HandlerError: Root error\nMetadata: {"key":"value"}`,
        ].join("\n"),
      );
    });
  });
});
