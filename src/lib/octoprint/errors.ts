export class OctoprintError extends Error {
  public readonly status: number;

  public readonly message: string;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.message = message;
  }
}
