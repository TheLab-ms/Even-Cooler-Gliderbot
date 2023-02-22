import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Client, Interaction, Message, Partials } from 'discord.js';

import onReady from './events/onReady';
import loadCommands from './helpers/loadCommands';
import onInteractionCreate from './events/onInteractionCreate';
import onMessage from './events/onMessage';
import loadJobs from './helpers/loadJobs';
import EventData from './interfaces/EventData.interface';
import configSchema from './schemas/config';

dotenv.config();
const { DISCORD_TOKEN } = process.env;

const configInput = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));

(async () => {
  const bot = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'GuildMessageReactions', 'MessageContent'],
    partials: [Partials.Reaction],
  });
  const [commands, jobs] = await Promise.all([loadCommands(), loadJobs()]);
  const config = configSchema.parse(configInput);
  const data: EventData = { commands, jobs, config };
  bot.on('ready', () => onReady(bot, data));
  bot.on('interactionCreate', (interaction: Interaction) => {
    onInteractionCreate(interaction, data);
  });
  bot.on('messageCreate', (message: Message) => onMessage(message, data));
  bot.login(DISCORD_TOKEN);
})();
