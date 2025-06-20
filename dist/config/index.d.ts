import { z } from 'zod';
declare const ConfigSchema: z.ZodObject<{
    tensorboardUrl: z.ZodDefault<z.ZodString>;
    logLevel: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "debug"]>>;
    nodeEnv: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
}, "strip", z.ZodTypeAny, {
    tensorboardUrl: string;
    logLevel: "error" | "warn" | "info" | "debug";
    nodeEnv: "development" | "production" | "test";
}, {
    tensorboardUrl?: string | undefined;
    logLevel?: "error" | "warn" | "info" | "debug" | undefined;
    nodeEnv?: "development" | "production" | "test" | undefined;
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare const loadConfig: () => Config;
export {};
//# sourceMappingURL=index.d.ts.map