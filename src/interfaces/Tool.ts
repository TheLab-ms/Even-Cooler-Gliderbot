export const toolTypes = ['3D Printer', 'Laser Cutter', 'CNC', 'Other'] as const;

export type ToolType = (typeof toolTypes)[number];

export interface ToolStatus {
  isAvailable: boolean;
  remainingTime?: number;
}

export interface ToolInfo {
  name: string;
  make: string;
  model: string;
  color: string;
  hasWebcam: boolean;
  hasRemainingTime: boolean;
}

export default interface Tool {
  getType(): ToolType;
  getStatus(): Promise<ToolStatus>;
  getSnapshot(): Promise<Buffer>;
  getToolInfo(): ToolInfo;
}
