import type { Catalog } from "../src/types/error-catalog.types";
import { describe, expect, it } from "vitest";
import { ErrorSeverity } from "../src/constants";
import { ErrorCatalog } from "../src/modules/error-catalog";
import { CodeHandlerError } from "../src/code-handler-error";
import { HandlerError } from "../src/handler-error";
import { DependencyContainer } from "../src/utils/dependency-container.utils";

const catalog: Catalog = {
  VAL001: { message: "Test error", severity: ErrorSeverity.CRITICAL },
  VAL002: { message: "Test warning", severity: ErrorSeverity.WARNING },
  VAL003: { message: "Test info", severity: ErrorSeverity.INFO },
  VAL004: { message: "Test debug", severity: ErrorSeverity.DEBUG },
};

DependencyContainer.register("ErrorCatalog", new ErrorCatalog(catalog));

describe("CodeHandlerError", () => {
  describe("constructor", () => {
    it("should create an error only with code", () => {
      // Arrange & Act
      const error = new CodeHandlerError("VAL001");

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("CodeHandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.metadata).toBeUndefined();
      expect(error.cause).toBeUndefined();
    });

    it("should create an error with code and error", () => {
      // Arrange & Act
      const rootError = new Error("Root error");
      const error = new CodeHandlerError("VAL001", rootError);

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("CodeHandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.metadata).toBeUndefined();
      expect(error.cause).toBeInstanceOf(HandlerError);
      expect(error.cause?.message).toBe("Root error");
    });

    it("should create an error with code and metadata", () => {
      // Arrange & Act
      const metadata = { key: "value" };
      const error = new CodeHandlerError("VAL001", metadata);

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("CodeHandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.metadata).toEqual(metadata);
      expect(error.cause).toBeUndefined();
    });

    it("should create an error with code, metadata and error", () => {
      // Arrange & Act
      const metadata = { key: "value" };
      const rootError = new Error("Root error");
      const error = new CodeHandlerError("VAL001", metadata, rootError);

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("CodeHandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.metadata).toEqual(metadata);
      expect(error.cause).toBeInstanceOf(HandlerError);
      expect(error.cause?.message).toBe("Root error");
    });

    it("should create an error with code and message", () => {
      // Arrange & Act
      const error = new CodeHandlerError("VAL001", "Custom message");

      // Assert
      expect(error.message).toBe("Custom message");
      expect(error.name).toBe("CodeHandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.metadata).toBeUndefined();
      expect(error.cause).toBeUndefined();
    });

    it("should create an error with code, message and error", () => {
      // Arrange & Act
      const rootError = new Error("Root error");
      const error = new CodeHandlerError("VAL001", "Custom message", rootError);

      // Assert
      expect(error.message).toBe("Custom message");
      expect(error.name).toBe("CodeHandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.metadata).toBeUndefined();
      expect(error.cause).toBeInstanceOf(HandlerError);
      expect(error.cause?.message).toBe("Root error");
    });

    it("should create an error with code, message and metadata", () => {
      // Arrange & Act
      const metadata = { key: "value" };
      const error = new CodeHandlerError("VAL001", "Custom message", metadata);

      // Assert
      expect(error.message).toBe("Custom message");
      expect(error.name).toBe("CodeHandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.metadata).toEqual(metadata);
      expect(error.cause).toBeUndefined();
    });

    it("should create an error with code, message, metadata and error", () => {
      // Arrange & Act
      const metadata = { key: "value" };
      const rootError = new Error("Root error");
      const error = new CodeHandlerError("VAL001", "Custom message", metadata, rootError);

      // Assert
      expect(error.message).toBe("Custom message");
      expect(error.name).toBe("CodeHandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.metadata).toEqual(metadata);
      expect(error.cause).toBeInstanceOf(HandlerError);
      expect(error.cause?.message).toBe("Root error");
    });
  });

  describe("severity", () => {
    it("should create an error with the specified severity", () => {
      // Arrange
      const errorCritical = new CodeHandlerError.critical("Test critical error");
      const errorError = new CodeHandlerError.error("Test error error");
      const errorWarning = new CodeHandlerError.warning("Test warning error");
      const errorInfo = new CodeHandlerError.info("Test info error");
      const errorDebug = new CodeHandlerError.debug("Test debug error");

      // Assert
      expect(errorCritical.severity).toBe(ErrorSeverity.CRITICAL);
      expect(errorError.severity).toBe(ErrorSeverity.ERROR);
      expect(errorWarning.severity).toBe(ErrorSeverity.WARNING);
      expect(errorInfo.severity).toBe(ErrorSeverity.INFO);
      expect(errorDebug.severity).toBe(ErrorSeverity.DEBUG);
    });

    it("should create an error with the specified severity and metadata", () => {
      // Arrange
      const metadata = { key: "value" };

      // Act
      const errorCritical = new CodeHandlerError.critical("Test critical error", metadata);

      // Assert
      expect(errorCritical.severity).toBe(ErrorSeverity.CRITICAL);
      expect(errorCritical.metadata).toBe(metadata);
    });

    it("should create an error with the specified severity, metadata and error", () => {
      // Arrange
      const metadata = { key: "value" };
      const rootError = new Error("Root error");

      // Act
      const errorCritical = new CodeHandlerError.critical(
        "Test critical error",
        metadata,
        rootError,
      );

      // Assert
      expect(errorCritical.severity).toBe(ErrorSeverity.CRITICAL);
      expect(errorCritical.metadata).toBe(metadata);
      expect(errorCritical.cause).toBeInstanceOf(HandlerError);
      expect(errorCritical.cause?.message).toBe("Root error");
    });

    it("should create an error with the specified severity, metadata and code", () => {
      // Arrange
      const metadata = { key: "value" };

      // Act
      const errorCritical = new CodeHandlerError.critical(
        "Test critical error",
        "VAL001",
        metadata,
      );

      // Assert
      expect(errorCritical.severity).toBe(ErrorSeverity.CRITICAL);
      expect(errorCritical.code).toBe("VAL001");
      expect(errorCritical.metadata).toBe(metadata);
    });

    it("should create an error with the specified severity, metadata, code and error", () => {
      // Arrange
      const metadata = { key: "value" };
      const rootError = new Error("Root error");

      // Act
      const errorCritical = new CodeHandlerError.critical(
        "Test critical error",
        "VAL001",
        metadata,
        rootError,
      );

      // Assert
      expect(errorCritical.severity).toBe(ErrorSeverity.CRITICAL);
      expect(errorCritical.code).toBe("VAL001");
      expect(errorCritical.metadata).toBe(metadata);
      expect(errorCritical.cause).toBeInstanceOf(HandlerError);
      expect(errorCritical.cause?.message).toBe("Root error");
    });
  });

  describe("toString", () => {
    it("should return a string representation of the error", () => {
      // Arrange
      const error = new CodeHandlerError("VAL001");

      // Act
      const errorString = error.toString();

      // Assert
      expect(errorString).toBe("[CRITICAL VAL001] CodeHandlerError: Test error");
    });
  });

  describe("dependency resolution", () => {
    it("should throw when ErrorCatalog is not registered", () => {
      DependencyContainer.clear();

      expect(() => new CodeHandlerError("VAL001")).toThrowError(
        "Dependency with key 'ErrorCatalog' is not registered",
      );
    });
  });
});
