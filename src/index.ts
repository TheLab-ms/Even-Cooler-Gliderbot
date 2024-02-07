import dotenv from 'dotenv';
dotenv.config();
import { Client, Interaction, Message, Partials, GuildMember } from 'discord.js';

import onReady from './events/onReady';
import loadCommands from './helpers/loadCommands';
import onInteractionCreate from './events/onInteractionCreate';
import onMessage from './events/onMessage';
import loadJobs from './helpers/loadJobs';
import EventData from './interfaces/EventData.interface';
import loadMenus from './helpers/loadMenus';

import onJoin from './events/onJoin';
import { Keycloak } from './lib/keycloak';
import config from './utils/config';

const { DISCORD_TOKEN } = process.env;

const keycloakClient = new Keycloak({
  url: process.env.KEYCLOAK_URL || '',
  realm: process.env.KEYCLOAK_REALM || '',
  user: process.env.KEYCLOAK_USER || '',
  password: process.env.KEYCLOAK_PASSWORD || '',
});

(async () => {
  const bot = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'GuildMessageReactions', 'MessageContent'],
    partials: [Partials.Reaction],
  });
  const [commands, jobs, menus] = await Promise.all([loadCommands(), loadJobs(), loadMenus()]);
  const data: EventData = { commands, jobs, config, menus, keycloakClient };
  bot.on('ready', () => onReady(bot, data));
  bot.on('interactionCreate', (interaction: Interaction) => {
    onInteractionCreate(interaction, data);
  });
  bot.on('messageCreate', (message: Message) => onMessage(message, data));
  bot.on('guildMemberAdd', (member: GuildMember) => onJoin(bot, member, data));
  bot.login(DISCORD_TOKEN);
})();
