import { Printer } from '../interfaces/Printer';
import GenericTool from './GenericTool';

export default class GenericPrinter extends GenericTool implements Printer {
  getRemainingTime(): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
