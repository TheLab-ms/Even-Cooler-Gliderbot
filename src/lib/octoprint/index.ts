import fs from 'fs';
import path from 'path';

import { JobState, OctoprintConfig, PrinterStatus } from './types';
import { OctoprintError } from './errors';
import { debugLog } from '../../utils/debug';

export default class Octoprint {
  private url: string;

  private apiKey: string;

  public hasWebcam: boolean;

  public name: string;

  constructor(printerConfig: OctoprintConfig) {
    this.url = printerConfig.address;
    this.apiKey = printerConfig.apiKey;
    this.hasWebcam = printerConfig.hasWebcam;
    this.name = printerConfig.name;
  }

  public async getPrinterState(): Promise<PrinterStatus> {
    return this.httpRequest('/api/printer', 'GET');
  }

  public async getJobState(): Promise<JobState> {
    return this.httpRequest('/api/job', 'GET');
  }

  public async getSnapshot(): Promise<Buffer> {
    if (!this.hasWebcam) {
      const fallbackImage = await fs.promises.readFile(
        path.join(__dirname, '../../images/fallback.jpg'),
      );
      return fallbackImage;
    }
    try {
      const response = await this.httpRequest('/webcam/?action=snapshot', 'GET', {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response, 'utf-8');
    } catch (error) {
      const fallbackImage = await fs.promises.readFile(
        path.join(__dirname, '../../images/fallback.jpg'),
      );
      return fallbackImage;
    }
  }

  private async httpRequest(
    path: string,
    method: 'GET' | 'POST',
    options?: {
      responseType?: 'json' | 'arraybuffer';
    },
  ): Promise<any> {
    try {
      const response: Response = await fetch(`${this.url}${path}`, {
        method,
        headers: {
          'X-Api-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new OctoprintError(response.status, errorData?.error ?? 'Unknown error');
      }

      if (options?.responseType === 'arraybuffer') {
        return await response.arrayBuffer();
      } else {
        return await response.json();
      }
    } catch (error) {
      if (error instanceof OctoprintError) {
        debugLog(error);
        throw error;
      } else {
        debugLog(error);
        throw new OctoprintError(500, 'Unknown error');
      }
    }
  }
}
