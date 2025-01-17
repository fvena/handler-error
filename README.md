<br /><!-- markdownlint-disable-line -->

<p align="right">
  ⭐ &nbsp;&nbsp;<strong>to the project if you like it</strong> ↗️:
</p>

<h2 align="center">Handler Error</h2>
<p align="center">Simplify error management with context-rich, standardized debugging for Node.js and browsers.</p>

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

<details>
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

- **Custom Error Handling**: Create errors with detailed context, descriptions, solutions, and metadata.
- **Environment Info**: Retrieve detailed runtime environment information, including browser and server contexts.
- **Error Logging**: Use default predefined templates to display error information in the console or terminal.
- **JSON Serialization**: Convert error information into a structured JSON format, enabling seamless integration with APIs, logging systems, or storage solutions.

## 🚀 Getting Started

### Prerequisites

Ensure you have the latest version of npm installed and a supported version of Node.js:

- **Node.js**: >=18.0.0
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Install with npm:
npm install handler-error

# Install with yarn:
yarn add handler-error

# Install with pnpm:
pnpm add handler-error
```

## 🧑‍💻 Usage

### Creating a custom errors class

```typescript
import { HandlerError } from "handler-error";

class AppError extends HandlerError {
  constructor(message) {
    super(message);
    this.name = "AppError";
  }
}
```

### Using type guards

```typescript
function isAppError(error: Error): error is AppError {
  return error instanceof AppError;
}
```

### Catching and Handling errors

```typescript
function processRequest() {
  try {
    // Simulate an error
    throw new AppError("Request failed").setContext("API request");
  } catch (err) {
    if (isAppError(err)) {
      err.log("detail");
    } else {
      console.error("Unknown error:", err);
    }
  }
}
```

### Handling errors with a custom handler

```typescript
function handleError(error: Error) {
  if (error instanceof AppError) {
    console.error("AppError:", error);
  } else {
    console.error("Unknown error:", error);
  }
}

try {
  throw new AppError("A critical error occurred")
    .setContext("Database operation")
    .setSeverity("critical");
} catch (error) {
  handleError(error);
}
```

### Launch detailed custom error

```typescript
throw new AppError("Invalid email address provided.")
  .setLibrary("playground")
  .setErrorCode("INVALID_EMAIL")
  .setContext("The email entered during the registration process is invalid.")
  .setDescription("Emails must include username, domain and extension.")
  .setSolution(
    "1. Verify the email address entered.\n2. Correct the email address entered.\n3. Try again.",
  )
  .setValues({ email: "user@@example.com" })
  .setExample("user@example.com");
```

### Fetching environment information

Handler Error provides a fetchEnvironmentInfo method for capturing runtime details:

```typescript
import { HandlerError } from "handler-error";

class AppError extends HandlerError {
  constructor(message) {
    super(message);
    this.name = "AppError";
    this.fetchEnvironmentInfo(); // Enables detailed environment logging
  }
}

const error = new AppError("An error occurred");
console.log(error.environmentInfo);
```

#### Example output in a browser environment

```json
{
  "environment": "browser",
  "browserInfo": {
    "cookiesEnabled": true,
    "language": "en-US",
    "platform": "Windows NT 10.0",
    "screenResolution": {
      "height": 1080,
      "width": 1920
    },
    "url": "http://localhost:3000",
    "userAgent": "Mozilla/5.0 ..."
  }
}
```

#### Example output in a Node.js environment

```json
{
  "environment": "node",
  "serverInfo": {
    "cpuArch": "x64",
    "hostname": "server-01",
    "nodeVersion": "v18.15.0",
    "osRelease": "10.0.19042",
    "osType": "Windows_NT",
    "platform": "win32",
    "systemUptime": 3600 // seconds
  },
  "isProduction": false
}
```

### Sending errors to a logging service

You can extend the `HandlerError` class to integrate error reporting tools like [Sentry](https://sentry.io).

```typescript
import { HandlerError } from "handler-error";

class AppError extends HandlerError {
  constructor(message) {
    super(message);
    this.name = "AppError";
    this.logToService(); // Send error to logging service when created
  }

  private logToService() {
    // Format error data
    const logData = {
      id: this.id,
      message: this.message,
      context: this.context,
      severity: this.severity,
      type: this.type,
      errorCode: this.errorCode,
      metadata: this.metadata,
      values: this.values,
      environmentInfo: this.environmentInfo,
    };

    // Send error to logging service
    console.log("Sending error to logging service:", logData);
  }
}
```

## 📖 API Reference

### Properties

The Handler Error library provides a wide range of properties to enrich error handling and improve debugging.

- None of the properties are mandatory.
- Some properties have default values, while others are assigned a value when the error is thrown.
- For greater flexibility, almost properties are editable except:
  - `name`, which is defined when extending the class.
  - `message`, which is defined when throwing a new error.
  - `timestamp`, which is set when the error is thrown.
  - `stackTrace`, which is generated when the error is thrown.

> The properties are grouped into logical sections to make it easier for developers to understand their purpose and usage.

<br />

#### Identification

| Property    | Type     | Default     | Description                               |
| ----------- | -------- | ----------- | ----------------------------------------- |
| `id`        | `string` | `generated` | Unique identifier for the error.          |
| `file`      | `string` | `generated` | File in which the error occurred.         |
| `library`   | `string` |             | Library or package that caused the error. |
| `method`    | `string` | `generated` | Method in which the error occurred.       |
| `timestamp` | `Date`   | `generated` | Timestamp of when the error occurred.     |

<br />

#### Description

| Property   | Type     | Default | Description                                                             |
| ---------- | -------- | ------- | ----------------------------------------------------------------------- |
| `context`  | `string` |         | The context where the error occurred.                                   |
| `message`  | `string` |         | Message provided when the error is thrown, **not editable**.            |
| `name`     | `string` |         | Name of the error class, defined when creating it and **not editable**. |
| `solution` | `string` |         | Solution to resolve the error.                                          |

<br />

#### Categorization

| Property    | Type        | Default | Description                                    |
| ----------- | ----------- | ------- | ---------------------------------------------- |
| `errorCode` | `string`    |         | Custom error code.                             |
| `severity`  | `Severity`  |         | A custom error code for identifying the error. |
| `type`      | `ErrorType` | `error` | Type of error.                                 |

```typescript
/**
 * Represents the severity level of an error
 */
