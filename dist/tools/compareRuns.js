import { CompareRunsSchema } from '../validation/schemas.js';
export const createCompareRunsTool = () => ({
    name: 'compare-runs',
    description: 'Compare metrics across multiple runs',
    inputSchema: {
        type: 'object',
        properties: {
            runs: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of run IDs to compare',
            },
            metric: {
                type: 'string',
                description: 'The metric/tag to compare (e.g., "loss", "accuracy")',
            },
        },
        required: ['runs', 'metric'],
    },
});
export const handleCompareRuns = async (args, runService) => {
    // Validate input
    const validated = CompareRunsSchema.parse(args);
    const comparison = await runService.compareRuns(validated.runs, validated.metric);
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(comparison, null, 2),
            },
        ],
        isError: false,
    };
};
//# sourceMappingURL=compareRuns.js.map