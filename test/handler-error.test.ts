import { describe, expect, it } from "vitest";
import { HandlerError } from "../src/handler-error";
import { ErrorSeverity } from "../src/constants";

describe("HandlerError", () => {
  describe("constructor", () => {
    it("should create an error only with message", () => {
      // Arrange & Act
      const error = new HandlerError("Test error");

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("HandlerError");
      expect(error.code).toBeUndefined();
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.metadata).toBeUndefined();
      expect(error.cause).toBeUndefined();
    });

    it("should create an error with message and error", () => {
      // Arrange & Act
      const rootError = new Error("Root error");
      const error = new HandlerError("Test error", rootError);

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("HandlerError");
      expect(error.code).toBeUndefined();
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.metadata).toBeUndefined();
      expect(error.cause).toBeInstanceOf(HandlerError);
      expect(error.cause?.message).toBe("Root error");
    });

    it("should create an error with message and metadata", () => {
      // Arrange & Act
      const metadata = { key: "value" };
      const error = new HandlerError("Test error", metadata);

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("HandlerError");
      expect(error.code).toBeUndefined();
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.metadata).toEqual(metadata);
      expect(error.cause).toBeUndefined();
    });

    it("should create an error with message, metadata and error", () => {
      // Arrange & Act
      const metadata = { key: "value" };
      const rootError = new Error("Root error");
      const error = new HandlerError("Test error", metadata, rootError);

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("HandlerError");
      expect(error.code).toBeUndefined();
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.metadata).toEqual(metadata);
      expect(error.cause).toBeInstanceOf(HandlerError);
      expect(error.cause?.message).toBe("Root error");
    });

    it("should create an error with message and code", () => {
      // Arrange & Act
      const error = new HandlerError("Test error", "VAL001");

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("HandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.metadata).toBeUndefined();
      expect(error.cause).toBeUndefined();
    });

    it("should create an error with message, code and error", () => {
      // Arrange & Act
      const rootError = new Error("Root error");
      const error = new HandlerError("Test error", "VAL001", rootError);

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("HandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.metadata).toBeUndefined();
      expect(error.cause).toBeInstanceOf(HandlerError);
      expect(error.cause?.message).toBe("Root error");
    });

    it("should create an error with message, code and metadata", () => {
      // Arrange & Act
      const metadata = { key: "value" };
      const error = new HandlerError("Test error", "VAL001", metadata);

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("HandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.metadata).toEqual(metadata);
      expect(error.cause).toBeUndefined();
    });

    it("should create an error with message, code, metadata and error", () => {
      // Arrange & Act
      const metadata = { key: "value" };
      const rootError = new Error("Root error");
      const error = new HandlerError("Test error", "VAL001", metadata, rootError);

      // Assert
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("HandlerError");
      expect(error.code).toBe("VAL001");
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.metadata).toEqual(metadata);
      expect(error.cause).toBeInstanceOf(HandlerError);
      expect(error.cause?.message).toBe("Root error");
    });

    it("should generate a unique ID for each instance", () => {
      // Arrange & Act
      const error1 = new HandlerError("Test error 1");
      const error2 = new HandlerError("Test error 2");

      // Assert
      expect(error1.id).not.toBe(error2.id);
    });
  });

  describe("convertToHandlerError", () => {
    it("should handle standard error as cause", () => {
      // Arrange
      const cause = new Error("Test cause");

      // Act
      const error = new HandlerError("Test error", cause);

      // Assert
      expect(error.cause).toBeInstanceOf(HandlerError);
      expect(error.cause?.message).toBe("Test cause");
    });

    it("should handle HandlerError as cause", () => {
      // Arrange
      const cause = new HandlerError("Test cause");

      // Act
      const error = new HandlerError("Test error", cause);

      // Assert
      expect(error.cause).toBeInstanceOf(HandlerError);
      expect(error.cause?.message).toBe("Test cause");
    });

    it("should not set the cause if not is a Error", () => {
      // Arrange
      const cause = "Test cause" as unknown as Error;

      // Act
      const error = new HandlerError("Test error", cause);

      // Assert
      expect(error.cause).toBeUndefined();
    });
  });

  describe("serialize", () => {
    it("should serialize the error", () => {
      // Arrange
      const error = new HandlerError("Test error");

      // Act
      const serializedError = error.serialize();

      // Assert
      expect(serializedError).toStrictEqual({
        cause: undefined,
        id: expect.any(String), // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- It's a test
        message: "Test error",
        metadata: undefined,
        name: "HandlerError",
        severity: ErrorSeverity.ERROR,
        timestamp: expect.any(String), // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- It's a test
      });
    });

    it("should serialize the error with all properties", () => {
      // Arrange
      const metadata = { key: "value" };
      const rootError = new Error("Root error");
      const error = new HandlerError("Test error", "VAL001", metadata, rootError);

      // Act
      const serializedError = error.serialize();

      // Assert
      expect(serializedError).toStrictEqual({
        cause: {
          cause: undefined,
          id: expect.any(String), // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- It's a test
          message: "Root error",
          metadata: undefined,
          name: "HandlerError",
          severity: ErrorSeverity.ERROR,
          timestamp: expect.any(String), // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- It's a test
        },
        id: expect.any(String), // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- It's a test
        message: "Test error",
        metadata: { key: "value" },
        name: "HandlerError",
        severity: ErrorSeverity.ERROR,
        timestamp: expect.any(String), // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- It's a test
      });
    });
  });

  describe("toString", () => {
    it("should return a string representation of the error", () => {
      // Arrange
      const error = new HandlerError("Test error", "VAL001");

      // Act
      const errorString = error.toString();

      // Assert
      expect(errorString).toBe(`[ERROR VAL001] HandlerError: Test error`);
    });
  });
});
