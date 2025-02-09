<br /><!-- markdownlint-disable-line -->

<p align="right">
  ⭐ &nbsp;&nbsp;<strong>to the project if you like it</strong> ↗️:
</p>

<h2 align="center">HandlerError Library</h2>
<p align="center">A robust and customizable error handling library for TypeScript, designed to simplify error management and provide useful utilities for debugging, logging, and serialization.</p>

<br/>

<div align="center">

<!-- markdownlint-disable MD042 -->

[![SemVer](https://img.shields.io/npm/v/handler-error)](https://www.npmjs.com/package/handler-error)
[![npm bundle size](https://img.shields.io/bundlephobia/min/handler-error)](https://bundlephobia.com/package/handler-error)
[![Build Status](https://github.com/fvena/handler-error/workflows/CI%2FCD/badge.svg)](https://github.com/fvena/handler-error/actions)
[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/fvena/handler-error/actions)
[![Live Docs](https://img.shields.io/badge/docs-online-success.svg)](https://github.com/fvena/handler-error#readme)

<!-- markdownlint-enable MD042 -->

</div>

<br />

> **Want to write error messages that truly help developers?**
>
> Check out this [article](https://medium.com/@fvena32/como-escribir-mensajes-de-error-útiles-en-tus-librerías-04d0bb0f131d) where we explain best practices for creating useful error messages. This library is designed to follow those principles!

> **AI Assistant for Better Error Messages**
>
> I have developed a GPT-based assistant that follows these guidelines to help you write better error messages. You can access it [here](https://chatgpt.com/g/g-6773a5efd4688191b6fdc5268c4502f8-useful-error-message-guide)!

<br />

<details open="true">
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#-features">Features</a></li>
    <li><a href="#-getting-started">Getting Started</a></li>
    <li><a href="#-usage">Usage</a></li>
    <li><a href="#-api-reference">API Reference</a></li>
    <li><a href="#-contributions">Contributions</a></li>
    <li><a href="#-license">License</a></li>
  </ol>
</details>

## ✨ Features

- **Custom Error Class**: HandlerError to encapsulate detailed error information, including severity, metadata, and causation.
- **Flexible Constructor**: Create errors with a message, code, metadata, and cause.
- **Severity Levels**: Assign severity levels to errors for better handling and logging.

<br />

## 📦 Installation

```bash
# Install with npm:
npm install handler-error

# Install with yarn:
yarn add handler-error

# Install with pnpm:
pnpm add handler-error
```

<br />

## 🚀 Getting Started

### Basic Usage

```typescript
import { HandlerError } from "handler-error";

try {
  throw new HandlerError("Something went wrong");
} catch (error) {
  console.error(error.serialize());
}
```

### Custom errors class (recommended)

To create a custom error class, extend the `HandlerError` class and pass the arguments to the parent constructor.

- Create a custom error class.

  ```typescript
  import { HandlerError } from "handler-error";

  class AppError extends HandlerError {
    constructor(...arguments_) {
      super(...arguments_);
    }
  }
  ```

- Type guard to check if an error is an instance of `AppError`.

  ```typescript
  function isAppError(error: Error): error is AppError {
    return error instanceof AppError;
  }
  ```

- Catch and handle the custom error.

  ```typescript
  try {
    throw new AppError("Something went wrong");
  } catch (error) {
    if (isAppError(error)) {
      console.error(error.serialize());
    }
  }
  ```

### Handling errors with a custom handler

```typescript
function handleError(error: Error) {
  if (error instanceof AppError) {
    console.error("AppError:", error.serialize());
  } else {
    console.error("Unknown error:", error.message);
  }
}

try {
  throw new AppError("Something went wrong");
} catch (error) {
  handleError(error);
}
```

<br />

## 📖 API Reference

### Flexible Error Creation

The HandlerError class provides a highly flexible constructor that adapts to different scenarios. You can include additional metadata, specify an error code, or link to a cause.

The constructor accepts the following arguments:

1. `message` (required): A message describing the error.
1. `code` (optional): A custom error code.
1. `metadata` (optional): Additional information to provide context for the error.
1. `cause` (optional): The cause of the error.

You must maintain the order of the arguments to ensure correct behavior. However, any optional argument can be omitted without passing undefined, resulting in a more elegant and intuitive constructor design.

```typescript
import { HandlerError } from "handler-error";

// Create a simple error with a message.
const error = new HandlerError("Something went wrong");

// Create an error with a custom code.
const error = new HandlerError("Something went wrong", "ERR_CUSTOM");

// Create an error with additional metadata.
const metadata = { user: "John Doe" };
const error = new HandlerError("Something went wrong", metadata);

// Create an error with a cause.
const cause = new HandlerError("Internal error");
const error = new HandlerError("Something went wrong", cause);

// Create an error with a custom code and cause.
const cause = new HandlerError("Internal error");
const error = new HandlerError("Something went wrong", "ERR_CUSTOM", cause);

// Create an error with metadata and a cause.
const metadata = { user: "John Doe" };
const cause = new HandlerError("Internal error");

const error = new HandlerError("Something went wrong", metadata, cause);

// Create an error with all arguments.
const metadata = { user: "John Doe" };
const cause = new HandlerError("Internal error");

const error = new HandlerError("Something went wrong", "ERR_CUSTOM", metadata, cause);
```

### CodeHandlerError

The CodeHandlerError class extends the base HandlerError class and integrates with the DictionaryResolver module to provide centralized error management. It allows you to define errors using a predefined error code from the dictionary, automatically retrieving associated metadata such as messages and severity.

the CodeHandlerError class requires an error code as the first argument. This code is used to retrieve the error message and severity from the dictionary. You can also include a message as the second argument to override the default message.

> **Note:** If the provided error code is not found in the dictionary, CodeHandlerError will throw an error. Ensure all error codes are registered in the DictionaryResolver before use.

All API methods and properties from the HandlerError class are available in the CodeHandlerError class.

```typescript
import { CodeHandlerError } from "handler-error";

// Create an error with a predefined error code.
const error = new CodeHandlerError("VAL_001");

// Create an error with a custom message.
const error = new CodeHandlerError("VAL_001", "Custom message");

// Create an error with additional metadata.
const metadata = { user: "John Doe" };
const error = new CodeHandlerError("VAL_001", metadata);

// Create an error with a cause.
const cause = new CodeHandlerError("VAL_002");
const error = new CodeHandlerError("VAL_001", cause);

// Create an error with a custom message and cause.
const cause = new CodeHandlerError("VAL_002");
const error = new CodeHandlerError("VAL_001", "Custom message", cause);

// Create an error with metadata and a cause.
const metadata = { user: "John Doe" };
const cause = new CodeHandlerError("VAL_002");

const error = new CodeHandlerError("VAL_001", metadata, cause);

// Create an error with all arguments.
const metadata = { user: "John Doe" };
const cause = new CodeHandlerError("VAL_002");

const error = new CodeHandlerError("VAL_001", "Custom message", metadata, cause);
```

### Properties

| Property    | Type           | Description                                                                   |
| ----------- | -------------- | ----------------------------------------------------------------------------- |
| `id`        | `string`       | Unique identifier for the error.                                              |
| `cause`     | `HandlerError` | The cause of the error.                                                       |
| `code`      | `string`       | Custom error code for identifying the error.                                  |
| `message`   | `string`       | Message describing the error.                                                 |
| `metadata`  | `object`       | Additional information to provide context for the error.                      |
| `name`      | `string`       | Name of the error class.                                                      |
| `severity`  | `Severity`     | Severity level of the error: `critical`, `error`, `warning`, `info`, `debug`. |
| `timestamp` | `Date`         | Timestamp of when the error curred.                                           |

### Methods

| Method      | Description                                                  | Return Value      |
| ----------- | ------------------------------------------------------------ | ----------------- |
| `serialize` | Serialize the error to a plain object.                       | `SerializedError` |
| `toString`  | Returns a human-readable string representation of the error. | `string`          |

### Severity Levels

The HandlerError library supports the following severity levels:

| Level    | Usage                                                           |
| -------- | --------------------------------------------------------------- |
| critical | For errors that require immediate attention and system shutdown |
| error    | For standard errors that prevent normal operation               |
| warning  | For non-critical issues that don't prevent operation            |
| info     | For informational messages about error handling                 |
| debug    | For detailed debugging information                              |

#### Using Severity Levels

The library provides static methods to create errors with specific severity levels. This simplifies error creation and ensures consistency

> **Note:** The severity level is set to `error` by default.

```typescript
import { HandlerError } from "handler-error";

// Add type information
const criticalError: HandlerError = HandlerError.critical(
  "Database connection failed",
  "DB_001",
  { attemptCount: 3 },
  new Error("Connection timeout"),
);

// Add practical examples for each severity
const dbError = HandlerError.critical("Database connection failed"); // System cannot function
const authError = HandlerError.error("Invalid credentials"); // Operation failed
const rateLimit = HandlerError.warning("Rate limit at 80%"); // Potential issue
const configLoad = HandlerError.info("Using fallback config"); // Important information
const queryTime = HandlerError.debug("Query took 1.2s"); // Performance tracking
```

<br />

## 📚 Modules

### Handling Error Chains

The `ErrorChainUtils` module provides utilities to work with chains of errors caused by one another. It allows you to trace, analyze, and process errors in a hierarchy.

This module makes it easy to trace and analyze errors in complex systems, ensuring you can track their causes and severity efficiently.

| Method           | Description                                                  | Return Value           |
| ---------------- | ------------------------------------------------------------ | ---------------------- |
| `getErrorChain`  | Get the full chain of errors starting from a specific error. | `HandlerError[]`       |
| `getRootCause`   | Retrieves the root error of the chain.                       | `HandlerError`, `null` |
| `mapErrors<T>`   | Applies a mapper function to each error in the chain.        | `T[]`                  |
| `findMostSevere` | Finds the most severe error in the chain.                    | `HandlerError`, `null` |
| `serializeChain` | Serializes the entire chain into an array of plain objects.  | `SerializedError[]`    |

```typescript
import { ErrorChainUtils } from "handler-error";

const error = new HandlerError("Something went wrong", "VAL_001");
const cause = new HandlerError("Internal error", "VAL_002", undefined, error);

// Get the full chain of errors
const chain = ErrorChainUtils.getErrorChain(cause);
console.log(chain.length); // Output: 2

// Get the root cause of the chain
const rootCause = ErrorChainUtils.getRootCause(cause);
console.log(rootCause.message); // Output: Something went wrong

// Find the most severe error in the chain
const mostSevere = ErrorChainUtils.findMostSevere(cause);
console.log(mostSevere.message); // Output: Something went wrong

// Serialize the entire chain
const serializedChain = ErrorChainUtils.serializeChain(cause);
```

### Error Dictionary

The DictionaryResolver module provides a centralized registry for managing error codes and their associated metadata. It allows developers to define a dictionary of errors and retrieve information such as error messages, severity levels, and additional context by using error codes.

| Method               | Description                                         | Return Value           |
| -------------------- | --------------------------------------------------- | ---------------------- |
| `registerDictionary` | Register a dictionary of errors.                    | `void`                 |
| `clearDictionary`    | Clear the error dictionary.                         | `void`                 |
| `getEntry`           | Retrieve the error entry for a specific error code. | `ErrorDictionaryEntry` |

```typescript
import { DictionaryResolver } from "handler-error";
import { ErrorSeverity } from "handler-error";

const dictionary = {
  VAL_001: { message: "Critical validation error", severity: ErrorSeverity.CRITICAL },
  VAL_002: { message: "Validation warning", severity: ErrorSeverity.WARNING },
  VAL_003: { message: "Informational message", severity: ErrorSeverity.INFO },
};

// Register the dictionary
DictionaryResolver.registerDictionary(dictionary);

// Retrieve an error entry
const entry = DictionaryResolver.getEntry("VAL_001");
console.log(entry.message); // Output: Critical validation error
console.log(entry.severity); // Output: critical
```

#### Using Dynamic Messages

The DictionaryResolver allows defining error messages with placeholders in the format {{ key }}, where key corresponds to a metadata property. These placeholders are replaced with the values provided when the error is created.

```typescript
import { DictionaryResolver } from "handler-error";
import { ErrorSeverity } from "handler-error";

const dictionary = {
  VAL001: { message: "Validation error for user {{ user }}", severity: ErrorSeverity.ERROR },
};

// Register the dictionary
DictionaryResolver.registerDictionary(dictionary);

// Create an error with metadata
const error = new CodeHandlerError("VAL001", { user: "John Doe" });
console.log(error.message); // Output: Validation error for user John Doe
```

#### Error Code Conventions

We recommend following these conventions for error codes:

- Use uppercase letters and underscores (e.g., `ERR_INVALID_INPUT`)
- Start with a category prefix (e.g., `VAL_` for validation errors)
- Include a numeric identifier (e.g., `DB_001`)

Example categories:

- `VAL_`: Validation errors
- `AUTH_`: Authentication errors
- `DB_`: Database errors
- `API_`: API-related errors

### Error Formatter

The `Error Formatter` module provides an extensible framework for formatting error messages and error chains. It allows you to define custom formats for displaying errors in different contexts, such as logs, user interfaces, or reports.

#### Basic Usage

```typescript
import { ErrorFormatter } from "handler-error";

// Define a custom error formatter
class CustomErrorFormatter extends ErrorFormatter {
  format(error: HandlerError): string {
    return `${error.id}: ${error.message}`;
  }
}

// Use the custom error formatter
const formatter = new CustomErrorFormatter();
const error = new HandlerError("Something went wrong");

console.log(formatter.format(error)); // Output: 1234: Something went wrong
```

#### Implementing Custom Formats with options

```typescript
import { ErrorFormatter } from "handler-error";

// Define custom format options
interface CustomFormatOptions {
  context: string;
}

// Define a custom error formatter
class CustomErrorFormatter extends ErrorFormatter<CustomFormatOptions> {
  private defaultOptions: CustomFormatOptions = {
    context: "production",
  };

  format(error: HandlerError): string {
    return `${error.id}: ${error.message} (${this.defaultOptions.context})`;
  }
}

// Use the custom error formatter with options
const formatter = new CustomErrorFormatter();
const error = new HandlerError("Something went wrong");

console.log(formatter.format(error, options)); // Output: 1234: Something went wrong (production)
```

#### Implementing Custom Formats with custom options

```typescript
import { ErrorFormatter } from "handler-error";

// Define custom format options
interface CustomFormatOptions {
  context: string;
}

// Define a custom error formatter
class CustomErrorFormatter extends ErrorFormatter<CustomFormatOptions> {
  private defaultOptions: CustomFormatOptions = {
    context: "production",
  };

  format(error: HandlerError, options?: CustomFormatOptions): string {
    const customOptions = { ...this.defaultOptions, ...options };
    return `${error.id}: ${error.message} (${customOptions.context})`;
  }
}

// Use the custom error formatter with custom options
const formatter = new CustomErrorFormatter();
const error = new HandlerError("Something went wrong");

console.log(formatter.format(error, { context: "development" })); // Output: 1234: Something went wrong (development)
```

#### Using Error Formatters with default Error Chains

```typescript
import { ErrorFormatter, HandlerError } from "handler-error";

// Define a custom error formatter
class CustomErrorFormatter extends ErrorFormatter {
  format(error: HandlerError): string {
    return `${error.id}: ${error.message}`;
  }
}

// Use the custom error formatter
const formatter = new CustomErrorFormatter();
const error = new HandlerError("Something went wrong");
const cause = new HandlerError("Internal error", undefined, error);

// Get the full chain of errors
console.log(formatter.formatChain(cause));

// Output:
// 1234: Internal error
// 5678: Something went wrong
```

#### Using Error Formatters with Custom Error Chains

```typescript
import { ErrorChainUtils, ErrorFormatter, HandlerError } from "handler-error";

class CustomErrorFormatter extends ErrorFormatter {
  format(error: HandlerError): string {
    return `${error.id}: ${error.message}`;
  }

  override formatChain(error: HandlerError): string {
    return ErrorChainUtils.mapErrors(error, (item, index) => `${index}: ${item.message}`).join(
      "\n",
    );
  }
}

// Use the custom error formatter
const formatter = new CustomErrorFormatter();
const error = new HandlerError("Something went wrong");
const cause = new HandlerError("Internal error", undefined, error);

// Get the full chain of errors
console.log(formatter.formatChain(cause));

// Output:
// 1: Internal error
// 2: Something went wrong
```

<br />

## 🤝 Contributions

I love collaboration! Here's how you can help improve Handler Error.

1. Fork the repository.
1. Create a feature branch: `git checkout -b feature/<your-feature>`.
1. Install dependencies: `npm install`.
1. Create a branch for your changes: `git checkout -b feature/<your-feature>`.
1. Make your changes.
1. Add tests for your changes.
1. Ensure tests pass: `npm test`.
1. Check code style: `npm run lint`.
1. Commit your changes with semantic messages: `git commit -am 'feat: add new feature'`.
1. Submit a pull request with your changes to the `main` branch of the `fvena/handler-error` repository.

**Note:** Please follow our commit message convention and ensure documentation is updated for new features.

<br />

## 📜 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

<br />

<p align="center">
  <strong>Thank you for using this library!</strong><br />
  <em>Developed with care by <a href="https://www.fvena.com">Francisco Vena</a></em>
</p>
