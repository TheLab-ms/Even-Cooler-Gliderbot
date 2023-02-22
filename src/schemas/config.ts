import { z } from 'zod';

const autoResponseSchema = z.object({
  phrases: z.array(z.string()),
  responses: z.array(z.string()).optional(),
  reaction: z.string().optional(),
});

const statusSchema = z.object({
  type: z.enum(['playing', 'streaming', 'listening', 'watching', 'competing']),
  message: z.string(),
});

const configSchema = z.object({
  autoResponse: z.array(autoResponseSchema),
  status: statusSchema,
});

export default configSchema;
