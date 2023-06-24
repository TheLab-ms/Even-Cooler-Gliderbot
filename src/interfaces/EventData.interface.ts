import { z } from 'zod';
import { Collection } from 'discord.js';
import configSchema from '../schemas/config';
import { CronJob } from './Job.interface';
import { Command } from '../lib/command';

export default interface EventData {
  commands: Collection<string, Command>;
  jobs: Collection<string, CronJob>;
  config: z.infer<typeof configSchema>;
}
