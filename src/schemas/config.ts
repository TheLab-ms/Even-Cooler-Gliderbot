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

const printerSchema = z.object({
  name: z.string(),
  address: z.string().url(),
  apiKey: z.string(),
  hasWebcam: z.boolean().default(true).optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
});

const configSchema = z.object({
  autoResponse: z.array(autoResponseSchema).optional(),
  status: statusSchema.optional().default({ type: 'watching', message: 'you' }),
  printers: z.array(printerSchema).optional().default([]),
});

export default configSchema;
