import { z } from 'zod';
import { Collection } from 'discord.js';
import configSchema from '../schemas/config';
import { CronJob } from './Job.interface';
import { Command, Menu } from './Commands';
import { Keycloak } from '../lib/keycloak';

export default interface EventData {
  commands: Collection<string, Command>;
  jobs: Collection<string, CronJob>;
  menus: Collection<string, Menu>;
  config: z.infer<typeof configSchema>;
  keycloakClient: Keycloak;
}
