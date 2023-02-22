import { Message } from 'discord.js';
import EventData from '../interfaces/EventData.interface';

async function keyWordFinder(message: Message, autoResponse: EventData['config']['autoResponse']) {
  const { content } = message;
  if (!autoResponse) return;
  for (const { phrases, responses, reaction } of autoResponse) {
    if (!phrases) continue;
    if (phrases.includes(content.toLowerCase())) {
      if (reaction) await message.react(reaction);
      if (!responses) continue;
      message.reply(responses[Math.floor(Math.random() * responses.length)]);
      return;
    }
  }
}

export default async function onMessage(message: Message, data: EventData) {
  if (message.author.bot) return;
  await keyWordFinder(message, data.config.autoResponse);
}
