import { CommandInteraction } from 'discord.js';

import { giveMemberNickName, giveMemberRoleViaInteraction } from '../../utils/discord';
import { Command } from '../../interfaces/Commands';
import EventData from '../../interfaces/EventData.interface';
import env from '../../utils/env';

const { KEYCLOAK_LEADERSHIP_GROUP, KEYCLOAK_MEMBERSHIP_GROUP, DISCORD_MEMBERSHIP_ROLE, DISCORD_LEADERSHIP_ROLE } = env;

export class Account extends Command {
  title = 'account';
  description = 'Sync your membership status';
  isEphemeral = true;
  options = [];

  async run(interaction: CommandInteraction, data: EventData) {
    if (!KEYCLOAK_LEADERSHIP_GROUP || !KEYCLOAK_MEMBERSHIP_GROUP || !DISCORD_MEMBERSHIP_ROLE || !DISCORD_LEADERSHIP_ROLE) {
      return;
    }

    const { keycloakClient } = data;
    const member = await keycloakClient.lookupDiscordUserInGroup(
      interaction.user.id,
      KEYCLOAK_MEMBERSHIP_GROUP,
    );
    if (!member) {
      await interaction.editReply({
        content: 'You are not a member of TheLab.ms',
      });
      return;
    }
    const [addedMemberRole] = await giveMemberRoleViaInteraction(
      interaction,
      DISCORD_MEMBERSHIP_ROLE,
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
      KEYCLOAK_LEADERSHIP_GROUP,
    );
    if (!leadership) {
      await interaction.editReply({
        content: 'You have been verified as a member of TheLab.ms. Welcome!',
      });
      return;
    }
    const [addedLeadershipRole] = await giveMemberRoleViaInteraction(
      interaction,
      DISCORD_LEADERSHIP_ROLE,
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
