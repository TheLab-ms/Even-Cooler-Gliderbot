import { Client } from 'discord.js';

export default interface Job {
  name: string;
  onInit: boolean;
  run: (bot: Client) => Promise<void>;
}

export interface CronJob extends Job {
  cron: string;
}
