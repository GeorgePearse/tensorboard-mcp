import axios from 'axios';
import { ErrorCode } from '../types/index.js';
import { TensorBoardError } from '../errors/TensorBoardError.js';
export class TensorBoardClient {
    client;
    logger;
    constructor(baseURL, logger) {
        this.logger = logger;
        this.client = axios.create({
            baseURL,
            timeout: 30000, // 30 seconds
            headers: {
                'Accept': 'application/json',
            },
        });
        // Add request/response interceptors for logging and retry
        this.setupInterceptors();
    }
    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use((config) => {
            this.logger?.debug('TensorBoard API request', {
                method: config.method,
                url: config.url,
                params: config.params,
            });
            return config;
        }, (error) => {
            this.logger?.error('TensorBoard API request error', error);
            return Promise.reject(error);
        });
        // Response interceptor with retry logic
        this.client.interceptors.response.use((response) => {
            this.logger?.debug('TensorBoard API response', {
                status: response.status,
                url: response.config.url,
            });
            return response;
        }, async (error) => {
            const config = error.config;
            // Retry on 5xx errors
            if (error.response?.status && error.response.status >= 500 && config) {
                this.logger?.warn('Retrying TensorBoard API request', {
                    status: error.response.status,
                    url: config.url,
                });
                // Wait 1 second before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.client.request(config);
            }
            // Handle specific error cases
            if (error.code === 'ECONNREFUSED') {
                throw TensorBoardError.connectionFailed(config?.baseURL || '', error);
            }
            if (error.code === 'ECONNABORTED') {
                throw TensorBoardError.timeout(config?.url || 'unknown');
            }
            return Promise.reject(error);
        });
    }
    async listRuns() {
        try {
            const response = await this.client.get('/data/runs');
            return response.data.map(name => ({ name }));
        }
        catch (error) {
            this.handleError(error, 'listRuns');
            throw error; // TypeScript needs this
        }
    }
    async getRunTags(run) {
        try {
            const response = await this.client.get('/data/plugin/scalars/tags', {
                params: { run },
            });
            return response.data[run] || {};
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                throw TensorBoardError.runNotFound(run);
            }
            this.handleError(error, 'getRunTags');
            throw error;
        }
    }
    async getScalars(run, tag) {
        try {
            const response = await this.client.get('/data/plugin/scalars/scalars', {
                params: { run, tag },
            });
            return response.data;
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                throw TensorBoardError.tagNotFound(tag, run);
            }
            this.handleError(error, 'getScalars');
            throw error;
        }
    }
    async getHistogramTags(run) {
        try {
            const response = await this.client.get('/data/plugin/histograms/tags', {
                params: { run },
            });
            return response.data[run] || {};
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                throw TensorBoardError.runNotFound(run);
            }
            this.handleError(error, 'getHistogramTags');
            throw error;
        }
    }
    async getHistograms(run, tag) {
        try {
            const response = await this.client.get('/data/plugin/histograms/histograms', {
                params: { run, tag },
            });
            return response.data;
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                throw TensorBoardError.tagNotFound(tag, run);
            }
            this.handleError(error, 'getHistograms');
            throw error;
        }
    }
    handleError(error, operation) {
        this.logger?.error(`TensorBoard API error in ${operation}`, error);
        if (error instanceof TensorBoardError) {
            throw error;
        }
        if (axios.isAxiosError(error)) {
            throw new TensorBoardError(error.message, ErrorCode.UNKNOWN, error.response?.status, error.response?.data);
        }
        throw new TensorBoardError(`Unknown error in ${operation}`, ErrorCode.UNKNOWN, undefined, error);
    }
}
//# sourceMappingURL=TensorBoardClient.js.map