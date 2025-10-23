import { z } from 'zod';

export const BulkDeleteRequestSchema = z.object({
  ids: z.array(z.string()).min(1)
});

export type BulkDeleteRequestSchema = z.infer<typeof BulkDeleteRequestSchema>;
