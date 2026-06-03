export class ApiError extends Error {
  readonly status?: number;
  readonly code?: number;

  constructor(message: string, options?: { status?: number; code?: number }) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.code = options?.code;
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}
