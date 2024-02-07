import { Client, GuildMember } from 'discord.js';
import { giveMemberRole, giveMemberNickName } from '../../utils/discord';
import EventData from '../../interfaces/EventData.interface';

export default async function syncRoles(
  client: Client,
  memberId: string,
  guildId: string,
  data: EventData,
): Promise<string> {
  const foundMember = await data.keycloakClient.lookupDiscordUserInGroup(
    memberId,
    process.env.KEYCLOAK_MEMBERSHIP_GROUP as string,
  );
  if (!foundMember) {
    return 'User is not a member';
  }
  const [successAddedMember] = await giveMemberRole(
    client,
    memberId,
    guildId,
    process.env.DISCORD_MEMBERSHIP_ROLE as string,
  );

  try {
    if (data.config.forceKeycloakName) {
      const newNickName = `${foundMember.firstName} ${foundMember.lastName}`;
      giveMemberNickName(client, memberId, guildId, newNickName);
    }
  } catch (error) {
    console.error('Failed to set nickname for user');
  }

  if (!successAddedMember) {
    console.error(`Failed to add membership role to ${memberId}`);
    return 'Failed to add membership role';
  }

  const foundLeader = await data.keycloakClient.lookupDiscordUserInGroup(
    memberId,
    process.env.KEYCLOAK_LEADERSHIP_GROUP as string,
  );

  if (!foundLeader) {
    return 'Gave membership role to user';
  }

  const [successAddedLeadership] = await giveMemberRole(
    client,
    memberId,
    guildId,
    process.env.DISCORD_LEADERSHIP_ROLE as string,
  );

  if (!successAddedLeadership) {
    console.error(`Failed to add leadership role to ${memberId}`);
    return 'Failed to add leadership role';
  }

  return 'Gave membership and leadership roles to user';
}
