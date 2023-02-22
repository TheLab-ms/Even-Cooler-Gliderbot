import { REST } from '@discordjs/rest';
import { Client, ActivityType } from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import { CronJob as Cron } from 'cron';
import { JobCollection } from '../helpers/loadJobs';
import { CommandCollection } from '../helpers/loadCommands';
import EventData from '../interfaces/EventData.interface';

async function setupCommands(bot: Client, commands: CommandCollection) {
  const commandData = Array.from(commands.values()).map((command) => command.data.toJSON());
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);
  await rest.put(
    Routes.applicationGuildCommands(bot.user?.id || 'missing id', process.env.GUILD_ID),
    { body: commandData },
  );
}

async function setupCronJobs(bot: Client, jobs: JobCollection) {
  for (const job of jobs.values()) {
    if (job.onInit) job.run(bot);
    const cronJob = new Cron(job.cron, () => {
      try {
        job.run(bot);
      } catch (error) {
        console.warn(error);
      }
    });
    cronJob.start();
  }
}

export default async (bot: Client, data: EventData) => {
  console.log('Bot is ready!');
  const { commands, jobs } = data;
  bot.user?.setPresence({
    status: 'online',
    activities: [{ name: 'A Game Called Life', type: ActivityType.Playing }],
  });
  await Promise.all([setupCommands(bot, commands), setupCronJobs(bot, jobs)]);
};
