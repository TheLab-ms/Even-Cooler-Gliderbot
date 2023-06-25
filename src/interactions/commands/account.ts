import { CommandInteraction } from 'discord.js';

import { Keycloak } from '../../lib/keycloak';
import { giveMemberRole } from '../../utils/discord';
import { Command } from '../../interfaces/Commands';

export class Account extends Command {
  title = 'account';
  description = 'Sync your membership status';
  isEphemeral = true;
  options = [];
  async run(interaction: CommandInteraction) {
    const client = new Keycloak({
      url: process.env.KEYCLOAK_URL || '',
      realm: process.env.KEYCLOAK_REALM || '',
      user: process.env.KEYCLOAK_USER || '',
      password: process.env.KEYCLOAK_PASSWORD || '',
    });

    try {
      // Check if user is found in Members role
      const members = (await client.getGroupMembers(process.env.KEYCLOAK_MEMBERSHIP_GROUP)).filter(
        (member) => {
          return member.attributes?.discordId && member.attributes?.discordId[0];
        },
      );
      const member = members.find((member) => {
        if (member.attributes?.discordId && member.attributes?.discordId[0]) {
          return member.attributes?.discordId[0] === interaction.user.id;
        }
      });
      if (!member) {
        await interaction.editReply({
          content: `You are not a member of TheLab`,
        });
        return;
      }

      // Update user roles
      const [success, errMessage] = await giveMemberRole(
        interaction,
        process.env.DISCORD_MEMBERSHIP_ROLE || '',
      );
      if (!success) {
        await interaction.editReply({
          content: `An error occured: ${errMessage}`,
        });
        return;
      }
      await interaction.editReply({
        content: `You are a member of TheLab, updating your roles`,
      });

      // Check if user is Leadership
      const leadership = (
        await client.getGroupMembers(process.env.KEYCLOAK_LEADERSHIP_GROUP)
      ).filter((member) => {
        return member.attributes?.discordId && member.attributes?.discordId[0];
      });

      const isLeadership = leadership.some((member) => {
        if (member.attributes?.discordId && member.attributes?.discordId[0]) {
          return member.attributes?.discordId[0] === interaction.user.id;
        }
      });

      if (!isLeadership) {
        return;
      }
      await giveMemberRole(interaction, process.env.DISCORD_LEADERSHIP_ROLE);
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: `An error occured`,
      });
    }
  }
}
