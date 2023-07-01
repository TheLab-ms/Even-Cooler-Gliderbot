import { Client, GuildMember } from 'discord.js';
import EventData from '../interfaces/EventData.interface';
import syncRoles from '../lib/shared/syncRoles';

export default async function onJoin(bot: Client, member: GuildMember, data: EventData) {
  // Check if the new member is a Member of TheLab
  await syncRoles(bot, member.id, member.guild.id, data);
}
