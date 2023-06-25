import {
  ApplicationCommandType,
  CacheType,
  ContextMenuCommandType,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { Menu } from '../../interfaces/Commands';

export class ProfileMenu extends Menu {
  title = 'Profile';
  type = ApplicationCommandType.User as ContextMenuCommandType;
  isEphemeral = true;
  availableInDMs = false;

  async run(interaction: UserContextMenuCommandInteraction<CacheType>) {
    await interaction.editReply({
      content: `Profile menu for ${interaction.targetUser.username}`,
    });
  }
}
