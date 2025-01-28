import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/handler-error";
import { HtmlFormatter } from "../../src/formatters/html-formatter";

describe("HtmlFormatter", () => {
  describe("format", () => {
    it("should format error with HTML tags", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new HtmlFormatter({ showTimestamp: false });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toContain('<div class="error handlerError">');
      expect(formatted).toContain('<h3 class="error-title">HandlerError</h3>');
      expect(formatted).toContain('<p class="error-message">Test error</p>');
      expect(formatted).not.toContain(
        `<div class="error-timestamp">${error.timestamp.toISOString()}</div>`,
      );
    });

    it("should format error with HTML tags with timestamp", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new HtmlFormatter({ showTimestamp: true });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toContain(
        `<div class="error-timestamp">${error.timestamp.toISOString()}</div>`,
      );
    });

    it("should format error with HTML tags with metadata", () => {
      // Arrange
      const error = new HandlerError("Test error", { key: "value" });
      const formatter = new HtmlFormatter({ showMetadata: true });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toContain(
        '<div class="error-metadata"><pre>{&quot;key&quot;:&quot;value&quot;}</pre></div>',
      );
    });

    it("should format error with HTML tags with stack trace", () => {
      // Arrange
      const error = new HandlerError("Test error");
      const formatter = new HtmlFormatter({ showStackTrace: true });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toContain('<pre class="error-stack">HandlerError: Test error');
    });

    it("should escape HTLM characters", () => {
      // Arrange
      const error = new HandlerError("<script>alert('XSS')</script>", {
        key: "<script>alert('XSS')</script>",
      });
      const formatter = new HtmlFormatter({ showMetadata: true, showTimestamp: false });

      // Act
      const formatted = formatter.format(error);

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
    it("should format error chain with HTML tags", () => {
      // Arrange
      const error1 = new HandlerError("Test error 1");
      const error2 = new HandlerError("Test error 2", error1);
      const error3 = new HandlerError("Test error 3", error2);
      const formatter = new HtmlFormatter({ showTimestamp: false });

      // Act
      const formatted = formatter.formatChain(error3);

      // Assert
      expect(formatted).toContain('<div class="error-chain">');
      expect(formatted).toContain('<div class="error handlerError">');
      expect(formatted).toContain('<h3 class="error-title">HandlerError</h3>');
      expect(formatted).toContain('<p class="error-message">Test error 1</p>');
      expect(formatted).toContain('<p class="error-message">Test error 2</p>');
      expect(formatted).toContain('<p class="error-message">Test error 3</p>');
    });
  });
});
