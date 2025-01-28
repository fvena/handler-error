import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/handler-error";
import { isHandlerError } from "../../src/guards/handler-error.guard";

describe("isHandlerError", () => {
  it("should return true for HandlerError instance", () => {
    // Arrange
    const error = new HandlerError("Test error");

    // Act
    const result = isHandlerError(error);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false for Error instance", () => {
    // Arrange
    const error = new Error("Test error");

    // Act
    const result = isHandlerError(error);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false for null", () => {
    // Arrange
    // eslint-disable-next-line unicorn/no-null -- Testing null
    const error = null as unknown as Error;

    // Act
    const result = isHandlerError(error);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false for undefined", () => {
    // Arrange
    const error = undefined as unknown as Error;

    // Act
    const result = isHandlerError(error);

    // Assert
    expect(result).toBe(false);
  });
});
