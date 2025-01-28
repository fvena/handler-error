import { describe, expect, it, vi } from "vitest";
import { HandlerError } from "../../src/handler-error";
import { ErrorLogger } from "../../src/modules/error-logger";
import { ErrorFormatter } from "../../src";

const logSpy = vi.spyOn(console, "log").mockImplementation(() => {
  /* empty */
});
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

    const logger = new ErrorLogger();

    // Act
    logger.log(error);

    // Assert
    expect(errorSpy).toHaveBeenCalledWith("[ERROR] HandlerError: Test error");
  });

  it("should log a debug error", () => {
    // Arrange
    const error = new HandlerError.debug("Test error");

    const logger = new ErrorLogger();

    // Act
    logger.log(error);

    // Assert
    expect(debugSpy).toHaveBeenCalledWith("[DEBUG] DebugHandlerError: Test error");
  });

  it("should log an info error", () => {
    // Arrange
    const error = new HandlerError.info("Test error");

    const logger = new ErrorLogger();

    // Act
    logger.log(error);

    // Assert
    expect(infoSpy).toHaveBeenCalledWith("[INFO] InfoHandlerError: Test error");
  });

  it("should log a warning error", () => {
    // Arrange
    const error = new HandlerError.warning("Test error");

    const logger = new ErrorLogger();

    // Act
    logger.log(error);

    // Assert
    expect(warnSpy).toHaveBeenCalledWith("[WARNING] WarningHandlerError: Test error");
  });

  it("should log a critical error", () => {
    // Arrange
    const error = new HandlerError.critical("Test error");

    const logger = new ErrorLogger();

    // Act
    logger.log(error);

    // Assert
    expect(errorSpy).toHaveBeenCalledWith("[CRITICAL] CriticalHandlerError: Test error");
  });

  it("should log an error with a severity higher than the minimum severity", () => {
    // Arrange
    const error = new HandlerError.critical("Test error");

    const logger = new ErrorLogger("error");

    // Act
    logger.log(error);

    // Assert
    expect(errorSpy).toHaveBeenCalledWith("[CRITICAL] CriticalHandlerError: Test error");
  });

  it("should not log an error with a severity lower than the minimum severity", () => {
    // Arrange
    const error = new HandlerError.debug("Test error");

    const logger = new ErrorLogger("error");

    // Act
    logger.log(error);

    // Assert
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should log an error chain", () => {
    // Arrange
    const rootError = new HandlerError("Root error");
    const middleError = new HandlerError("Middle error", rootError);
    const topError = new HandlerError("Top error", middleError);

    const logger = new ErrorLogger();

    // Act
    logger.log(topError, true);

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

  it("should throw an error if the error is not a HandlerError", () => {
    // Arrange
    const error = new Error("Test error") as unknown as HandlerError;

    const logger = new ErrorLogger();

    // Act
    const logError = () => {
      logger.log(error);
    };

    // Assert
    expect(logError).toThrowError(TypeError);
  });

  it("should log an error with a custom formatter", () => {
    // Arrange
    class TestFormatter extends ErrorFormatter {
      format(error: HandlerError): string {
        return `TestFormatter: ${error.message}`;
      }
    }

    const formatter = new TestFormatter();
    const error = new HandlerError("Test error");
    const logger = new ErrorLogger("debug", formatter);

    // Act
    logger.log(error);

    // Assert
    expect(logSpy).toHaveBeenCalledWith("TestFormatter: Test error");
  });

  it("should log an error chain with a custom formatter", () => {
    // Arrange
    class TestFormatter extends ErrorFormatter {
      format(error: HandlerError): string {
        return `TestFormatter: ${error.message}`;
      }
    }

    const formatter = new TestFormatter();
    const rootError = new HandlerError("Root error");
    const middleError = new HandlerError("Middle error", rootError);
    const topError = new HandlerError("Top error", middleError);

    const logger = new ErrorLogger("debug", formatter);

    // Act
    logger.log(topError, true);

    // Assert
    expect(logSpy).toHaveBeenCalledWith(
      `TestFormatter: Top error\n` + `TestFormatter: Middle error\n` + `TestFormatter: Root error`,
    );
  });
});
