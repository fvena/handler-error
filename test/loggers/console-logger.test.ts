import { describe, expect, it, vi } from "vitest";
import { HandlerError } from "../../src/handler-error";
import { ErrorFormatter } from "../../src/modules/error-formatter";
import { ConsoleLogger } from "../../src/loggers/console-logger";

const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
  /* empty */
});
const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {
  /* empty */
});
const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {
  /* empty */
});
const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
  /* empty */
});

describe("ErrorLogger", () => {
  it("should log an error", () => {
    // Arrange
    const error = new HandlerError("Test error");
    const logger = new ConsoleLogger(error);

    // Act
    logger.log();

    // Assert
    expect(errorSpy).toHaveBeenCalledWith("[ERROR] HandlerError: Test error");
  });

  it("should log a debug error", () => {
    // Arrange
    const error = new HandlerError.debug("Test error");
    const logger = new ConsoleLogger(error);

    // Act
    logger.log();

    // Assert
    expect(debugSpy).toHaveBeenCalledWith("[DEBUG] DebugHandlerError: Test error");
  });

  it("should log an info error", () => {
    // Arrange
    const error = new HandlerError.info("Test error");
    const logger = new ConsoleLogger(error);

    // Act
    logger.log();

    // Assert
    expect(infoSpy).toHaveBeenCalledWith("[INFO] InfoHandlerError: Test error");
  });

  it("should log a warning error", () => {
    // Arrange
    const error = new HandlerError.warning("Test error");
    const logger = new ConsoleLogger(error);

    // Act
    logger.log();

    // Assert
    expect(warnSpy).toHaveBeenCalledWith("[WARNING] WarningHandlerError: Test error");
  });

  it("should log a critical error", () => {
    // Arrange
    const error = new HandlerError.critical("Test error");
    const logger = new ConsoleLogger(error);

    // Act
    logger.log();

    // Assert
    expect(errorSpy).toHaveBeenCalledWith("[CRITICAL] CriticalHandlerError: Test error");
  });

  it("should log an error with a severity higher than the minimum severity", () => {
    // Arrange
    const error = new HandlerError.critical("Test error");
    const logger = new ConsoleLogger(error);

    // Act
    logger.log();

    // Assert
    expect(errorSpy).toHaveBeenCalledWith("[CRITICAL] CriticalHandlerError: Test error");
  });

  it("should not log an error with a severity lower than the minimum severity", () => {
    // Arrange
    const error = new HandlerError.debug("Test error");
    const logger = new ConsoleLogger(error);

    // Act
    logger.log();

    // Assert
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should log an error chain", () => {
    // Arrange
    const rootError = new HandlerError("Root error");
    const middleError = new HandlerError("Middle error", rootError);
    const topError = new HandlerError("Top error", middleError);

    // Act
    const logger = new ConsoleLogger(topError);
    logger.logChain();

    // Assert
    expect(errorSpy).toHaveBeenCalledWith(
      `[ERROR] HandlerError: Top error\n` +
        `[ERROR] HandlerError: Middle error\n` +
        `[ERROR] HandlerError: Root error`,
    );
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should log an error with a custom formatter", () => {
    // Arrange
    class TestFormatter extends ErrorFormatter {
      format(): string {
        return `TestFormatter: ${this.error.message}`;
      }
    }

    const error = new HandlerError("Test error");

    // Act
    const logger = new ConsoleLogger(error, { formatter: TestFormatter });
    logger.log();

    // Assert
    expect(errorSpy).toHaveBeenCalledWith("TestFormatter: Test error");
  });

  it("should log an error chain with a custom formatter", () => {
    // Arrange
    class TestFormatter extends ErrorFormatter {
      public format(): string {
        return `TestFormatter: ${this.error.message}`;
      }

      public formatChain(): string {
        const chain = this.error.mapChain((error) => `TestFormatter: ${error.message}`);
        return chain.join("\n");
      }
    }

    const rootError = new HandlerError("Root error");
    const middleError = new HandlerError("Middle error", rootError);
    const topError = new HandlerError("Top error", middleError);

    // Act
    const logger = new ConsoleLogger(topError, { formatter: TestFormatter });
    logger.logChain();

    // Assert
    expect(errorSpy).toHaveBeenCalledWith(
      `TestFormatter: Top error\n` + `TestFormatter: Middle error\n` + `TestFormatter: Root error`,
    );
  });

  it("should throw an error if the formatter has not formatChain method and logChain is called", () => {
    // Arrange
    class TestFormatter extends ErrorFormatter {
      format(): string {
        return `TestFormatter: ${this.error.message}`;
      }
    }

    const rootError = new HandlerError("Root error");
    const middleError = new HandlerError("Middle error", rootError);
    const topError = new HandlerError("Top error", middleError);

    // Act
    const logger = new ConsoleLogger(topError, { formatter: TestFormatter });

    // Assert
    expect(() => {
      logger.logChain();
    }).toThrowError("Formatter does not support formatChain");
  });
});
