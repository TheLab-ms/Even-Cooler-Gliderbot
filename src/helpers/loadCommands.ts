import { Collection } from 'discord.js';
import { Command } from '../lib/command';
import { Status } from '../commands/status';

export type CommandCollection = Collection<string, Command>;

export default async function loadCommands(): Promise<Collection<string, Command>> {
  const commands = new Collection<string, Command>();

  const status = new Status();

  // Include all commands here
  commands.set(status.title, status);

  return commands;
}
