export class ResolutionError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ResolutionError';
  }
}
