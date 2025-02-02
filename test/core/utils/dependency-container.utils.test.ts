import { beforeEach, describe, expect, it } from "vitest";
import { HandlerError } from "../../../src/core/handler-error";
import { DependencyContainer } from "../../../src/core/utils/dependency-container.utils";

describe("DependencyContainer", () => {
  beforeEach(() => {
    DependencyContainer.clear();
  });

  it("should register and resolve a dependency", () => {
    // Arrange
    const instance = new HandlerError("Test error");
    const key = "TestKey";

    // Act
    DependencyContainer.register(key, instance);
    const resolvedInstance = DependencyContainer.resolve(key);

    // Assert
    expect(resolvedInstance).toBe(instance);
  });

  it("should throw an error if trying to resolve a dependency that is not registered", () => {
    // Arrange
    const key = "TestKey";

    // Act
    const resolveDependency = () => DependencyContainer.resolve(key);

    // Assert
    expect(resolveDependency).toThrowError(`Dependency with key '${key}' is not registered`);
  });

  it("should throw an error if trying to register a dependency that is already registered", () => {
    // Arrange
    const instance = new HandlerError("Test error");
    const key = "TestKey";

    // Act
    DependencyContainer.register(key, instance);
    const registerDependency = () => {
      DependencyContainer.register(key, instance);
    };

    // Assert
    expect(registerDependency).toThrowError(`Dependency with key '${key}' is already registered`);
  });

  it("should remove a dependency", () => {
    // Arrange
    const instance = new HandlerError("Test error");
    const key = "TestKey";

    // Act
    DependencyContainer.register(key, instance);
    DependencyContainer.remove(key);
    const resolveDependency = () => DependencyContainer.resolve(key);

    // Assert
    expect(resolveDependency).toThrowError(`Dependency with key '${key}' is not registered`);
  });
});
