import { CodeHandlerError } from "../code-handler-error";

export function isCodeHandlerError(error: Error): error is CodeHandlerError {
  return error instanceof CodeHandlerError;
}
