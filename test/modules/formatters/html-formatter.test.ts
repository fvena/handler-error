import { describe, expect, it } from "vitest";
import { HandlerError } from "../../../src/core/handler-error";
import { HtmlFormatter } from "../../../src/modules/formatters/implementations/html-formatter";

describe("HtmlFormatter", () => {
  describe("format", () => {
    it("should format error", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new HtmlFormatter(error, { showTimestamp: false });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toContain('<div class="error handlerError">');
      expect(formatted).toContain('<h3 class="error-title">HandlerError</h3>');
      expect(formatted).toContain('<p class="error-message">Test error</p>');
      expect(formatted).not.toContain(
        `<div class="error-timestamp">${error.timestamp.toISOString()}</div>`,
      );
    });

    it("should format error with timestamp", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new HtmlFormatter(error, { showTimestamp: true });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toContain(
        `<div class="error-timestamp">${error.timestamp.toISOString()}</div>`,
      );
    });

    it("should format error with metadata", () => {
      // Arrange
      const error = new HandlerError("Test error", { key: "value" });
      const formatter = new HtmlFormatter(error, { showMetadata: true });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toContain(
        '<div class="error-metadata"><pre>{&quot;key&quot;:&quot;value&quot;}</pre></div>',
      );
    });

    it("should format error with stack trace", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new HtmlFormatter(error, { showStackTrace: true });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toContain('<pre class="error-stack">HandlerError: Test error');
    });

    it("should escape HTLM characters", () => {
      // Arrange
      const error = new HandlerError("<script>alert('XSS')</script>", {
        key: "<script>alert('XSS')</script>",
      });
      const formatter = new HtmlFormatter(error, { showMetadata: true, showTimestamp: false });

      // Act
      const formatted = formatter.format();

      // Assert
      expect(formatted).toContain(
        '<p class="error-message">&lt;script&gt;alert(&#039;XSS&#039;)&lt;&#x2F;script&gt;</p>',
      );
      expect(formatted).toContain(
        "<pre>{&quot;key&quot;:&quot;&lt;script&gt;alert(&#039;XSS&#039;)&lt;&#x2F;script&gt;&quot;}</pre>",
      );
    });
  });

  describe("formatChain", () => {
    it("should format error chain", () => {
      // Arrange
      const rootError = new HandlerError("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      const formatter = new HtmlFormatter(topError, { showTimestamp: false });

      // Act
      const formatted = formatter.formatChain();

      // Assert
      expect(formatted).toContain('<div class="error-chain">');
      expect(formatted).toContain('<div class="error handlerError">');
      expect(formatted).toContain('<h3 class="error-title">HandlerError</h3>');
      expect(formatted).toContain('<p class="error-message">Top error</p>');
      expect(formatted).toContain('<p class="error-message">Middle error</p>');
      expect(formatted).toContain('<p class="error-message">Root error</p>');
    });
  });
});