type Severity = "critical" | "high" | "medium" | "low";

/**
 * Represents the type of error
 */
type ErrorType = "error" | "warning";
```

<br />

#### Additional Information

| Property          | Type              | Default | Description                            |
| ----------------- | ----------------- | ------- | -------------------------------------- |
| `example`         | `string`          |         | Example of how to resolve the error.   |
| `metadata`        | `object`          |         | Additional metadata for the error.     |
| `values`          | `object`          |         | Values associated with the error.      |
| `environmentInfo` | `EnvironmentInfo` |         | Environment information for the error. |

```typescript
/**
 * Represents the environment information for the error
 */
interface EnvironmentInfo {
  environment: "browser" | "node" | "unknown";
  browserInfo?: {
    cookiesEnabled: boolean; // Indicates if cookies are enabled
    language: string; // Language of the browser
    platform: string; // Platform of the browser
    screenResolution?: {
      height: number; // Height of the screen
      width: number; // Width of the screen
    };
    url: string; // URL of the page
    userAgent: string; // User agent string
  };
  serverInfo?: {
    cpuArch: string; // CPU Architecture x64, x86
    hostname: string; // Hostname of the server
    nodeVersion: string; // Node.js version
    osRelease: string; // OS release version
    osType: string; // OS type (e.g., Windows_NT)
    platform: string; // Platform (e.g., win32)
    systemUptime: number; // System uptime in seconds
  };
  isProduction: boolean; // Indicates if the environment is production
}
```

---

### Setters

They allow developers to enrich the error with additional information.

#### Identification

| Method       | Type     | Description                                       |
| ------------ | -------- | ------------------------------------------------- |
| `setFile`    | `string` | Set the file in which the error occurred.         |
| `setLibrary` | `string` | Set the library or package that caused the error. |
| `setMethod`  | `string` | Set the method in which the error occurred.       |

<br />

#### Description

| Method        | Type     | Description                               |
| ------------- | -------- | ----------------------------------------- |
| `setContext`  | `string` | Set the context where the error occurred. |
| `setSolution` | `string` | Set a solution to resolve the error.      |

<br />

#### Categorization

| Method         | Type        | Description                                                                                      |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `setErrorCode` | `string`    | Set a custom error code.                                                                         |
| `setSeverity`  | `Severity`  | Set a custom error code for identifying the error. Accepts: `critical`, `high`, `medium`, `low`. |
| `setType`      | `ErrorType` | Set the type of error. Accepts: `error`, `warning`.                                              |

<br />

#### Additional Information

| Method        | Type     | Description                                 |
| ------------- | -------- | ------------------------------------------- |
| `setExample`  | `string` | Set an example of how to resolve the error. |
| `setMetadata` | `object` | Set additional metadata for the error.      |
| `setValues`   | `object` | Set values associated with the error.       |

---

### Utility Methods

Utility methods provide additional functionality for working with errors.

| Method   | Type      | Default  | Description                                 |
| -------- | --------- | -------- | ------------------------------------------- |
| `log`    | `LogType` | `simple` | Write the error information to the console. |
| `toJSON` |           |          | Serialize the error information.            |

#### Log Types

The `log` method accepts a log type to determine the level of detail in the output. The following log types are available:

- `simple`: Basic error information including message and stack trace
- `compact`: Minimal output with just the essential error details
- `detail`: Comprehensive output including all error properties

```typescript
type LogType = "compact" | "detail" | "simple";
```

#### Example Usage

```typescript
// Logging with different formats
error.log(); // Uses default 'simple' format
error.log("compact");
error.log("detail");

// Converting to JSON
const errorJson = error.toJSON();
console.log(JSON.stringify(errorJson, null, 2));
```

## 🤝 Contributions

I love collaboration! Here's how you can help improve Handler Error.

1. Fork the repository.
1. Create a feature branch: `git checkout -b feature/<your-feature>`.
1. Install dependencies: `npm install`.
1. Make your changes.
1. Ensure tests pass: `npm test`.
1. Check code style: `npm run lint`.
1. Commit your changes: `git commit -m "feat: Add your feature"`.
1. Push to the branch: `git push origin feature/<your-feature>`.
1. Open a pull request.

**Note:** Please follow our commit message convention and ensure documentation is updated for new features.

## 📜 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

<br />

<p align="center">
  <strong>Thank you for using this library!</strong><br />
  <em>Developed with care by <a href="https://www.fvena.com">Francisco Vena</a></em>
</p>
