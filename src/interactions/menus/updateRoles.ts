import {
  Application,
  ApplicationCommandType,
  CacheType,
  ContextMenuCommandType,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { Menu } from '../../interfaces/Commands';
import syncRoles from '../../lib/shared/syncRoles';
import EventData from '../../interfaces/EventData.interface';

export class UpdateRoles extends Menu {
  title = 'Update Roles';
  type = ApplicationCommandType.User as ContextMenuCommandType;
  isEphemeral = true;
  availableInDMs = false;

  async run(interaction: UserContextMenuCommandInteraction<CacheType>, data: EventData) {
    if (!interaction.targetId || !interaction.guildId) {
      await interaction.editReply({
        content: 'Something went wrong, please try again later',
      });
      return;
    }
    const message = await syncRoles(
      interaction.client,
      interaction.targetUser.id,
      interaction.guildId,
      data,
    );
    await interaction.editReply({
      content: message,
    });
  }
}
