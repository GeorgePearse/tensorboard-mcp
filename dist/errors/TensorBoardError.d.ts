import { ErrorCode } from '../types/index.js';
export declare class TensorBoardError extends Error {
    code: ErrorCode;
    statusCode?: number;
    details?: any;
    constructor(message: string, code: ErrorCode, statusCode?: number, details?: any);
    static connectionFailed(url: string, error: any): TensorBoardError;
    static runNotFound(run: string): TensorBoardError;
    static tagNotFound(tag: string, run: string): TensorBoardError;
    static invalidInput(message: string): TensorBoardError;
    static timeout(operation: string): TensorBoardError;
}
//# sourceMappingURL=TensorBoardError.d.ts.map