import { CommandInteraction } from 'discord.js';

export async function giveMemberRole(
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
