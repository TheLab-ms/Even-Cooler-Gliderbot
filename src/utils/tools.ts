import Tool from '../interfaces/Tool';
import {
  BambuPrinterSchema,
  OctoprintPrinterSchema,
  PrusaLinkPrinterSchema,
} from '../schemas/config';
import BambuPrinter from '../tools/BambuPrinter';
import OctoprintPrinter from '../tools/OctoprintPrinter';
import PrusaLinkPrinter from '../tools/PrusaLinkPrinter';

import config from './config';

interface ToolCollection {
  [key: string]: Tool;
}

const tools: ToolCollection = {};

if (config.tools) {
  config.tools.forEach((tool) => {
    switch (tool.adapter) {
      case 'bambu':
        const bambuConfig = BambuPrinterSchema.parse(tool);
        tools[tool.name] = new BambuPrinter(bambuConfig);
        break;
      case 'octoprint':
        const octoprintConfig = OctoprintPrinterSchema.parse(tool);
        tools[tool.name] = new OctoprintPrinter(octoprintConfig);
        break;
      case 'prusa-link':
        const prusaLinkConfig = PrusaLinkPrinterSchema.parse(tool);
        tools[tool.name] = new PrusaLinkPrinter(prusaLinkConfig);
    }
  });
}

export default tools;
