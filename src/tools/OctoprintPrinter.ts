import Tool, { ToolInfo, ToolStatus, ToolType } from '../interfaces/Tool';
import Octoprint from '../lib/octoprint';
import { OctoprintPrinterConfig } from '../schemas/config';
import GenericPrinter from './GenericPrinter';

const inUseText = ['Printing'];

export default class OctoprintPrinter extends GenericPrinter {
  private octoprint: Octoprint;

  constructor(config: OctoprintPrinterConfig) {
    super(config);
    this.octoprint = new Octoprint(config);
  }

  hasWebcam(): boolean {
    return this.octoprint.hasWebcam;
  }

  getSnapshot(): Promise<Buffer> {
    return this.octoprint.getSnapshot();
  }

  getType(): ToolType {
    return '3D Printer';
  }

  async getRemainingTime(): Promise<number> {
    const {
      progress: { printTimeLeft },
    } = await this.octoprint.getJobState();
    return printTimeLeft;
  }

  async getStatus(): Promise<ToolStatus> {
    const status = await this.octoprint.getPrinterState();
    return {
      isAvailable: !inUseText.includes(status.state.text),
    };
  }
}
