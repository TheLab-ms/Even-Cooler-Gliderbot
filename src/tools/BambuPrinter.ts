import { Printer } from '../interfaces/Printer';
import Tool, { ToolInfo, ToolStatus, ToolType } from '../interfaces/Tool';
import HomeAssistant from '../lib/homeassistant';
import { EntityState } from '../lib/homeassistant/types';
import { BambuPrinterConfig } from '../schemas/config';
import GenericPrinter from './GenericPrinter';
import GenericTool from './GenericTool';

const allPrinterStates = [
  'failed',
  'finish',
  'idle',
  'init',
  'pause',
  'prepare',
  'running',
  'slicing',
  'unknown',
  'offline',
] as const;

type PrinterStates = (typeof allPrinterStates)[number];

interface BambuPrinterEntity extends EntityState {
  state: PrinterStates;
}

type BambuPrinterFinishTimeEntity = Omit<EntityState, 'state'> & { state: number };

/*
 * Bambu Printers utilize HomeAssistant to determine their status
 */
const inUseStates: PrinterStates[] = ['running', 'pause', 'prepare', 'slicing'];

export default class BambuPrinter extends GenericPrinter {
  private homeAssistant: HomeAssistant;
  private homeAssistantEntityId: string;
  private homeAssistantCameraEntityId?: string;
  private homeAssistantFinishTimeEntity?: string;

  constructor(config: BambuPrinterConfig) {
    super(config);
    this.homeAssistant = new HomeAssistant();
    this.homeAssistantEntityId = config.homeAssistantEntity;
    this.homeAssistantCameraEntityId = config.homeAssistantCameraEntity;
    this.homeAssistantFinishTimeEntity = config.homeAssistantFinishTimeEntity;
    if (this.homeAssistantCameraEntityId) {
      this.toolInfo.hasWebcam = true;
    }
  }
  async getRemainingTime(): Promise<number> {
    if (!this.homeAssistantFinishTimeEntity) {
      throw new Error('No finish time entity configured');
    }
    const { state } = await this.homeAssistant.getEntity<BambuPrinterFinishTimeEntity>(
      this.homeAssistantFinishTimeEntity,
    );
    return state * 60;
  }

  getType(): ToolType {
    return '3D Printer';
  }

  hasWebcam(): boolean {
    return !!this.homeAssistantCameraEntityId;
  }

  async getStatus(): Promise<ToolStatus> {
    const entity = (await this.homeAssistant.getEntity(
      this.homeAssistantEntityId,
    )) as BambuPrinterEntity;
    return {
      isAvailable: !inUseStates.includes(entity.state),
    };
  }

  async getSnapshot(): Promise<Buffer> {
    if (!this.homeAssistantCameraEntityId) {
      throw new Error('No camera entity configured');
    }
    return await this.homeAssistant.getCameraSnapshot(this.homeAssistantCameraEntityId);
  }
}
