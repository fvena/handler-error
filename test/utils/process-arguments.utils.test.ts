import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/handler-error";
import { processArguments } from "../../src/utils/process-arguments.utils";

describe("processArguments", () => {
  describe("when all arguments are undefined", () => {
    it("should return undefined for all properties", () => {
      // Act
      const { cause, code, metadata } = processArguments();

      // Assert
      expect(cause).toBeUndefined();
      expect(code).toBeUndefined();
      expect(metadata).toBeUndefined();
    });
  });

  describe("when argument2 is a string", () => {
    it("should return error code", () => {
      // Arrange
      const argument2 = "ERR001";

      // Act
      const { code } = processArguments(argument2);

      // Assert
      expect(code).toBe("ERR001");
    });

    it("should return error code and metadata", () => {
      // Arrange
      const argument2 = "ERR001";
      const argument3 = { key: "value" };

      // Act
      const { code, metadata } = processArguments(argument2, argument3);

      // Assert
      expect(code).toBe("ERR001");
      expect(metadata).toEqual({ key: "value" });
    });

    it("should return error code and cause", () => {
      // Arrange
      const argument2 = "ERR001";
      const argument3 = new Error("Test cause");

      // Act
      const { cause, code } = processArguments(argument2, argument3);

      // Assert
      expect(code).toBe("ERR001");
      expect(cause).toBeInstanceOf(HandlerError);
      expect(cause?.message).toBe("Test cause");
    });

    it("should return error code, metadata and cause", () => {
      // Arrange
      const argument2 = "ERR001";
      const argument3 = { key: "value" };
      const argument4 = new Error("Test cause");

      // Act
      const { cause, code, metadata } = processArguments(argument2, argument3, argument4);

      // Assert
      expect(code).toBe("ERR001");
      expect(metadata).toEqual({ key: "value" });
      expect(cause).toBeInstanceOf(HandlerError);
      expect(cause?.message).toBe("Test cause");
    });
  });

  describe("when argument2 is a Metadata", () => {
    it("should return metadata", () => {
      // Arrange
      const argument2 = { key: "value" };

      // Act
      const { metadata } = processArguments(argument2);

      // Assert
      expect(metadata).toEqual({ key: "value" });
    });

    it("should return metadata and cause", () => {
      // Arrange
      const argument2 = { key: "value" };
      const argument3 = new Error("Test cause");

      // Act
      const { cause, metadata } = processArguments(argument2, argument3);

      // Assert
      expect(metadata).toEqual({ key: "value" });
      expect(cause).toBeInstanceOf(HandlerError);
      expect(cause?.message).toBe("Test cause");
    });
  });

  describe("when argument2 is an Error", () => {
    it("should return cause", () => {
      // Arrange
      const argument2 = new Error("Test cause");

      // Act
      const { cause } = processArguments(argument2);

      // Assert
      expect(cause).toBeInstanceOf(HandlerError);
      expect(cause?.message).toBe("Test cause");
    });
  });
});
