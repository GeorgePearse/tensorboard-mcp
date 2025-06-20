import { TensorBoardClient } from '../api/TensorBoardClient.js';
import { Run, ScalarData } from '../types/index.js';
import { Logger } from 'winston';
export declare class RunService {
    private client;
    private logger?;
    constructor(client: TensorBoardClient, logger?: Logger | undefined);
    listRuns(experimentFilter?: string): Promise<Run[]>;
    getScalars(run: string, tag?: string): Promise<Record<string, ScalarData[]>>;
    compareRuns(runIds: string[], metric: string): Promise<Record<string, any>>;
    private summarizeScalars;
}
//# sourceMappingURL=RunService.d.ts.map