import {
  AttachmentBuilder,
  AttachmentData,
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

  options = [
    {
      name: 'tool',
      description: 'The tool to check the status of',
      type: 'STRING',
      required: true,
      choices: Object.keys(tools).map((tool, index) => ({
        name: tool,
        value: tool,
      })),
    },
  ];

  async run(interaction: CommandInteraction) {
    if (
      !interaction.options ||
      !interaction.options.get('tool') ||
      interaction.options.get('tool') === null
    ) {
      return;
    }
    const option = interaction.options.get('tool');
    const toolIndex = option?.value as string;
    const tool = tools[toolIndex];
    const toolInfo = tool.getToolInfo();
    try {
      const toolPromises: Promise<any>[] = [tool.getStatus()];
      if (toolInfo.hasWebcam) {
        toolPromises.push(tool.getSnapshot());
      } else {
        toolPromises.push(Promise.resolve(null));
      }
      // if (toolInfo.hasRemainingTime && tool.getType() === '3D Printer') {
      //   const printer = tool as Printer;
      //   toolPromises.push(printer.getRemainingTime());
      // } else {
      //   toolPromises.push(Promise.resolve(null));
      // }
      const [toolState, snapshotBuffer] = await Promise.all(toolPromises);
      const embed = new EmbedBuilder()
        .setTitle(toolInfo.name)
        .setColor(toolInfo.color as ColorResolvable)
        .addFields([
          {
            name: 'Tool Availability',
            value: toolState.isAvailable ? 'Available' : 'In Use',
            inline: true,
          },
        ])
        .setTimestamp();

      const toolThumbnail = thumbnails[`${toolInfo.make} ${toolInfo.model}`];

      if (toolThumbnail) {
        embed.setThumbnail(toolThumbnail);
      }

      if (!snapshotBuffer) {
        embed.addFields([
          {
            name: 'Webcam',
            value: 'No webcam configured',
          },
        ]);
      }

      if (toolInfo.hasRemainingTime && tool.getType() === '3D Printer' && !toolState.isAvailable) {
        const printer = tool as Printer;
        const remainingTime = await printer.getRemainingTime();
        const finishTime = Math.floor(Date.now() / 1000) + remainingTime;
        embed.addFields([
          {
            name: 'Finish At',
            value: `<t:${finishTime}:t>`,
          },
        ]);
      }

      const embedReply: { embeds: EmbedBuilder[]; files: AttachmentBuilder[] } = {
        embeds: [embed],
        files: [],
      };

      // Build the snapshot attachment
      if (snapshotBuffer) {
        const imageData: AttachmentData = {
          name: `snapshot.jpg`,
        };
        const snapshot = new AttachmentBuilder(snapshotBuffer, imageData);
        embedReply.embeds[0].setImage(`attachment://${imageData.name}`);
        embedReply.files.push(snapshot);
      }

      // if (toolState.state.text === 'Printing') {
      //   const jobEndingTimestamp = (
      //     (Date.now() + jobState.progress.printTimeLeft * 1000) /
      //     1000
      //   ).toFixed(0);
      //   embed.addFields([
      //     {
      //       name: 'Job Name',
      //       value: jobState.job.file.name,
      //       inline: true,
      //     },
      //     {
      //       name: 'Job Progress',
      //       value: `${jobState.progress.completion.toFixed(2)}%`,
      //       inline: true,
      //     },
      //     {
      //       name: 'Estimated Time Remaining',
      //       value: `<t:${jobEndingTimestamp}:R>`,
      //     },
      //   ]);
      // }

      // const confirm = new ButtonBuilder()
      //   .setCustomId('confirm')
      //   .setLabel('Confirm Ban')
      //   .setStyle(ButtonStyle.Danger);

      // const cancel = new ButtonBuilder()
      //   .setCustomId('cancel')
      //   .setLabel('Cancel')
      //   .setStyle(ButtonStyle.Secondary);

      // const row = new ActionRowBuilder<ButtonBuilder>().addComponents(cancel, confirm);

      await interaction.editReply(embedReply);
    } catch (error) {
      console.error('Error getting tool status', error);
      // if (error instanceof Octotoolror) {
      //   await interaction.editReply(`Error: ${error.message}`);
      //   return;
      // }
      await interaction.editReply(`An unknown error occurred`);
    }
  }
}
