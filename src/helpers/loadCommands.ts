import { Collection } from 'discord.js';
import { Command } from '../lib/command';
import { Status } from '../commands/status';
import { Account } from '../commands/account';

export type CommandCollection = Collection<string, Command>;

export default async function loadCommands(): Promise<Collection<string, Command>> {
  const commands = new Collection<string, Command>();

  const status = new Status();
  const account = new Account();

  // Include all commands here
  commands.set(status.title, status);
  commands.set(account.title, account);
  return commands;
}
