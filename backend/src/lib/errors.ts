export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class OpenAIError extends AppError {
  constructor(message: string) {
    super(message, 502, "OPENAI_ERROR");
    this.name = "OpenAIError";
  }
}
