export class RunService {
    client;
    logger;
    constructor(client, logger) {
        this.client = client;
        this.logger = logger;
    }
    async listRuns(experimentFilter) {
        const runs = await this.client.listRuns();
        if (experimentFilter) {
            try {
                const regex = new RegExp(experimentFilter);
                return runs.filter(run => regex.test(run.name));
            }
            catch (error) {
                this.logger?.warn('Invalid regex pattern provided', { pattern: experimentFilter });
                // Fall back to simple string matching
                return runs.filter(run => run.name.includes(experimentFilter));
            }
        }
        return runs;
    }
    async getScalars(run, tag) {
        const tags = await this.client.getRunTags(run);
        const scalarTags = Object.keys(tags);
        if (tag) {
            if (!scalarTags.includes(tag)) {
                throw new Error(`Tag "${tag}" not found in run "${run}"`);
            }
            const data = await this.client.getScalars(run, tag);
            return { [tag]: data };
        }
        // Get all scalar tags
        const results = {};
        // Batch requests but limit concurrency to avoid overwhelming TensorBoard
        const batchSize = 5;
        for (let i = 0; i < scalarTags.length; i += batchSize) {
            const batch = scalarTags.slice(i, i + batchSize);
            const promises = batch.map(t => this.client.getScalars(run, t)
                .then(data => ({ tag: t, data }))
                .catch(error => {
                this.logger?.error(`Failed to get scalars for tag ${t}`, error);
                return null;
            }));
            const batchResults = await Promise.all(promises);
            for (const result of batchResults) {
                if (result) {
                    results[result.tag] = result.data;
                }
            }
        }
        return results;
    }
    async compareRuns(runIds, metric) {
        const results = {};
        // Validate all runs exist first
        const allRuns = await this.client.listRuns();
        const runNames = allRuns.map(r => r.name);
        for (const runId of runIds) {
            if (!runNames.includes(runId)) {
                results[runId] = { error: `Run "${runId}" not found` };
                continue;
            }
        }
        // Fetch metric data for each run
        const promises = runIds.map(async (runId) => {
            if (results[runId]?.error)
                return;
            try {
                const scalars = await this.getScalars(runId, metric);
                results[runId] = {
                    data: scalars[metric],
                    summary: this.summarizeScalars(scalars[metric]),
                };
            }
            catch (error) {
                results[runId] = {
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
        await Promise.all(promises);
        // Add comparison summary
        const validResults = Object.entries(results)
            .filter(([_, value]) => !value.error && value.data)
            .map(([runId, value]) => ({ runId, ...value.summary }));
        if (validResults.length > 0) {
            results._summary = {
                best_final_value: validResults.reduce((best, current) => current.final > best.final ? current : best),
                best_min_value: validResults.reduce((best, current) => current.min < best.min ? current : best),
            };
        }
        return results;
    }
    summarizeScalars(data) {
        if (!data || data.length === 0) {
            return { count: 0 };
        }
        const values = data.map(d => d.value);
        return {
            count: data.length,
            final: values[values.length - 1],
            min: Math.min(...values),
            max: Math.max(...values),
            mean: values.reduce((a, b) => a + b, 0) / values.length,
        };
    }
}
//# sourceMappingURL=RunService.js.map