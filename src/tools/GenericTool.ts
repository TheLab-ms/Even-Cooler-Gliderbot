import Tool, { ToolInfo, ToolStatus } from '../interfaces/Tool';

export default class GenericTool implements Tool {
  protected toolInfo: ToolInfo;
  constructor(toolInfo: ToolInfo) {
    this.toolInfo = toolInfo;
  }

  getName(): string {
    throw new Error('Method not implemented.');
  }

  getType(): '3D Printer' | 'Laser Cutter' | 'CNC' | 'Other' {
    throw new Error('Method not implemented.');
  }

  getStatus(): Promise<ToolStatus> {
    throw new Error('Method not implemented.');
  }

  getSnapshot(): Promise<Buffer> {
    throw new Error('Method not implemented.');
  }

  getToolInfo(): ToolInfo {
    return this.toolInfo;
  }
}
