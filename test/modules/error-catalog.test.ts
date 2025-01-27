import type { Catalog } from "../../src/types/error-catalog.types";
import { beforeEach, describe, expect, it } from "vitest";
import { ErrorSeverity } from "../../src/constants";
import { ErrorCatalog } from "../../src/modules/error-catalog";

const catalog: Catalog = {
  VAL001: { message: "Test error", severity: ErrorSeverity.CRITICAL },
  VAL002: { message: "Test warning", severity: ErrorSeverity.WARNING },
  VAL003: { message: "Test info", severity: ErrorSeverity.INFO },
  VAL004: { message: "Test debug", severity: ErrorSeverity.DEBUG },
};

describe("ErrorCatalog", () => {
  beforeEach(() => {
    ErrorCatalog.clearCatalog();
  });

  it("should throw error if catalog is not registered", () => {
    // Arrange
    // eslint-disable-next-line unicorn/consistent-function-scoping -- Used to test function
    const error = () => ErrorCatalog.getEntry("VAL001");

    // Act & Assert
    expect(error).toThrowError("Error catalog is not registered");
  });

  it("should return an entry from the catalog", () => {
    // Arrange
    ErrorCatalog.registerCatalog(catalog);

    // Act
    const error = ErrorCatalog.getEntry("VAL001");

    // Assert
    expect(error.message).toBe("Test error");
    expect(error.severity).toBe(ErrorSeverity.CRITICAL);
  });

  it("should throw error if an code is not found", () => {
    // Arrange
    ErrorCatalog.registerCatalog(catalog);

    // Act
    const error = () => ErrorCatalog.getEntry("VAL005");

    // Assert
    expect(error).toThrowError("Error code VAL005 not found in catalog");
  });

  it("should return additional data from entry", () => {
    // Arrange
    const customCatalog: Catalog = {
      VAL001: { data: { key: "value" }, message: "Test error", severity: ErrorSeverity.CRITICAL },
    };

    ErrorCatalog.registerCatalog(customCatalog);

    // Act
    const error = ErrorCatalog.getEntry("VAL001");

    // Assert
    expect(error.message).toBe("Test error");
    expect(error.severity).toBe(ErrorSeverity.CRITICAL);
    expect(error.data).toEqual({ key: "value" });
  });
});
