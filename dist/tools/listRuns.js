import { ListRunsSchema } from '../validation/schemas.js';
export const createListRunsTool = (runService) => ({
    name: 'list-runs',
    description: 'List all available TensorBoard runs/experiments',
    inputSchema: {
        type: 'object',
        properties: {
            experiment: {
                type: 'string',
                description: 'Optional: Filter by experiment name or regex pattern',
            },
        },
        required: [],
    },
});
export const handleListRuns = async (args, runService) => {
    // Validate input
    const validated = ListRunsSchema.parse(args || {});
    const runs = await runService.listRuns(validated.experiment);
    return {
        content: [
            {
                type: 'text',
                text: runs.length > 0
                    ? `Found ${runs.length} runs:\n${runs.map(r => r.name).join('\n')}`
                    : 'No runs found',
            },
        ],
        isError: false,
    };
};
//# sourceMappingURL=listRuns.js.map