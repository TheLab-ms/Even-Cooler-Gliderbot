import {
  CommandInteraction,
  ContextMenuCommandType,
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
} from 'discord.js';

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

export abstract class GenericCommand {
  title: string = '';
  isEphemeral: boolean = true;
  allowedRoles?: string[] = [];
  disallowedRoles?: string[] = [];
  availableInDMs: boolean = false;
}

export abstract class Command extends GenericCommand {
  description: string = '';
  options?: CommandOptions[];

  abstract run(interaction: CommandInteraction): Promise<void>;
}

export abstract class Menu extends GenericCommand {
  type: ContextMenuCommandType = ApplicationCommandType.User;

  abstract run(interaction: UserContextMenuCommandInteraction): Promise<void>;
}
