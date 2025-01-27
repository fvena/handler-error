import type { FormatterOptions } from "../../src/types/error-formatter.types";
import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/handler-error";
import { ErrorFormatter } from "../../src/modules/error-formatter";
import { ErrorChain } from "../../src";

interface TestFormatterOptions extends FormatterOptions {
  testName: string;
}

// Single error
const error = new HandlerError("Test error");

// Chain of errors
const rootError = new HandlerError("Root error");
const middleError = new HandlerError("Middle error", rootError);
const topError = new HandlerError("Top error", middleError);

describe("ErrorFormatter", () => {
  it("should format error with formatter without properties", () => {
    // Arrange
    class TestFormatter extends ErrorFormatter {
      format(error: HandlerError): string {
        return `TestFormatter: ${error.message}`;
      }
    }

    // Act
    const formatter = new TestFormatter();

    // Assert
    expect(formatter).toBeInstanceOf(ErrorFormatter);
    expect(formatter.format(error)).toBe("TestFormatter: Test error");
  });

  it("format error with formatter with default properties", () => {
    // Arrange
    class TestFormatter extends ErrorFormatter<TestFormatterOptions> {
      private defaultOptions: TestFormatterOptions = {
        testName: "TestFormatter",
      };

      format(error: HandlerError): string {
        return `${this.defaultOptions.testName}: ${error.message}`;
      }
    }

    // Act
    const formatter = new TestFormatter();

    // Assert
    expect(formatter).toBeInstanceOf(ErrorFormatter);
    expect(formatter.format(error)).toBe("TestFormatter: Test error");
  });

  it("should format error with formatter with custom properties", () => {
    // Arrange
    class TestFormatter extends ErrorFormatter<TestFormatterOptions> {
      private defaultOptions: TestFormatterOptions = {
        testName: "TestFormatter",
      };

      constructor(options?: TestFormatterOptions) {
        super();
        this.defaultOptions = { ...this.defaultOptions, ...options };
      }

      format(error: HandlerError): string {
        return `${this.defaultOptions.testName}: ${error.message}`;
      }
    }

    // Act
    const formatter = new TestFormatter({ testName: "CustomFormatter" });

    // Assert
    expect(formatter).toBeInstanceOf(ErrorFormatter);
    expect(formatter.format(error)).toBe("CustomFormatter: Test error");
  });

  it("should format error with formatter with custom properties in format method", () => {
    // Arrange
    class TestFormatter extends ErrorFormatter<TestFormatterOptions> {
      private defaultOptions: TestFormatterOptions = {
        testName: "TestFormatter",
      };

      format(error: HandlerError, options?: TestFormatterOptions): string {
        const customOptions = { ...this.defaultOptions, ...options };
        return `${customOptions.testName}: ${error.message}`;
      }
    }

    // Act
    const formatter = new TestFormatter();

    // Assert
    expect(formatter).toBeInstanceOf(ErrorFormatter);
    expect(formatter.format(error, { testName: "CustomFormatter" })).toBe(
      "CustomFormatter: Test error",
    );
  });

  it("should format chain of errors with default implement", () => {
    // Arrange
    class TestFormatter extends ErrorFormatter<TestFormatterOptions> {
      private defaultOptions: TestFormatterOptions = {
        testName: "TestFormatter",
      };

      format(error: HandlerError): string {
        return `${this.defaultOptions.testName}: ${error.message}`;
      }
    }

    // Act
    const formatter = new TestFormatter();

    // Assert
    expect(formatter.formatChain(topError)).toBe(
      "TestFormatter: Top error\nTestFormatter: Middle error\nTestFormatter: Root error",
    );
  });

  it("should format chain of errors with custom formatter", () => {
    // Arrange
    class TestFormatter extends ErrorFormatter<TestFormatterOptions> {
      private defaultOptions: TestFormatterOptions = {
        testName: "TestFormatter",
      };

      format(error: HandlerError): string {
        return `${this.defaultOptions.testName}: ${error.message}`;
      }

      override formatChain(error: HandlerError, options?: TestFormatterOptions): string {
        const customOptions = { ...this.defaultOptions, ...options };

        const chain = ErrorChain.mapErrors(
          error,
          (item, index) => `${customOptions.testName}: ${item.message} ${String(index)}`,
        );

        return chain.join("\n");
      }
    }

    // Act
    const formatter = new TestFormatter();

    // Assert
    expect(formatter.formatChain(topError, { testName: "CustomFormatter" })).toBe(
      "CustomFormatter: Top error 0\nCustomFormatter: Middle error 1\nCustomFormatter: Root error 2",
    );
  });
});
