export class AppError extends Error {
  constructor(message, statusCode = 400, code = "BAD_REQUEST", details = {}) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function notFound(message = "Resource not found") {
  return new AppError(message, 404, "NOT_FOUND");
}
