import { HandlerError } from "../dist/index.js";

class AppError extends HandlerError {
  constructor(message) {
    super(message);
    this.name = "AppError";

    // Ensures the prototype chain is correctly set to HandlerError.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Calls method2 as part of a demonstration of error propagation.
 * 
 * @throws {AppError} Propagates any error thrown by method2 up the call stack.
 */
function method1() {
  method2();
}

function method2() {
  method3();
}

function method3() {
  throw new AppError("Emails must include username, domain and extension.")
    .setLibrary("playground")
    .setErrorCode("INVALID_EMAIL")
    .setContext("The email entered during the registration process is invalid.")
    .setSolution(
      "1. Verify the email address entered.\n2. Correct the email address entered.\n3. Try again.",
    )
    .setValues({ email: "user@@example.com" })
    .setExample("user@example.com");
}

try {
  method1();
} catch (error) {
  if (error instanceof AppError) {
    console.log(error.toJSON());
  } else {
    console.log("It is not an instance of AppError");
  }
}
