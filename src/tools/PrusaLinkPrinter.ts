import Tool, { ToolInfo, ToolType } from '../interfaces/Tool';
import PrusaLink from '../lib/prusalink';
import { PrusaLinkPrinterConfig } from '../schemas/config';
import GenericPrinter from './GenericPrinter';

export default class PrusaLinkPrinter extends GenericPrinter {
  private prusaLink: PrusaLink;

  constructor(config: PrusaLinkPrinterConfig) {
    super(config);
    this.prusaLink = new PrusaLink(config);
  }

  getType(): ToolType {
    return '3D Printer';
  }

  async getStatus(): Promise<any> {
    const status = await this.prusaLink.getPrinterState();
    return {
      isAvailable: !(status.state.flags.printing || status.state.flags.paused),
    };
  }

  async getRemainingTime(): Promise<number> {
    const {
      progress: { printTimeLeft },
    } = await this.prusaLink.getJobState();
    return printTimeLeft;
  }
}
