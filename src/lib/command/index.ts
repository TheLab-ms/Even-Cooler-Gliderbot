import { CommandInteraction } from 'discord.js';

interface OptionChoice {
  name: string;
  value: string;
}

interface CommandOptions {
  name: string;
  description: string;
  type: string;
  required: boolean;
  choices?: OptionChoice[];
}

export abstract class Command {
  title: string;
  description: string;
  isEphemeral: boolean;
  permissions?: Array<string>;
  options?: CommandOptions[];

  constructor() {
    this.title = '';
    this.description = '';
    this.isEphemeral = false;
    this.permissions = [];
    this.options = [];
  }

  abstract run(interaction: CommandInteraction): Promise<void>;
}
