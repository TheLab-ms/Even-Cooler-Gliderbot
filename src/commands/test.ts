import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import ICommand from '../interfaces/Command.interface';

const Command: ICommand = {
  title: 'Test',
  description: 'Test command',
  isEphemeral: false,
  data: new SlashCommandBuilder().setName('test').setDescription('Test command'),
  run: async (interaction: CommandInteraction) => {
    await interaction.reply('Test');
  },
};

export default Command;
