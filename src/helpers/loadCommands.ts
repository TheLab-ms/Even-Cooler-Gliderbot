import { Collection } from 'discord.js';
import { Status } from '../interactions/commands/status';
import { Account } from '../interactions/commands/account';
import { Command } from '../interfaces/Commands';

export type CommandCollection = Collection<string, Command>;

export default async function loadCommands(): Promise<CommandCollection> {
  const allCommands = [new Status(), new Account()];
  const commands = new Collection<string, Command>();

  // Include all commands here
  allCommands.forEach((command) => {
    commands.set(command.title, command);
  });

  return commands;
}
