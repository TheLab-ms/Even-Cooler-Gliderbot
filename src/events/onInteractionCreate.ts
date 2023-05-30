import { Interaction, CacheType } from 'discord.js';
import EventData from '../interfaces/EventData.interface';

export default async function onInteractionCreate(
  interaction: Interaction<CacheType>,
  data: EventData,
) {
  if (!interaction.isCommand()) return;
  const { commands } = data;
  const command = commands.get(interaction.commandName);
  if (!command) return;
  try {
    await interaction.deferReply({ ephemeral: command.isEphemeral });
    await command.run(interaction);
  } catch (error) {
    console.error(error);
    await interaction.editReply({
      content: 'There was an error while executing this command!',
    });
  }
}
