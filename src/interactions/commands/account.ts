import { CommandInteraction } from 'discord.js';

import { giveMemberNickName, giveMemberRoleViaInteraction } from '../../utils/discord';
import { Command } from '../../interfaces/Commands';
import EventData from '../../interfaces/EventData.interface';

export class Account extends Command {
  title = 'account';
  description = 'Sync your membership status';
  isEphemeral = true;
  options = [];
  async run(interaction: CommandInteraction, data: EventData) {
    const { keycloakClient } = data;
    const member = await keycloakClient.lookupDiscordUserInGroup(
      interaction.user.id,
      process.env.KEYCLOAK_MEMBERSHIP_GROUP,
    );
    if (!member) {
      await interaction.editReply({
        content: 'You are not a member of TheLab.ms',
      });
      return;
    }
    const [addedMemberRole] = await giveMemberRoleViaInteraction(
      interaction,
      process.env.DISCORD_MEMBERSHIP_ROLE,
    );
    try {
      if (data.config.forceKeycloakName) {
        const newNickName = `${member.firstName} ${member.lastName}`;
        giveMemberNickName(
          interaction.client,
          interaction.user.id,
          interaction.guild?.id || '',
          newNickName,
        );
      }
    } catch (error) {
      console.error('Failed to set nickname for user');
    }
    if (!addedMemberRole) {
      await interaction.editReply({
        content: 'An error occurred while adding your membership role. Please contact an admin.',
      });
      return;
    }

    const leadership = await keycloakClient.lookupDiscordUserInGroup(
      interaction.user.id,
      process.env.KEYCLOAK_LEADERSHIP_GROUP,
    );
    if (!leadership) {
      await interaction.editReply({
        content: 'You have been verified as a member of TheLab.ms. Welcome!',
      });
      return;
    }
    const [addedLeadershipRole] = await giveMemberRoleViaInteraction(
      interaction,
      process.env.DISCORD_LEADERSHIP_ROLE,
    );
    if (!addedLeadershipRole) {
      await interaction.editReply({
        content: 'An error occurred while adding your leadership role. Please contact an admin.',
      });
      return;
    }
    await interaction.editReply({
      content: 'You have been verified as a member and leadership of TheLab.ms. Welcome!',
    });
  }
}
