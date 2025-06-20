import { ErrorCode } from '../types/index.js';

export class TensorBoardError extends Error {
  public code: ErrorCode;
  public statusCode?: number;
  public details?: any;

  constructor(message: string, code: ErrorCode, statusCode?: number, details?: any) {
    super(message);
    this.name = 'TensorBoardError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  static connectionFailed(url: string, error: any): TensorBoardError {
    return new TensorBoardError(
      `Failed to connect to TensorBoard at ${url}`,
      ErrorCode.CONNECTION_FAILED,
      undefined,
      error
    );
  }

  static runNotFound(run: string): TensorBoardError {
    return new TensorBoardError(
      `Run "${run}" not found`,
      ErrorCode.RUN_NOT_FOUND,
      404
    );
  }

  static tagNotFound(tag: string, run: string): TensorBoardError {
    return new TensorBoardError(
      `Tag "${tag}" not found in run "${run}"`,
      ErrorCode.TAG_NOT_FOUND,
      404
    );
  }

  static invalidInput(message: string): TensorBoardError {
    return new TensorBoardError(
      message,
      ErrorCode.INVALID_INPUT,
      400
    );
  }

  static timeout(operation: string): TensorBoardError {
    return new TensorBoardError(
      `Operation "${operation}" timed out`,
      ErrorCode.TIMEOUT,
      408
    );
  }
}