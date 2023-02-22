import { Client } from 'discord.js';
import { CronJob } from '../interfaces/Job.interface';

const Job: CronJob = {
  name: 'test',
  onInit: true,
  cron: '*/30 */5 * * * *',
  run: async (bot: Client) => {
    console.log('Application', bot.application.id, 'says hello!');
  },
};

export default Job;
