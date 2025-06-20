import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const ConfigSchema = z.object({
  tensorboardUrl: z.string().url().default('http://localhost:6006'),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
});

export type Config = z.infer<typeof ConfigSchema>;

export const loadConfig = (): Config => {
  try {
    return ConfigSchema.parse({
      tensorboardUrl: process.env.TENSORBOARD_URL,
      logLevel: process.env.LOG_LEVEL,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation failed:', error.errors);
      process.exit(1);
    }
    throw error;
  }
};