import { beforeAll, describe, expect, it, vi } from "vitest";
import { HandlerError } from "../../src/core/handler-error";
import { ErrorSeverity } from "../../src/core/constants";
import { ErrorFormatter } from "../../src/modules/formatters/base.formatter";
import { ErrorLogger } from "../../src/modules/loggers/base.logger";

const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
  /* empty */
});

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

  describe("severity", () => {
    it("should create an error with the specified severity", () => {
      // Arrange
      const errorCritical = new HandlerError.critical("Test critical error");
      const errorError = new HandlerError.error("Test error error");
      const errorWarning = new HandlerError.warning("Test warning error");
      const errorInfo = new HandlerError.info("Test info error");
      const errorDebug = new HandlerError.debug("Test debug error");

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
      const errorCritical = new HandlerError.critical("Test critical error", metadata);

      // Assert
      expect(errorCritical.severity).toBe(ErrorSeverity.CRITICAL);
      expect(errorCritical.metadata).toBe(metadata);
    });

    it("should create an error with the specified severity, metadata and error", () => {
      // Arrange
      const metadata = { key: "value" };
      const rootError = new Error("Root error");

      // Act
      const errorCritical = new HandlerError.critical("Test critical error", metadata, rootError);

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
      const errorCritical = new HandlerError.critical("Test critical error", "VAL001", metadata);

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
      const errorCritical = new HandlerError.critical(
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

  describe("error chain", () => {
    const rootError = new Error("Root error");
    const middleError = new HandlerError.critical("Middle error", rootError);
    const topError = new HandlerError.warning("Top error", middleError);

    it("should retrieve the chain of errors", () => {
      // Arrange
      const error = new HandlerError("Test error", topError);

      // Act
      const chain = error.chain.get();

      // Assert
      expect(chain).toHaveLength(4);
      expect(chain[0]?.message).toBe("Test error");
      expect(chain[1]?.message).toBe("Top error");
      expect(chain[2]?.message).toBe("Middle error");
      expect(chain[3]?.message).toBe("Root error");
    });

    it("should retrieve the root cause of the error", () => {
      // Arrange & Act
      const error = new HandlerError("Test error", topError);

      // Assert
      expect(error.chain.root().message).toBe("Root error");
    });

    it("should map the error chain", () => {
      // Arrange
      const error = new HandlerError("Test error", topError);

      // Act
      const chain = error.chain.map((error) => error.message);

      // Assert
      expect(chain).toEqual(["Test error", "Top error", "Middle error", "Root error"]);
    });

    it("should find the most severe error in the chain", () => {
      // Arrange
      const error = new HandlerError.error("Test error", topError);

      // Act
      const mostSevere = error.chain.mostSevere();

      // Assert
      expect(mostSevere.severity).toBe(ErrorSeverity.CRITICAL);
      expect(mostSevere.message).toBe("Middle error");
    });

    it("should serialize the error chain", () => {
      // Arrange
      const error = new HandlerError("Test error", topError);

      // Act
      const serializedChain = error.chain.serialize();

      // Assert
      expect(serializedChain).toHaveLength(4);
      expect(serializedChain[0]?.message).toBe("Test error");
      expect(serializedChain[1]?.message).toBe("Top error");
      expect(serializedChain[2]?.message).toBe("Middle error");
      expect(serializedChain[3]?.message).toBe("Root error");
    });

    it("should return a string representation of the error chain", () => {
      // Arrange
      const error = new HandlerError("Test error", topError);

      // Act
      const errorString = error.chain.toString();

      // Assert
      expect(errorString).toBe(
        `[ERROR] HandlerError: Test error\n` +
          `[WARNING] WarningHandlerError: Top error\n` +
          `[CRITICAL] CriticalHandlerError: Middle error\n` +
          `[ERROR] HandlerError: Root error`,
      );
    });
  });

  it("should include error codes in the chain representation", () => {
    // Arrange
    const rootError = new HandlerError("Root error", "ROOT001");
    const topError = new HandlerError("Top error", "TOP001", rootError);

    // Act
    const errorString = topError.chain.toString();

    // Assert
    expect(errorString).toBe(
      `[ERROR TOP001] HandlerError: Top error\n` + `[ERROR ROOT001] HandlerError: Root error`,
    );
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

  describe("Formatters", () => {
    // Formatter and Logger class definitions...
    class TextFormatter extends ErrorFormatter {
      format(): string {
        return `TextFormatter: ${this.error.message}`;
      }
    }

    class HTMLFormatter extends ErrorFormatter {
      format(): string {
        return `<div>HTMLFormatter: ${this.error.message}</div>`;
      }
    }

    class ConsoleLogger extends ErrorLogger {
      log(): void {
        console.error(`ConsoleLogger: ${this.error.message}`);
      }
    }

    class FileLogger extends ErrorLogger {
      log(): void {
        console.error(`FileLogger: ${this.error.message}(saved to file)`);
      }
    }

    const loggerClasses = {
      console: ConsoleLogger,
      file: FileLogger,
    } as const;

    const formatterClasses = {
      html: HTMLFormatter,
      text: TextFormatter,
    } as const;

    type Formatters<T extends Record<string, new (error: HandlerError) => ErrorFormatter>> = Record<
      keyof T,
      ErrorFormatter
    >;

    type Loggers<T extends Record<string, new (error: HandlerError) => ErrorLogger>> = Record<
      keyof T,
      ErrorLogger
    >;

    class EnhancedHandlerError extends HandlerError {
      declare public formatters: Formatters<typeof formatterClasses>;
      declare public loggers: Loggers<typeof loggerClasses>;
    }

    class EnhancedHandlerErrorChild extends EnhancedHandlerError {
      /* Empty */
    }

    beforeAll(() => {
      EnhancedHandlerError.registerModule("loggers", loggerClasses).registerModule(
        "formatters",
        formatterClasses,
      );
    });

    it("should register and use formatters", () => {
      const error = new EnhancedHandlerError("Test error");
      expect(error.formatters.html.format()).toBe("<div>HTMLFormatter: Test error</div>");
      expect(error.formatters.text.format()).toBe("TextFormatter: Test error");
    });

    it("should register and use loggers", () => {
      const error = new EnhancedHandlerError("Test error");
      error.loggers.file.log();
      expect(errorSpy).toHaveBeenCalledWith("FileLogger: Test error(saved to file)");
    });

    it("should inherit formatters in child classes", () => {
      const errorChild = new EnhancedHandlerErrorChild("Test error");
      expect(errorChild.formatters.text.format()).toBe("TextFormatter: Test error");
    });
  });
});
