import { z } from 'zod';
import { toolTypes } from '../interfaces/Tool';

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

const genericToolSchema = z.object({
  name: z.string().describe('The name of the tool.'),
  make: z.string().describe('The make of the tool.'),
  model: z.string().describe('The model of the tool.'),
  type: z.enum([...toolTypes]).describe('The type of the tool.'),
  color: z
    .enum([
      'Default',
      'Aqua',
      'DarkAqua',
      'Green',
      'DarkGreen',
      'Blue',
      'DarkBlue',
      'Purple',
      'DarkPurple',
      'LuminousVividPink',
      'DarkVividPink',
      'Gold',
      'DarkGold',
      'Orange',
      'DarkOrange',
      'Red',
      'DarkRed',
      'Grey',
      'DarkGrey',
      'DarkerGrey',
      'LightGrey',
      'Navy',
      'DarkNavy',
      'Yellow',
      'White',
      'Greyple',
      'Black',
      'DarkButNotBlack',
      'NotQuiteBlack',
      'Blurple',
      'Green',
      'Yellow',
      'Fuchsia',
      'Red',
    ])
    .or(z.string().startsWith('#'))
    .describe('The color of the tool.'),
  hasWebcam: z.boolean().default(false).describe('Whether the tool has a webcam.'),
  adapter: z
    .enum(['octoprint', 'prusa-link', 'bambu', 'home-assistant'])
    .describe('The adapter for the tool.'),
  hasRemainingTime: z
    .boolean()
    .default(false)
    .describe('Whether the tool has remaining time sensor.'),
});

export const OctoprintPrinterSchema = genericToolSchema.extend({
  type: z.literal('3D Printer').describe('The type of the tool.'),
  address: z.string().url().describe('The IP address or Hostname of the printer.'),
  apiKey: z.string().describe('The API key for the printer.'),
  hasRemainingTime: z
    .boolean()
    .default(true)
    .describe('Whether the tool has remaining time sensor.'),
});

export type OctoprintPrinterConfig = z.infer<typeof OctoprintPrinterSchema>;

export const BambuPrinterSchema = genericToolSchema.extend({
  homeAssistantEntity: z
    .string()
    .describe(
      'The entity id of the printer in Home Assistant. Example: sensor.ender_3_pro_print_state',
    )
    .startsWith('sensor.'),
  homeAssistantCameraEntity: z
    .string()
    .optional()
    .describe('The entity id of the camera in Home Assistant.'),
  homeAssistantFinishTimeEntity: z
    .string()
    .optional()
    .describe('The entity id of the remaining time.'),
  hasRemainingTime: z
    .boolean()
    .default(true)
    .describe('Whether the tool has remaining time sensor.'),
  type: z.literal('3D Printer').describe('The type of the tool.'),
  make: z.literal('Bambu Labs').describe('The make of the tool.'),
  model: z.string().describe('The model of the tool.'),
});

export type BambuPrinterConfig = z.infer<typeof BambuPrinterSchema>;

export const PrusaLinkPrinterSchema = genericToolSchema.extend({
  type: z.literal('3D Printer').describe('The type of the tool.'),
  make: z.literal('Prusa').describe('The make of the tool.'),
  model: z
    .enum([
      'i3 MK2.5',
      'i3 MK2.5S',
      'i3 MK3',
      'i3 MK3S',
      'i3 MK3S+',
      'MK3.5',
      'MK3.9',
      'MK4',
      'Mini',
      'Mini+',
      'XL',
    ])
    .describe('The model of the tool.'),
  address: z.string().url().describe('The IP address or Hostname of the printer.'),
  apiKey: z.string().describe('The API key for the printer.'),
  hasRemainingTime: z
    .boolean()
    .default(true)
    .describe('Whether the tool has remaining time sensor.'),
});

export type PrusaLinkPrinterConfig = z.infer<typeof PrusaLinkPrinterSchema>;

const toolSchema = z.union([OctoprintPrinterSchema, BambuPrinterSchema, PrusaLinkPrinterSchema]);

const configSchema = z.object({
  autoResponse: z.array(autoResponseSchema).optional().describe('List of auto responses.'),
  status: statusSchema
    .optional()
    .default({ type: 'watching', message: 'you' })
    .describe('The bot status message.'),
  tools: z.array(toolSchema).default([]).describe('List of tools.'),
  forceKeycloakName: z.boolean().default(false),
});

export default configSchema;
