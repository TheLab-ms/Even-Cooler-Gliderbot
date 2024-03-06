import {
  ApplicationCommandType,
  CacheType,
  ContextMenuCommandType,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { Menu } from '../../interfaces/Commands';
import EventData from '../../interfaces/EventData.interface';
import { EmbedBuilder } from '@discordjs/builders';
import env from '../../utils/env';

export class ProfileMenu extends Menu {
  title = 'Profile';

  type = ApplicationCommandType.User as ContextMenuCommandType;

  isEphemeral = true;

  availableInDMs = false;

  async run(interaction: UserContextMenuCommandInteraction<CacheType>, data: EventData) {
    if (interaction.targetUser.bot) {
      await interaction.editReply({
        content: 'This is a bot, it has no profile',
      });
      return;
    }
    const { keycloakClient } = data;
    const user = await keycloakClient.lookupDiscordUserInGroup(
      interaction.targetUser.id,
      env.KEYCLOAK_MEMBERSHIP_GROUP as string,
    );
    if (!user) {
      await interaction.editReply({
        content: 'No profile found',
      });
      return;
    }
    const embed = new EmbedBuilder().setTitle(`${user.firstName} ${user.lastName}`);

    await interaction.editReply({
      embeds: [embed],
    });
  }
}
