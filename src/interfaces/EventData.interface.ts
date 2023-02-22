import { z } from 'zod';
import { Collection } from 'discord.js';
import configSchema from '../schemas/config';
import Command from './Command.interface';
import { CronJob } from './Job.interface';

export default interface EventData {
  commands: Collection<string, Command>;
  jobs: Collection<string, CronJob>;
  config: z.infer<typeof configSchema>;
}
