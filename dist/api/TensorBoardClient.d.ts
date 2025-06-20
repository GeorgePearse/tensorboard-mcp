import { Run, ScalarData, HistogramData } from '../types/index.js';
import { Logger } from 'winston';
export declare class TensorBoardClient {
    private client;
    private logger?;
    constructor(baseURL: string, logger?: Logger);
    private setupInterceptors;
    listRuns(): Promise<Run[]>;
    getRunTags(run: string): Promise<Record<string, string[]>>;
    getScalars(run: string, tag: string): Promise<ScalarData[]>;
    getHistogramTags(run: string): Promise<Record<string, string[]>>;
    getHistograms(run: string, tag: string): Promise<HistogramData[]>;
    private handleError;
}
//# sourceMappingURL=TensorBoardClient.d.ts.map