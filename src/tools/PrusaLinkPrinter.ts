import { ToolType, ToolStatus } from '../interfaces/Tool';
import PrusaLink from '../lib/prusalink';
import { PrusaLinkPrinterConfig } from '../schemas/config';
import GenericPrinter from './GenericPrinter';

/**
 * Represents a Prusa 3D printer connected via the PrusaLink interface.
 * This class extends GenericPrinter to provide functionalities specific to Prusa printers,
 * such as fetching the printer's status, remaining print time, and identifying the printer type.
 */
export default class PrusaLinkPrinter extends GenericPrinter {
  private prusaLink: PrusaLink;

  /**
   * Constructs a PrusaLinkPrinter instance with the specified configuration.
   * @param {PrusaLinkPrinterConfig} config - The configuration settings for the PrusaLink connection.
   */
  constructor(config: PrusaLinkPrinterConfig) {
    super(config);
    this.prusaLink = new PrusaLink(config);
  }

  /**
   * Returns the type of the tool, specifically identifying it as a '3D Printer'.
   * @returns {ToolType} The type of the tool.
   */
  getType(): ToolType {
    return '3D Printer';
  }

  /**
   * Asynchronously retrieves the current status of the Prusa printer.
   * @returns {Promise<ToolStatus>} A promise that resolves to the printer's status, 
   * indicating whether it is available based on its printing and paused flags.
   */
  async getStatus(): Promise<ToolStatus> {
    console.log("Getting Status");
    const status = await this.prusaLink.getPrinterState();
    return {
      isAvailable: !(status.state.flags.printing || status.state.flags.paused)
    };
  }

  /**
   * Asynchronously retrieves the remaining time for the current print job.
   * @returns {Promise<number>} A promise that resolves to the remaining time in seconds for the current print job.
   */
  async getRemainingTime(): Promise<number> {
    const {
      progress: { printTimeLeft },
    } = await this.prusaLink.getJobState();
    return printTimeLeft;
  }
}
