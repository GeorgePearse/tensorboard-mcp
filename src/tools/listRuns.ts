import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RunService } from '../services/RunService.js';
import { ListRunsSchema } from '../validation/schemas.js';
import { z } from 'zod';

export const createListRunsTool = (runService: RunService): Tool => ({
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

export const handleListRuns = async (
  args: unknown,
  runService: RunService
): Promise<any> => {
  // Validate input
  const validated = ListRunsSchema.parse(args || {});

  const runs = await runService.listRuns(validated.experiment);

  return {
    content: [
      {
        type: 'text',
        text:
          runs.length > 0
            ? `Found ${runs.length} runs:\n${runs.map((r) => r.name).join('\n')}`
            : 'No runs found',
      },
    ],
    isError: false,
  };
};
