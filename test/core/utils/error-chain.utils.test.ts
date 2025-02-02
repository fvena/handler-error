import { describe, expect, it } from "vitest";
import { HandlerError } from "../../../src/core/handler-error";
import { ErrorChainUtils } from "../../../src/core/utils/error-chain.utils";
import { ErrorSeverity } from "../../../src/core/constants";

describe("ErrorChainUtils", () => {
  describe("getErrorsChain", () => {
    it("should get the error chain", () => {
      // Arrange
      const rootError = new Error("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      // Act
      const chain = ErrorChainUtils.getErrorsChain(topError);

      // Assert
      expect(chain).toHaveLength(3);
      expect(chain[0]?.message).toBe("Top error");
      expect(chain[1]?.message).toBe("Middle error");
      expect(chain[2]?.message).toBe("Root error");
    });

    it("should prevent infinite loops in the error chain", () => {
      // Arrange
      // eslint-disable-next-line prefer-const -- Used to create circular reference
      let rootError!: HandlerError;
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      // Create circular reference
      rootError = new HandlerError("Root error", topError);

      // Act
      const chain = ErrorChainUtils.getErrorsChain(topError);

      // Assert
      expect(chain).toHaveLength(2);
      expect(chain[0]?.message).toBe("Top error");
      expect(chain[1]?.message).toBe("Middle error");
    });
  });

  describe("getRootCause", () => {
    it("should get the root cause of the error", () => {
      // Arrange
      const rootError = new Error("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      // Act
      const rootCause = ErrorChainUtils.getRootCause(topError);

      // Assert
      expect(rootCause.message).toBe("Root error");
    });

    it("should return same error if there is no cause", () => {
      // Arrange
      const error = new HandlerError("Test error");

      // Act
      const rootCause = ErrorChainUtils.getRootCause(error);

      // Assert
      expect(rootCause.message).toBe("Test error");
    });
  });

  describe("mapErrors", () => {
    it("should map the error chain", () => {
      // Arrange
      const rootError = new Error("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      // Act
      const chain = ErrorChainUtils.mapErrors(topError, (error) => error.message);

      // Assert
      expect(chain).toEqual(["Top error", "Middle error", "Root error"]);
    });
  });

  describe("findMostSevere", () => {
    it("should return the max severity of the error chain", () => {
      // Arrange
      const rootError = new HandlerError.error("Root error");
      const middleError = new HandlerError.warning("Middle error", rootError);
      const topError = new HandlerError.debug("Top error", middleError);

      // Act
      const maxSeverity = ErrorChainUtils.findMostSevere(topError);

      // Assert
      expect(maxSeverity.message).toBe("Root error");
    });

    it("should return the same error if there is no cause", () => {
      // Arrange
      const error = new HandlerError("Test error");

      // Act
      const maxSeverity = ErrorChainUtils.findMostSevere(error);

      // Assert
      expect(maxSeverity.message).toBe("Test error");
    });

    it("should return the last error if all severities are the same", () => {
      // Arrange
      const rootError = new HandlerError.error("Root error");
      const middleError = new HandlerError.error("Middle error", rootError);
      const topError = new HandlerError.error("Top error", middleError);

      // Act
      const maxSeverity = ErrorChainUtils.findMostSevere(topError);

      // Assert
      expect(maxSeverity.message).toBe("Top error");
    });

    it("should return the CRITICAL error if all severities exist", () => {
      // Arrange
      const debugError = new HandlerError.debug("Debug error");
      const infoError = new HandlerError.info("Info error", debugError);
      const warningError = new HandlerError.warning("Warning error", infoError);
      const errorError = new HandlerError.error("Error error", warningError);
      const criticalError = new HandlerError.critical("Critical error", errorError);

      // Act
      const maxSeverity = ErrorChainUtils.findMostSevere(criticalError);

      // Assert
      expect(maxSeverity.message).toBe("Critical error");
    });
  });

  describe("serialize", () => {
    it("should serialize the error chain", () => {
      // Arrange
      const rootError = new HandlerError("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      // Act
      const serializedChain = ErrorChainUtils.chainSerialize(topError);

      // Assert
      expect(serializedChain).toStrictEqual([
        {
          id: topError.id,
          message: "Top error",
          metadata: undefined,
          name: "HandlerError",
          severity: ErrorSeverity.ERROR,
          timestamp: topError.timestamp.toISOString(),
        },
        {
          id: middleError.id,
          message: "Middle error",
          metadata: undefined,
          name: "HandlerError",
          severity: ErrorSeverity.ERROR,
          timestamp: middleError.timestamp.toISOString(),
        },
        {
          id: rootError.id,
          message: "Root error",
          metadata: undefined,
          name: "HandlerError",
          severity: ErrorSeverity.ERROR,
          timestamp: rootError.timestamp.toISOString(),
        },
      ]);
    });

    it("should serialize the error chain with metadata", () => {
      // Arrange
      const metadata = { key: "value", key2: { key3: "value2", key4: ["value4", "value5"] } };
      const rootError = new HandlerError("Root error", { key: "value" });
      const topError = new HandlerError("Top error", metadata, rootError);

      // Act
      const serializedChain = ErrorChainUtils.chainSerialize(topError);

      // Assert
      expect(serializedChain).toStrictEqual([
        {
          id: topError.id,
          message: "Top error",
          metadata: { key: "value", key2: { key3: "value2", key4: ["value4", "value5"] } },
          name: "HandlerError",
          severity: ErrorSeverity.ERROR,
          timestamp: topError.timestamp.toISOString(),
        },
        {
          id: rootError.id,
          message: "Root error",
          metadata: { key: "value" },
          name: "HandlerError",
          severity: ErrorSeverity.ERROR,
          timestamp: rootError.timestamp.toISOString(),
        },
      ]);
    });

    it("should stringify the error chain", () => {
      // Arrange
      const rootError = new HandlerError("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      // Act
      const serializedChain = ErrorChainUtils.chainToString(topError);

      // Assert
      expect(serializedChain).toBe(
        `[ERROR] HandlerError: Top error\n` +
          `[ERROR] HandlerError: Middle error\n` +
          `[ERROR] HandlerError: Root error`,
      );
    });

    it("should stringify error chain with mixed severities", () => {
      // Arrange
      const rootError = new HandlerError.debug("Root error");
      const middleError = new HandlerError.warning("Middle error", rootError);
      const topError = new HandlerError.critical("Top error", middleError);

      // Act
      const serializedChain = ErrorChainUtils.chainToString(topError);

      // Assert
      expect(serializedChain).toBe(
        `[CRITICAL] CriticalHandlerError: Top error\n` +
          `[WARNING] WarningHandlerError: Middle error\n` +
          `[DEBUG] DebugHandlerError: Root error`,
      );
    });
  });
});
