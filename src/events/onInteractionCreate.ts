import { Interaction, CacheType, UserContextMenuCommandInteraction } from 'discord.js';
import EventData from '../interfaces/EventData.interface';

export default async function onInteractionCreate(
  interaction: Interaction<CacheType>,
  data: EventData,
) {
  if (interaction.isContextMenuCommand()) {
    const { menus } = data;
    const menu = menus.get(interaction.commandName);
    if (!menu) return;
    try {
      await interaction.deferReply({ ephemeral: menu.isEphemeral });
      await menu.run(interaction as UserContextMenuCommandInteraction<CacheType>);
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: 'There was an error while executing this command!',
      });
    }
  }

  if (interaction.isCommand()) {
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
    return;
  }

  if (interaction.isButton()) {
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({
      content: 'This button has not been implemented yet!',
    });
    return;
  }
}
