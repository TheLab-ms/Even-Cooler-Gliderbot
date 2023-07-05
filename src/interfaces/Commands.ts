import {
  CommandInteraction,
  ContextMenuCommandType,
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import EventData from './EventData.interface';

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

  abstract run(interaction: CommandInteraction, data: EventData): Promise<void>;
}

export abstract class Menu extends GenericCommand {
  type: ContextMenuCommandType = ApplicationCommandType.User;

  abstract run(interaction: UserContextMenuCommandInteraction, data: EventData): Promise<void>;
}
