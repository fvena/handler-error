import type { Catalog } from "../../../src/core/types/error-catalog.types";
import { describe, expect, it } from "vitest";
import { ErrorSeverity } from "../../../src/core/constants";
import { StandardCatalog } from "../../../src/modules/catalogs/implementations/standard-catalog";

const catalog: Catalog = {
  VAL001: { message: "Test error", severity: ErrorSeverity.CRITICAL },
  VAL002: { message: "Test warning", severity: ErrorSeverity.WARNING },
  VAL003: { message: "Test info", severity: ErrorSeverity.INFO },
  VAL004: { message: "Test debug", severity: ErrorSeverity.DEBUG },
};

describe("StandardCatalog", () => {
  it("should return an entry from the catalog", () => {
    // Arrange
    const errorCatalog = new StandardCatalog(catalog);

    // Act
    const error = errorCatalog.getEntry("VAL001");

    // Assert
    expect(error.message).toBe("Test error");
    expect(error.severity).toBe(ErrorSeverity.CRITICAL);
  });

  it("should throw error if an code is not found", () => {
    // Arrange
    const errorCatalog = new StandardCatalog(catalog);

    // Act
    const error = () => errorCatalog.getEntry("VAL005");

    // Assert
    expect(error).toThrowError("Error code VAL005 not found in catalog");
  });

  it("should return additional data from entry", () => {
    // Arrange
    const customCatalog: Catalog = {
      VAL001: { data: { key: "value" }, message: "Test error", severity: ErrorSeverity.CRITICAL },
    };

    const errorCatalog = new StandardCatalog(customCatalog);

    // Act
    const error = errorCatalog.getEntry("VAL001");

    // Assert
    expect(error.message).toBe("Test error");
    expect(error.severity).toBe(ErrorSeverity.CRITICAL);
    expect(error.data).toEqual({ key: "value" });
  });
});

describe("StandardCatalog.formatMessage", () => {
  it("should format message with metadata", () => {
    // Arrange
    const customCatalog: Catalog = {
      VAL001: { message: "Test error {{ key }}", severity: ErrorSeverity.CRITICAL },
    };

    const errorCatalog = new StandardCatalog(customCatalog);

    // Act
    const error = errorCatalog.getEntry("VAL001", { key: "value" });

    // Assert
    expect(error.message).toBe("Test error value");
    expect(error.severity).toBe(ErrorSeverity.CRITICAL);
  });

  it("should return message as-is if no placeholders are present", () => {
    // Arrange
    const customCatalog: Catalog = {
      VAL002: { message: "Error without variables", severity: ErrorSeverity.ERROR },
    };

    const errorCatalog = new StandardCatalog(customCatalog);

    // Act
    const error = errorCatalog.getEntry("VAL002");

    // Assert
    expect(error.message).toBe("Error without variables");
    expect(error.severity).toBe(ErrorSeverity.ERROR);
  });

  it("should throw an error if a required placeholder is not provided in metadata", () => {
    // Arrange
    const customCatalog: Catalog = {
      VAL004: { message: "Missing placeholder {{ otherKey }}", severity: ErrorSeverity.INFO },
    };

    const errorCatalog = new StandardCatalog(customCatalog);

    // Act & Assert
    expect(() => errorCatalog.getEntry("VAL004", { key: "value" })).toThrowError(
      "Metadata key 'otherKey' not provided for message template",
    );
  });

  it("should throw an error if a metadata value is not a string or number", () => {
    // Arrange
    const customCatalog: Catalog = {
      VAL005: { message: "Invalid metadata {{ key }}", severity: ErrorSeverity.CRITICAL },
    };

    const errorCatalog = new StandardCatalog(customCatalog);

    // Act & Assert
    expect(() => errorCatalog.getEntry("VAL005", { key: { nested: "object" } })).toThrowError(
      "Metadata key 'key' must be a string or number",
    );
  });

  it("should format message with multiple placeholders", () => {
    // Arrange
    const customCatalog: Catalog = {
      VAL006: {
        message: "Error with multiple placeholders: {{ key1 }} and {{ key2 }}",
        severity: ErrorSeverity.WARNING,
      },
    };

    const errorCatalog = new StandardCatalog(customCatalog);

    // Act
    const error = errorCatalog.getEntry("VAL006", { key1: "value1", key2: "value2" });

    // Assert
    expect(error.message).toBe("Error with multiple placeholders: value1 and value2");
  });

  it("should ignore extra metadata keys not used in the message", () => {
    // Arrange
    const customCatalog: Catalog = {
      VAL007: { message: "Error with one placeholder: {{ key }}", severity: ErrorSeverity.ERROR },
    };

    const errorCatalog = new StandardCatalog(customCatalog);

    // Act
    const error = errorCatalog.getEntry("VAL007", { extraKey: "extraValue", key: "value" });

    // Assert
    expect(error.message).toBe("Error with one placeholder: value");
    expect(error.severity).toBe(ErrorSeverity.ERROR);
  });

  it("should not replace invalid or malformed placeholders", () => {
    // Arrange
    const customCatalog: Catalog = {
      VAL008: {
        message: "Message with invalid placeholders {{key and {{another key}}",
        severity: ErrorSeverity.INFO,
      },
    };

    const errorCatalog = new StandardCatalog(customCatalog);

    // Act
    const error = errorCatalog.getEntry("VAL008", { "another key": "anotherValue", key: "value" });

    // Assert
    expect(error.message).toBe("Message with invalid placeholders {{key and {{another key}}");
  });

  it("should throw error when message template is too complex", () => {
    const customCatalog: Catalog = {
      VAL009: {
        message: "{{ a }}".repeat(102),
        severity: ErrorSeverity.INFO,
      },
    };

    const errorCatalog = new StandardCatalog(customCatalog);

    expect(() => errorCatalog.getEntry("VAL009", { a: "value" })).toThrowError(
      "Too many replacements in message template",
    );
  });

  it("should throw error when metadata is invalid", () => {
    const customCatalog: Catalog = {
      VAL010: {
        message: "{{ key }}",
        severity: ErrorSeverity.INFO,
      },
    };

    const errorCatalog = new StandardCatalog(customCatalog);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument -- Testing invalid metadata
    expect(() => errorCatalog.getEntry("VAL010", "invalid" as any)).toThrowError(
      "Metadata must be an object",
    );
  });
});
