import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RunService } from '../services/RunService.js';
import { GetScalarsSchema } from '../validation/schemas.js';

export const createGetScalarsTool = (): Tool => ({
  name: 'get-scalars',
  description:
    'Retrieve scalar metrics (loss, accuracy, etc.) for a specific run',
  inputSchema: {
    type: 'object',
    properties: {
      run: {
        type: 'string',
        description: 'The run ID or path',
      },
      tag: {
        type: 'string',
        description:
          'Optional: Specific tag/metric name (e.g., "loss", "accuracy"). If not provided, returns all scalar tags.',
      },
    },
    required: ['run'],
  },
});

export const handleGetScalars = async (
  args: unknown,
  runService: RunService
): Promise<any> => {
  // Validate input
  const validated = GetScalarsSchema.parse(args);

  const scalars = await runService.getScalars(validated.run, validated.tag);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(scalars, null, 2),
      },
    ],
    isError: false,
  };
};
