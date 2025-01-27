// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- Class is used as a namespace
export class DependencyContainer {
  private static dependencies = new Map<string, unknown>();

  /**
   * Registers a dependency in the container.
   *
   * @param key - The key to register the dependency with.
   * @param instance - The instance to register.
   */
  public static register(key: string, instance: unknown): void {
    if (DependencyContainer.dependencies.has(key)) {
      throw new Error(`Dependency with key '${key}' is already registered`);
    }
    DependencyContainer.dependencies.set(key, instance);
  }

  /**
   * Resolves a dependency from the container.
   *
   * @param key - The key of the dependency to resolve.
   * @returns The resolved dependency instance.
   */
  public static resolve(key: string): unknown {
    const instance = DependencyContainer.dependencies.get(key);
    if (!instance) {
      throw new Error(`Dependency with key '${key}' is not registered`);
    }
    return instance;
  }

  /**
   * Removes a dependency from the container.
   *
   * @param key - The key of the dependency to remove.
   */
  public static remove(key: string): void {
    DependencyContainer.dependencies.delete(key);
  }

  /**
   * Clears all dependencies from the container.
   */
  public static clear(): void {
    DependencyContainer.dependencies.clear();
  }
}
