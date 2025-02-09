import { describe, expect, it } from "vitest";
import { HandlerError } from "../../../src/core/handler-error";
import { parseErrorArguments } from "../../../src/core/utils/parse-error-arguments.utils";

describe("parseErrorArguments", () => {
  describe("when all arguments are undefined", () => {
    it("should return undefined for all properties", () => {
      // Act
      const { cause, code, metadata } = parseErrorArguments();

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
      const { code } = parseErrorArguments(argument2);

      // Assert
      expect(code).toBe("ERR001");
    });

    it("should return error code and metadata", () => {
      // Arrange
      const argument2 = "ERR001";
      const argument3 = { key: "value" };

      // Act
      const { code, metadata } = parseErrorArguments(argument2, argument3);

      // Assert
      expect(code).toBe("ERR001");
      expect(metadata).toEqual({ key: "value" });
    });

    it("should return error code and cause", () => {
      // Arrange
      const argument2 = "ERR001";
      const argument3 = new Error("Test cause");

      // Act
      const { cause, code } = parseErrorArguments(argument2, argument3);

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
      const { cause, code, metadata } = parseErrorArguments(argument2, argument3, argument4);

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
      const { metadata } = parseErrorArguments(argument2);

      // Assert
      expect(metadata).toEqual({ key: "value" });
    });

    it("should return metadata and cause", () => {
      // Arrange
      const argument2 = { key: "value" };
      const argument3 = new Error("Test cause");

      // Act
      const { cause, metadata } = parseErrorArguments(argument2, argument3);

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
      const { cause } = parseErrorArguments(argument2);

      // Assert
      expect(cause).toBeInstanceOf(HandlerError);
      expect(cause?.message).toBe("Test cause");
    });
  });
});
