import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default interface Command {
  title: string;
  description: string;
  isEphemeral: boolean;
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  permissions?: Array<string>;
  run: (interaction: CommandInteraction) => Promise<void>;
}
