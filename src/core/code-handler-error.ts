import type { Metadata, Severity } from "./types/handler-error.types";
import { defaultResolveEntry } from "./utils/default-resolve-entry.utils";
import { HandlerError } from "./handler-error";
import { processArguments } from "./utils/process-arguments.utils";

export type DictionaryEntry = Record<string, unknown> & {
  message: string;
  severity?: Severity;
};

export type Dictionary = Record<string, DictionaryEntry>;

export type ResolveEntry = (
  dictionary: Dictionary,
  code: string,
  metadata?: Metadata,
) => DictionaryEntry;

export class CodeHandlerError extends HandlerError {
  static dictionary?: Dictionary;
  static resolveEntry: ResolveEntry = defaultResolveEntry;

  constructor(
    code: string,
    argument2?: Error | Metadata | string,
    argument3?: Error | Metadata,
    argument4?: Error,
  ) {
    if (!new.target.dictionary) {
      throw new Error(
        "The error dictionary must be set before creating an instance of CodeHandlerError.",
      );
    }

    // Get metadata from the arguments
    const { metadata } = processArguments(argument2, argument3, argument4);

    const dictionaryEntry = new.target.resolveEntry(new.target.dictionary, code, metadata);

    // Reorganize arguments for the base class constructor
    // - If the second argument is a string, it is the error message
    // - In all other cases, only could have two more arguments, metadata and cause
    if (typeof argument2 === "string") {
      // override the dictionary entry message with the provided message
      const message = argument2;
      super(message, code, argument3, argument4);
    } else {
      const message = dictionaryEntry.message;
      super(message, code, argument2, argument3 as Error);
    }

    // Set the severity of the error based on the dictionary entry
    Object.defineProperty(this, "severity", { value: dictionaryEntry.severity, writable: false });
  }

  public static registerResolverEntry(resolveEntry: ResolveEntry) {
    this.resolveEntry = resolveEntry;
    return this;
  }

  public static addDictionary(dictionary: Dictionary) {
    this.dictionary = dictionary;
    return this;
  }
}
