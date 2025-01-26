import { HandlerError } from "../dist/index.js";

class AppError extends HandlerError {
  constructor(...arguments_) {
    super(...arguments_);
    this.name = "AppError";
  }
}

function method1() {
  method2();
}

function method2() {
  method3();
}

function method3() {
  const error = new Error("This is an error");
  throw new AppError("This is an error", "CODE_ERROR", { data: "data" }, error);
}

try {
  method1();
} catch (error) {
  if (error instanceof AppError) {
    console.log("---------------------- Serialize error ----------------------\n");
    console.log(error.serialize());

    console.log("\n---------------------- toString error -----------------------\n");
    console.log(error.toString());

    console.log("\n---------------------- Error --------------------------------");
    console.log(error);
  } else {
    console.log("It is not an instance of AppError");
  }
}
