import { JobState, PrinterStatus } from '../lib/octoprint/types';
import Tool from './Tool';

export interface Printer extends Tool {
  getRemainingTime(): Promise<number>;
}
