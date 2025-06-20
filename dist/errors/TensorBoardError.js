import { ErrorCode } from '../types/index.js';
export class TensorBoardError extends Error {
    code;
    statusCode;
    details;
    constructor(message, code, statusCode, details) {
        super(message);
        this.name = 'TensorBoardError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
    static connectionFailed(url, error) {
        return new TensorBoardError(`Failed to connect to TensorBoard at ${url}`, ErrorCode.CONNECTION_FAILED, undefined, error);
    }
    static runNotFound(run) {
        return new TensorBoardError(`Run "${run}" not found`, ErrorCode.RUN_NOT_FOUND, 404);
    }
    static tagNotFound(tag, run) {
        return new TensorBoardError(`Tag "${tag}" not found in run "${run}"`, ErrorCode.TAG_NOT_FOUND, 404);
    }
    static invalidInput(message) {
        return new TensorBoardError(message, ErrorCode.INVALID_INPUT, 400);
    }
    static timeout(operation) {
        return new TensorBoardError(`Operation "${operation}" timed out`, ErrorCode.TIMEOUT, 408);
    }
}
//# sourceMappingURL=TensorBoardError.js.map