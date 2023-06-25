import { Client, CommandInteraction } from 'discord.js';

export async function giveMemberRoleViaInteraction(
  interaction: CommandInteraction,
  roleId: string,
): Promise<[boolean, string | undefined]> {
  const guild = interaction.guild;
  if (!guild) {
    return [false, 'Cannot find guild'];
  }
  const member = await guild.members.fetch(interaction.user.id);
  if (!member) {
    return [false, 'Cannot find member'];
  }
  const role = guild.roles.cache.get(roleId);
  if (!role) {
    return [false, 'Cannot find role'];
  }
  try {
    await member.roles.add(role);
  } catch (error) {
    console.error(error);
    return [false, 'Failed to add role'];
  }
  return [true, undefined];
}

export async function giveMemberRole(
  client: Client,
  userId: string,
  guildId: string,
  roleId: string,
) {
  const guild = await client.guilds.fetch(guildId);
  if (!guild) {
    return [false, 'Cannot find guild'];
  }
  const member = await guild.members.fetch(userId);
  if (!member) {
    return [false, 'Cannot find member'];
  }
  const role = guild.roles.cache.get(roleId);
  if (!role) {
    return [false, 'Cannot find role'];
  }
  try {
    await member.roles.add(role);
  } catch (error) {
    console.error(error);
    return [false, 'Failed to add role'];
  }
  return [true, undefined];
}

export async function giveMemberNickName(
  client: Client,
  userId: string,
  guildId: string,
  nickname: string,
) {
  const guild = await client.guilds.fetch(guildId);
  if (!guild) {
    return [false, 'Cannot find guild'];
  }
  const member = await guild.members.fetch(userId);
  if (!member) {
    return [false, 'Cannot find member'];
  }
  try {
    await member.setNickname(nickname);
  } catch (error) {
    console.error(error);
    return [false, 'Failed to set nickname'];
  }
  return [true, undefined];
}

