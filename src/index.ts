#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { loadConfig } from './config/index.js';
import { createLogger } from './utils/logger.js';
import { TensorBoardClient } from './api/TensorBoardClient.js';
import { RunService } from './services/RunService.js';
import { TensorBoardError } from './errors/TensorBoardError.js';
import {
  createListRunsTool,
  handleListRuns,
  createGetScalarsTool,
  handleGetScalars,
  createCompareRunsTool,
  handleCompareRuns,
} from './tools/index.js';

// Initialize configuration and logger
const config = loadConfig();
const logger = createLogger('tensorboard-mcp');

// Initialize services
const tensorboardClient = new TensorBoardClient(config.tensorboardUrl, logger);
const runService = new RunService(tensorboardClient, logger);

// Create server instance
const server = new Server(
  {
    name: 'tensorboard-mcp',
    version: '0.2.0',
  },
  {
    capabilities: {
      tools: {},
      logging: {},
    },
  }
);

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    createListRunsTool(runService),
    createGetScalarsTool(),
    createCompareRunsTool(),
    // TODO: Add more tools
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    logger.debug('Tool called', { tool: name, args });

    switch (name) {
      case 'list-runs':
        return await handleListRuns(args, runService);

      case 'get-scalars':
        return await handleGetScalars(args, runService);

      case 'compare-runs':
        return await handleCompareRuns(args, runService);

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    logger.error('Tool execution failed', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        content: [
          {
            type: 'text',
            text: `Invalid input: ${error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          },
        ],
        isError: true,
      };
    }

    // Handle TensorBoard errors
    if (error instanceof TensorBoardError) {
      return {
        content: [
          {
            type: 'text',
            text: error.message,
          },
        ],
        isError: true,
      };
    }

    // Handle other errors
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Server startup
async function main() {
  try {
    logger.info('Starting TensorBoard MCP Server', {
      tensorboardUrl: config.tensorboardUrl,
      nodeEnv: config.nodeEnv,
    });

    // Test connection to TensorBoard
    try {
      await tensorboardClient.listRuns();
      logger.info('Successfully connected to TensorBoard');
    } catch (error) {
      logger.warn('Could not connect to TensorBoard on startup', error);
      logger.warn(
        'Server will continue running, but TensorBoard must be available when tools are used'
      );
    }

    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info('TensorBoard MCP Server running on stdio');
  } catch (error) {
    logger.error('Fatal error running server', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch((error) => {
  logger.error('Fatal error in main()', error);
  process.exit(1);
});
