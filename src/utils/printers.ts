import { Octoprint } from '../lib/octoprint';
import { OctoprintConfig } from '../lib/octoprint/types';
import config from './config';

interface PrinterCollection {
  [key: string]: Octoprint;
}

const printers: PrinterCollection = {};

if (config.printers) {
  config.printers.forEach((printer) => {
    const printerConfig = printer as OctoprintConfig;
    return (printers[printerConfig.name] = new Octoprint(printerConfig));
  });
}

export default printers;
