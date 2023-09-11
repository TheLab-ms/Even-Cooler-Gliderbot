import { AttachmentBuilder, AttachmentData, CommandInteraction, EmbedBuilder } from 'discord.js';
import printers from '../../utils/printers';
import { OctoprintError } from '../../lib/octoprint/errors';
import { Command } from '../../interfaces/Commands';
import EventData from '../../interfaces/EventData.interface';

export class Status extends Command {
  title = 'status';

  description = 'Get the status of a printer';

  isEphemeral = true;

  options = [
    {
      name: 'printer',
      description: 'The printer to check the status of',
      type: 'STRING',
      required: true,
      choices: Object.keys(printers).map((printer, index) => ({
        name: printer,
        value: printer,
      })),
    },
  ];

  async run(interaction: CommandInteraction) {
    if (
      !interaction.options ||
      !interaction.options.get('printer') ||
      interaction.options.get('printer') === null
    ) {
      return;
    }
    const option = interaction.options.get('printer');
    const printerIndex = option?.value as string;
    const printer = printers[printerIndex];

    try {
      const [printerState, jobState, snapshotBuffer] = await Promise.all([
        printer.getPrinterState(),
        printer.getJobState(),
        printer.getSnapshot(),
      ]);
      const imageData: AttachmentData = {
        name: `snapshot.jpg`,
      };
      const snapshot = new AttachmentBuilder(snapshotBuffer, imageData);
      const embedFiles = [];
      const embed = new EmbedBuilder()
        .setTitle('Printer Status')
        .addFields([
          {
            name: 'Printer State',
            value: printerState.state.text,
            inline: true,
          },
        ])
        .setTimestamp();

      // If the printer has a webcam or we have a snapshot buffer, add the image to the embed
      if (printer.hasWebcam || snapshotBuffer !== null) {
        embed.setImage(`attachment://${imageData.name}`);
        embedFiles.push(snapshot);
      } else {
        embed.addFields([
          {
            name: 'Webcam',
            value: 'No webcam configured',
          },
        ]);
      }

      if (printerState.state.text === 'Printing') {
        const jobEndingTimestamp = (
          (Date.now() + jobState.progress.printTimeLeft * 1000) /
          1000
        ).toFixed(0);
        embed.addFields([
          {
            name: 'Job Name',
            value: jobState.job.file.name,
            inline: true,
          },
          {
            name: 'Job Progress',
            value: `${jobState.progress.completion.toFixed(2)}%`,
            inline: true,
          },
          {
            name: 'Estimated Time Remaining',
            value: `<t:${jobEndingTimestamp}:R>`,
          },
        ]);
      }

      // const confirm = new ButtonBuilder()
      //   .setCustomId('confirm')
      //   .setLabel('Confirm Ban')
      //   .setStyle(ButtonStyle.Danger);

      // const cancel = new ButtonBuilder()
      //   .setCustomId('cancel')
      //   .setLabel('Cancel')
      //   .setStyle(ButtonStyle.Secondary);

      // const row = new ActionRowBuilder<ButtonBuilder>().addComponents(cancel, confirm);

      await interaction.editReply({
        embeds: [embed],
        files: embedFiles,
        // components: [row],
      });
    } catch (error) {
      if (error instanceof OctoprintError) {
        await interaction.editReply(`Error: ${error.message}`);
        return;
      }
      await interaction.editReply(`An unknown error occurred`);
    }
  }
}
