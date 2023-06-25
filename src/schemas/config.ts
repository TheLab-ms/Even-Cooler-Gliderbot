import { z } from 'zod';

const autoResponseSchema = z.object({
  phrases: z.array(z.string()).describe("List of phrases that will trigger the bot's response."),
  responses: z
    .array(z.string())
    .optional()
    .describe('List of responses that the bot will randomly choose from.'),
  reaction: z.string().optional().describe('Emoji that the bot will react with.'),
});

const statusSchema = z.object({
  type: z
    .enum(['playing', 'streaming', 'listening', 'watching', 'competing'])
    .describe("The bot's status type."),
  message: z.string().describe("The bot's status message."),
});

const printerSchema = z.object({
  name: z.string().describe('The name of the printer.'),
  address: z.string().url().describe('The IP address or Hostname of the printer.'),
  apiKey: z.string().describe('The API key for the printer.'),
  hasWebcam: z.boolean().default(true).optional().describe('Whether the printer has a webcam.'),
  make: z.string().optional().describe('The make of the printer.'),
  model: z.string().optional().describe('The model of the printer.'),
  color: z.string().optional().describe('The color of the printer.'),
});

const configSchema = z.object({
  autoResponse: z.array(autoResponseSchema).optional().describe('List of auto responses.'),
  status: statusSchema
    .optional()
    .default({ type: 'watching', message: 'you' })
    .describe('The bot status message.'),
  printers: z.array(printerSchema).optional().default([]).describe('List of printers.'),
});

export default configSchema;
