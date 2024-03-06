import {
  AttachmentBuilder,
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import tools from '../../utils/tools';
import { Command } from '../../interfaces/Commands';
import thumbnails from '../../constants/thumbnails';
import { Printer } from '../../interfaces/Printer';

export class Status extends Command {
  title = 'status';
  description = 'Get the status of a tool';
  isEphemeral = true;
  options = [{
    name: 'tool',
    description: 'The tool to check the status of',
    type: 'STRING',
    required: true,
    choices: Object.keys(tools).map(tool => ({ name: tool, value: tool })),
  }];

  async run(interaction: CommandInteraction) {
    const toolOption = interaction.options.get('tool');
    if (!toolOption?.value) return;

    const tool = tools[toolOption.value as string];
    if (!tool) {
      await interaction.editReply("Tool not found");
      return;
    }

    try {
      const embed = await this.buildToolStatusEmbed(tool);
      await interaction.editReply({ embeds: [embed.embed], files: embed.files });
    } catch (error) {
      await interaction.editReply("Tool is offline");
    }
  }

  private async getToolData(tool: any) {
    const statusPromise = tool.getStatus();
    const snapshotPromise = tool.getToolInfo().hasWebcam ? tool.getSnapshot() : Promise.resolve(null);
    return Promise.all([statusPromise, snapshotPromise]);
  }

  private async buildToolStatusEmbed(tool: any) {
    const [toolState, snapshotBuffer] = await this.getToolData(tool);
    const toolInfo = tool.getToolInfo();
    const embed = new EmbedBuilder()
      .setTitle(toolInfo.name)
      .setColor(toolInfo.color as ColorResolvable)
      .addFields([{ name: 'Tool Availability', value: toolState.isAvailable ? 'Available' : 'In Use', inline: true }])
      .setTimestamp();

    this.setThumbnail(embed, toolInfo);
    this.setSnapshot(embed, snapshotBuffer);
    await this.setRemainingTimeField(embed, tool, toolState);

    return { embed: embed, files: snapshotBuffer ? [new AttachmentBuilder(snapshotBuffer, { name: 'snapshot.jpg' })] : [] };
  }

  private setThumbnail(embed: EmbedBuilder, toolInfo: any) {
    const toolThumbnail = thumbnails[`${toolInfo.make} ${toolInfo.model}`];
    if (toolThumbnail) embed.setThumbnail(toolThumbnail);
  }

  private setSnapshot(embed: EmbedBuilder, snapshotBuffer: Buffer | null) {
    if (snapshotBuffer) embed.setImage('attachment://snapshot.jpg');
    else embed.addFields([{ name: 'Webcam', value: 'No webcam configured' }]);
  }

  private async setRemainingTimeField(embed: EmbedBuilder, tool: any, toolState: any) {
    if (tool.getToolInfo().hasRemainingTime && tool.getType() === '3D Printer' && !toolState.isAvailable) {
      const remainingTime = await (tool as Printer).getRemainingTime();
      const finishTime = Math.floor(Date.now() / 1000) + remainingTime;
      embed.addFields([{ name: 'Finish At', value: `<t:${finishTime}:t>` }]);
    }
  }
}
