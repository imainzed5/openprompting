export class ConfigError extends Error {
  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ConfigError';
  }
}

export class SetupCancelledError extends Error {
  public constructor() {
    super('Setup cancelled. No files were changed.');
    this.name = 'SetupCancelledError';
  }
}
