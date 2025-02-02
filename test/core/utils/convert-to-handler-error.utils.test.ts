import { describe, expect, it } from "vitest";
import { HandlerError } from "../../../src/core/handler-error";
import { convertToHandlerError } from "../../../src/core/utils/convert-to-handler-error.utils";

describe("convertToHandlerError", () => {
  it("should return undefined if error is undefined", () => {
    // Arrange
    const cause = undefined as unknown as Error;

    // Act
    const error = convertToHandlerError(cause);

    // Assert
    expect(error).toBeUndefined();
  });

  it("should return a HandlerError if error is a Error", () => {
    // Arrange
    const cause = new Error("Test cause");

    // Act
    const error = convertToHandlerError(cause);

    // Assert
    expect(error).toBeInstanceOf(HandlerError);
    expect(error?.message).toBe("Test cause");
  });

  it("should return a HandlerError if error is a HandlerError", () => {
    // Arrange
    const cause = new HandlerError("Test cause");

    // Act
    const error = convertToHandlerError(cause);

    // Assert
    expect(error).toBeInstanceOf(HandlerError);
    expect(error?.message).toBe("Test cause");
  });

  it("should not set the cause if not is a Error", () => {
    // Arrange
    const cause = "Test cause" as unknown as Error;

    // Act
    const error = convertToHandlerError(cause);

    // Assert
    expect(error).toBeUndefined();
  });
});
