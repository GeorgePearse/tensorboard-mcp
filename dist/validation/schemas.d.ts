import { z } from 'zod';
export declare const ListRunsSchema: z.ZodObject<{
    experiment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    experiment?: string | undefined;
}, {
    experiment?: string | undefined;
}>;
export declare const GetScalarsSchema: z.ZodObject<{
    run: z.ZodString;
    tag: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    run: string;
    tag?: string | undefined;
}, {
    run: string;
    tag?: string | undefined;
}>;
export declare const GetHistogramsSchema: z.ZodObject<{
    run: z.ZodString;
    tag: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    run: string;
    tag?: string | undefined;
}, {
    run: string;
    tag?: string | undefined;
}>;
export declare const GetImagesSchema: z.ZodObject<{
    run: z.ZodString;
    tag: z.ZodOptional<z.ZodString>;
    sample: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    run: string;
    tag?: string | undefined;
    sample?: number | undefined;
}, {
    run: string;
    tag?: string | undefined;
    sample?: number | undefined;
}>;
export declare const GetTextSchema: z.ZodObject<{
    run: z.ZodString;
    tag: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    run: string;
    tag?: string | undefined;
}, {
    run: string;
    tag?: string | undefined;
}>;
export declare const CompareRunsSchema: z.ZodObject<{
    runs: z.ZodArray<z.ZodString, "many">;
    metric: z.ZodString;
}, "strip", z.ZodTypeAny, {
    runs: string[];
    metric: string;
}, {
    runs: string[];
    metric: string;
}>;
export type ListRunsInput = z.infer<typeof ListRunsSchema>;
export type GetScalarsInput = z.infer<typeof GetScalarsSchema>;
export type GetHistogramsInput = z.infer<typeof GetHistogramsSchema>;
export type GetImagesInput = z.infer<typeof GetImagesSchema>;
export type GetTextInput = z.infer<typeof GetTextSchema>;
export type CompareRunsInput = z.infer<typeof CompareRunsSchema>;
//# sourceMappingURL=schemas.d.ts.map