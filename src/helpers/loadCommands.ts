import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { Collection } from 'discord.js';
import ICommand from '../interfaces/Command.interface';

interface ImportedCommand {
  default: ICommand;
}

export type CommandCollection = Collection<string, ICommand>;

export default async function loadCommands(): Promise<Collection<string, ICommand>> {
  const commands = new Collection<string, ICommand>();
  console.log(__dirname);
  const files = (await readdir(path.join(__dirname, '../commands'))).filter(
    (name: string) => name.endsWith('.ts') || name.endsWith('.js'),
  );
  const imports: ImportedCommand[] = await Promise.all(
    files.map((command) => import(path.join(`../commands/${command}`)) as Promise<ImportedCommand>),
  );
  imports.forEach((command) => {
    commands.set(command.default.data.name, command.default);
  });
  return commands;
}
