export interface ScalarData {
    wall_time: number;
    step: number;
    value: number;
}
export interface HistogramData {
    wall_time: number;
    step: number;
    min: number;
    max: number;
    num: number;
    sum: number;
    sum_squares: number;
    bucket_limit: number[];
    bucket: number[];
}
export interface Run {
    name: string;
    tags?: Record<string, string[]>;
}
export interface TensorBoardError extends Error {
    code: ErrorCode;
    statusCode?: number;
    details?: any;
}
export declare enum ErrorCode {
    CONNECTION_FAILED = "CONNECTION_FAILED",
    RUN_NOT_FOUND = "RUN_NOT_FOUND",
    TAG_NOT_FOUND = "TAG_NOT_FOUND",
    INVALID_INPUT = "INVALID_INPUT",
    TIMEOUT = "TIMEOUT",
    UNKNOWN = "UNKNOWN"
}
//# sourceMappingURL=index.d.ts.map