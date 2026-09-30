export class AppError extends Error {
  statusCode: number;
  code?: string;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code?: string,
  ) {
    super(message);

    this.name =
      "AppError";

    this.statusCode =
      statusCode;

    this.code =
      code;

    this.isOperational =
      true;

    Object.setPrototypeOf(
      this,
      AppError.prototype,
    );
  }
}