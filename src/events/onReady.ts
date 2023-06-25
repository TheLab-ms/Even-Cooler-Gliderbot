import { REST } from '@discordjs/rest';
import {
  Client,
  ActivityType,
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  Collection,
} from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import { CronJob as Cron } from 'cron';
import { JobCollection } from '../helpers/loadJobs';
import { CommandCollection } from '../helpers/loadCommands';
import EventData from '../interfaces/EventData.interface';
import { MenuCollection } from '../helpers/loadMenus';
import { Command, Menu } from '../interfaces/Commands';

type GenericCommand = Command | Menu;
type GenericCommandCollection = Collection<string, GenericCommand>;

function isMenu(arg: GenericCommand) {
  return (arg as Menu).type !== undefined;
}

async function setupCommands(bot: Client, commands: CommandCollection, menus: MenuCollection) {
  // Add commands and menus here
  const genericCommandCollection: GenericCommandCollection = new Collection();
  commands.forEach((command) => genericCommandCollection.set(command.title, command));
  menus.forEach((menu) => genericCommandCollection.set(menu.title, menu));
  const commandData = genericCommandCollection.map((genericCommand: Command | Menu) => {
    if (isMenu(genericCommand)) {
      const menu = genericCommand as Menu;
      return new ContextMenuCommandBuilder()
        .setName(menu.title)
        .setType(menu.type)
        .setDMPermission(menu.availableInDMs)
        .toJSON();
    }
    const command = genericCommand as Command;
    const builder = new SlashCommandBuilder()
      .setName(command.title)
      .setDescription(command.description);
    if (command.options) {
      command.options.forEach((commandOption) => {
        switch (commandOption.type) {
          case 'STRING':
            builder.addStringOption((option) =>
              option
                .setName(commandOption.name)
                .setDescription(commandOption.description)
                .setRequired(commandOption.required)
                .addChoices(
                  ...(commandOption.choices?.map((choice) => ({
                    name: choice.name,
                    value: choice.value,
                  })) || []),
                ),
            );
            break;
        }
      });
    }
    return builder.toJSON();
  });
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
  const { commands, jobs, menus } = data;
  bot.user?.setPresence({
    status: 'online',
    activities: [{ name: 'A Game Called Life', type: ActivityType.Playing }],
  });
  await Promise.all([setupCommands(bot, commands, menus), setupCronJobs(bot, jobs)]);
};
