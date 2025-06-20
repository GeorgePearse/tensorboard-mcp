import { z } from 'zod';
// Common schemas
const RunIdSchema = z.string().min(1).regex(/^[a-zA-Z0-9_\-./]+$/, {
    message: 'Run ID must contain only alphanumeric characters, underscores, hyphens, dots, and slashes',
});
const TagSchema = z.string().min(1);
// Tool input schemas
export const ListRunsSchema = z.object({
    experiment: z.string().optional(),
});
export const GetScalarsSchema = z.object({
    run: RunIdSchema,
    tag: TagSchema.optional(),
});
export const GetHistogramsSchema = z.object({
    run: RunIdSchema,
    tag: TagSchema.optional(),
});
export const GetImagesSchema = z.object({
    run: RunIdSchema,
    tag: TagSchema.optional(),
    sample: z.number().int().min(0).default(0).optional(),
});
export const GetTextSchema = z.object({
    run: RunIdSchema,
    tag: TagSchema.optional(),
});
export const CompareRunsSchema = z.object({
    runs: z.array(RunIdSchema).min(2).max(10),
    metric: TagSchema,
});
//# sourceMappingURL=schemas.js.map