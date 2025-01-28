import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/handler-error";
import { JsonFormatter } from "../../src/formatters/json-formatter";

describe("JsonFormatter", () => {
  describe("format", () => {
    it("should format error with JSON", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new JsonFormatter({
        showMetadata: false,
        showStackTrace: false,
        showTimestamp: false,
      });

      // Act
      const formatted = formatter.format(error);

      // Assert
      const errorData = {
        message: "Test error",
        name: "HandlerError",
      };
      // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
      expect(formatted).toBe(JSON.stringify(errorData, null, 2));
    });

    it("should format error with JSON with timestamp", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new JsonFormatter({
        showMetadata: false,
        showStackTrace: false,
        showTimestamp: true,
      });

      // Act
      const formatted = formatter.format(error);

      // Assert
      const errorData = {
        message: "Test error",
        name: "HandlerError",
        timestamp: error.timestamp.toISOString(),
      };
      // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
      expect(formatted).toBe(JSON.stringify(errorData, null, 2));
    });

    it("should format error with JSON with metadata", () => {
      // Arrange
      const error = new HandlerError("Test error", { key: "value" });
      const formatter = new JsonFormatter({
        showMetadata: true,
        showStackTrace: false,
        showTimestamp: false,
      });

      // Act
      const formatted = formatter.format(error);

      // Assert
      /* eslint-disable perfectionist/sort-objects -- Allow unsorted object properties */
      const errorData = {
        message: "Test error",
        name: "HandlerError",
        metadata: {
          key: "value",
        },
      };
      /* eslint-enable perfectionist/sort-objects */

      // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
      expect(formatted).toBe(JSON.stringify(errorData, null, 2));
    });

    it("should format error with JSON with stack trace", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new JsonFormatter({
        showMetadata: false,
        showStackTrace: true,
        showTimestamp: false,
      });

      // Act
      const formatted = formatter.format(error);

      // Assert
      const errorData = {
        message: "Test error",
        name: "HandlerError",
        stack: error.stack,
      };
      // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
      expect(formatted).toBe(JSON.stringify(errorData, null, 2));
    });
  });

  describe("formatChain", () => {
    it("should format error chain with JSON", () => {
      // Arrange
      const error1 = new HandlerError("Test error 1");
      const error2 = new HandlerError("Test error 2", error1);
      const formatter = new JsonFormatter({
        showMetadata: false,
        showStackTrace: false,
        showTimestamp: false,
      });

      // Act
      const formatted = formatter.formatChain(error2);

      // Assert
      const errorData = [
        {
          message: "Test error 2",
          name: "HandlerError",
        },
        {
          message: "Test error 1",
          name: "HandlerError",
        },
      ];
      // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
      expect(formatted).toBe(JSON.stringify(errorData, null, 2));
    });

    it("should format error chain with JSON with timestamp", () => {
      // Arrange
      const error1 = new HandlerError("Test error 1");
      const error2 = new HandlerError("Test error 2", error1);
      const formatter = new JsonFormatter({
        showMetadata: false,
        showStackTrace: false,
        showTimestamp: true,
      });

      // Act
      const formatted = formatter.formatChain(error2);

      // Assert
      const errorData = [
        {
          message: "Test error 2",
          name: "HandlerError",
          timestamp: error1.timestamp.toISOString(),
        },
        {
          message: "Test error 1",
          name: "HandlerError",
          timestamp: error2.timestamp.toISOString(),
        },
      ];
      // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
      expect(formatted).toBe(JSON.stringify(errorData, null, 2));
    });

    it("should format error chain with JSON with metadata", () => {
      // Arrange
      const error1 = new HandlerError("Test error 1", { key: "value" });
      const error2 = new HandlerError("Test error 2", { key: "value" }, error1);
      const formatter = new JsonFormatter({
        showMetadata: true,
        showStackTrace: false,
        showTimestamp: false,
      });

      // Act
      const formatted = formatter.formatChain(error2);

      // Assert
      /* eslint-disable perfectionist/sort-objects -- Allow unsorted object properties */
      const errorData = [
        {
          message: "Test error 2",
          name: "HandlerError",
          metadata: {
            key: "value",
          },
        },
        {
          message: "Test error 1",
          name: "HandlerError",
          metadata: {
            key: "value",
          },
        },
      ];
      /* eslint-enable perfectionist/sort-objects */

      // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
      expect(formatted).toBe(JSON.stringify(errorData, null, 2));
    });

    it("should format error chain with JSON with stack trace", () => {
      // Arrange
      const error1 = new HandlerError("Test error 1");
      const error2 = new HandlerError("Test error 2", error1);
      const formatter = new JsonFormatter({
        showMetadata: false,
        showStackTrace: true,
        showTimestamp: false,
      });

      // Act
      const formatted = formatter.formatChain(error2);

      // Assert
      const errorData = [
        {
          message: "Test error 2",
          name: "HandlerError",
          stack: error2.stack,
        },
        {
          message: "Test error 1",
          name: "HandlerError",
          stack: error1.stack,
        },
      ];

      // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
      expect(formatted).toBe(JSON.stringify(errorData, null, 2));
    });
  });
});
