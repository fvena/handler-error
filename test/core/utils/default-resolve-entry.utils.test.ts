import type { Dictionary } from "../../../src/core/code-handler-error";
import { describe, expect, it } from "vitest";
import { ErrorSeverity } from "../../../src/core/constants";
import { defaultResolveEntry } from "../../../src/core/utils/default-resolve-entry.utils";

const dictionary: Dictionary = {
  VAL001: { message: "Test error", severity: ErrorSeverity.CRITICAL },
  VAL002: { message: "Test warning", severity: ErrorSeverity.WARNING },
  VAL003: { message: "Test info", severity: ErrorSeverity.INFO },
  VAL004: { message: "Test debug", severity: ErrorSeverity.DEBUG },
};

describe("defaultResolveEntry", () => {
  describe("resolveEntry behavior", () => {
    it("should return an entry from the dictionary", () => {
      // Arrange & Act
      const error = defaultResolveEntry(dictionary, "VAL001");

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
    });

    it("should throw error if an code is not found", () => {
      // Arrange & Act & Assert
      expect(() => defaultResolveEntry(dictionary, "VAL005")).toThrowError(
        "Error code VAL005 not found in dictionary",
      );
    });

    it("should return additional data from entry", () => {
      // Arrange
      const customDictionary: Dictionary = {
        VAL001: { data: { key: "value" }, message: "Test error", severity: ErrorSeverity.CRITICAL },
      };

      // Act
      const error = defaultResolveEntry(customDictionary, "VAL001");

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.data).toEqual({ key: "value" });
    });
  });

  describe("formatMessage behavior", () => {
    it("should format message with metadata", () => {
      // Arrange
      const customDictionary: Dictionary = {
        VAL001: { message: "Test error {{ key }}", severity: ErrorSeverity.CRITICAL },
      };

      // Act
      const error = defaultResolveEntry(customDictionary, "VAL001", { key: "value" });

      // Assert
      expect(error.message).toBe("Test error value");
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
    });

    it("should return message as-is if no placeholders are present", () => {
      // Arrange
      const customDictionary: Dictionary = {
        VAL002: { message: "Error without variables", severity: ErrorSeverity.ERROR },
      };

      // Act
      const error = defaultResolveEntry(customDictionary, "VAL002");

      // Assert
      expect(error.message).toBe("Error without variables");
      expect(error.severity).toBe(ErrorSeverity.ERROR);
    });

    it("should throw an error if a required placeholder is not provided in metadata", () => {
      // Arrange
      const customDictionary: Dictionary = {
        VAL004: { message: "Missing placeholder {{ otherKey }}", severity: ErrorSeverity.INFO },
      };

      // Act & Assert
      expect(() => defaultResolveEntry(customDictionary, "VAL004", { key: "value" })).toThrowError(
        "Metadata key 'otherKey' not provided for message template",
      );
    });

    it("should throw an error if a metadata value is not a string or number", () => {
      // Arrange
      const customDictionary: Dictionary = {
        VAL005: { message: "Invalid metadata {{ key }}", severity: ErrorSeverity.CRITICAL },
      };

      // Act & Assert
      expect(() =>
        defaultResolveEntry(customDictionary, "VAL005", { key: { nested: "object" } }),
      ).toThrowError("Metadata key 'key' must be a string or number");
    });

    it("should format message with multiple placeholders", () => {
      // Arrange
      const customDictionary: Dictionary = {
        VAL006: {
          message: "Error with multiple placeholders: {{ key1 }} and {{ key2 }}",
          severity: ErrorSeverity.WARNING,
        },
      };

      // Act
      const error = defaultResolveEntry(customDictionary, "VAL006", {
        key1: "value1",
        key2: "value2",
      });

      // Assert
      expect(error.message).toBe("Error with multiple placeholders: value1 and value2");
    });

    it("should ignore extra metadata keys not used in the message", () => {
      // Arrange
      const customDictionary: Dictionary = {
        VAL007: { message: "Error with one placeholder: {{ key }}", severity: ErrorSeverity.ERROR },
      };

      // Act
      const error = defaultResolveEntry(customDictionary, "VAL007", {
        extraKey: "extraValue",
        key: "value",
      });

      // Assert
      expect(error.message).toBe("Error with one placeholder: value");
      expect(error.severity).toBe(ErrorSeverity.ERROR);
    });

    it("should not replace invalid or malformed placeholders", () => {
      // Arrange
      const customDictionary: Dictionary = {
        VAL008: {
          message: "Message with invalid placeholders {{key and {{another key}}",
          severity: ErrorSeverity.INFO,
        },
      };

      // Act
      const error = defaultResolveEntry(customDictionary, "VAL008", {
        "another key": "anotherValue",
        key: "value",
      });

      // Assert
      expect(error.message).toBe("Message with invalid placeholders {{key and {{another key}}");
    });

    it("should throw error when message template is too complex", () => {
      const customDictionary: Dictionary = {
        VAL009: {
          message: "{{ a }}".repeat(102),
          severity: ErrorSeverity.INFO,
        },
      };

      expect(() => defaultResolveEntry(customDictionary, "VAL009", { a: "value" })).toThrowError(
        "Too many replacements in message template",
      );
    });

    it("should throw error when metadata is invalid", () => {
      const customDictionary: Dictionary = {
        VAL010: {
          message: "{{ key }}",
          severity: ErrorSeverity.INFO,
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any -- Testing invalid input
      expect(() => defaultResolveEntry(customDictionary, "VAL010", "invalid" as any)).toThrowError(
        "Metadata must be an object",
      );
    });
  });
});
