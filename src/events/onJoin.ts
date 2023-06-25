import { Client, GuildMember } from 'discord.js';
import EventData from '../interfaces/EventData.interface';
import { giveMemberNickName, giveMemberRole } from '../utils/discord';

async function setupRoles(bot: Client, member: GuildMember, data: EventData) {
  const { keycloakClient } = data;
  const foundMember = await keycloakClient.lookupDiscordUserInGroup(
    member.id,
    process.env.KEYCLOAK_MEMBERSHIP_GROUP,
  );
  if (!foundMember) {
    return;
  }
  const [successAddedMember] = await giveMemberRole(
    bot,
    member.id,
    member.guild.id,
    process.env.DISCORD_MEMBERSHIP_ROLE,
  );

  try {
    if (data.config.forceKeycloakName) {
      const newNickName = `${foundMember.firstName} ${foundMember.lastName}`;
      giveMemberNickName(bot, member.id, member.guild.id, newNickName);
    }
  } catch (error) {
    console.error('Failed to set nickname for user');
  }

  if (!successAddedMember) {
    console.error(`Failed to add membership role to ${member.id}`);
    return;
  }

  const foundLeader = await keycloakClient.lookupDiscordUserInGroup(
    member.id,
    process.env.KEYCLOAK_LEADERSHIP_GROUP,
  );

  if (!foundLeader) {
    return;
  }

  const [successAddedLeadership] = await giveMemberRole(
    bot,
    member.id,
    member.guild.id,
    process.env.DISCORD_LEADERSHIP_ROLE,
  );

  if (!successAddedLeadership) {
    console.error(`Failed to add leadership role to ${member.id}`);
    return;
  }
}

export default async function onJoin(bot: Client, member: GuildMember, data: EventData) {
  // Check if the new member is a Member of TheLab
  await setupRoles(bot, member, data);
}
