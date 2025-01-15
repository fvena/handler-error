import type { StackFrame } from "../types";
import path from "node:path";
import { URL } from "node:url";
import { parseStack } from "error-stack-parser-es/lite";

/**
 * Formats a stack trace into a cleaned and human-readable array of `StackFrame` objects.
 *
 * @remarks
 * This function processes raw stack trace information by:
 * - Filtering out frames from `node_modules` and internal Node.js modules
 * - Removing frames with potential library parsing issues
 * - Converting absolute file paths to relative paths
 *
 * @param stack - The raw stack trace string to be parsed and formatted
 * @returns An array of formatted stack frames with relative file paths and key stack information
 *
 * @throws {Error} Logs parsing errors to console and returns an empty array
 *
 * @example
 * ```typescript
 * const stackTrace = new Error().stack;
 * const formattedStack = formatStack(stackTrace);
 * // Returns cleaned stack frames with relative file paths
 * ```
 */
export function formatStack(stack: string): StackFrame[] {
  try {
    const parsedStack = parseStack(stack);

    return parsedStack
      .filter(
        (frame) =>
          !frame.file?.includes("node_modules") &&
          !frame.file?.includes("internal") &&
          frame.file !== frame.raw, // Library bug, if not find file, file is equal to raw
      )
      .map((frame) => ({
        col: frame.col,
        file: frame.file ? getRelativePath(frame.file) : undefined,
        line: frame.line,
        method: frame.function,
      }));
  } catch (error) {
    console.error("Error parsing stack:", error);
    return [];
  }
}

/**
 * Converts an absolute file path or a file URL to a relative path based on the current working directory.
 *
 * @param filePath - The absolute file path or file URL to be converted.
 * @returns The relative path from the current working directory to the given file path, or the original file path if conversion fails.
 *
 * @remarks
 * This function handles both file URLs and absolute file paths, with special handling for Windows platforms.
 * If the conversion fails, it returns the original input path to prevent breaking the calling code.
 *
 * @example
 * ```typescript
 * const relativePath = getRelativePath("file:///Users/fvena/Sites/handler-error/src/utils/stack.ts");
 * console.log(relativePath); // Outputs: src/utils/stack.ts
 * ```
 *
 * @throws {Error} If the input is not a valid URL or absolute path (caught internally).
 */
export function getRelativePath(filePath: string): string {
  try {
    let absolutePath: string;

    if (filePath.startsWith("file://")) {
      const parsedUrl = new URL(filePath);
      absolutePath = decodeURIComponent(parsedUrl.pathname);

      // Remove leading slash on Windows
      if (process.platform === "win32" && absolutePath.startsWith("/")) {
        absolutePath = absolutePath.slice(1);
      }
    } else if (path.isAbsolute(filePath)) {
      absolutePath = filePath;
    } else {
      throw new Error(`File path is not a valid URL or absolute path: ${filePath}`);
    }

    return path.relative(process.cwd(), absolutePath);
  } catch {
    return filePath;
  }
}
