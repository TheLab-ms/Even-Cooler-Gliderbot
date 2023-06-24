import fs from 'fs';
import path from 'path';

import axios from 'axios';
import { JobState, OctoprintConfig, PrinterStatus } from './types';
import { OctoprintError } from './errors';
import { debugLog } from '../../utils/debug';
export class Octoprint {
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
    const response = await this.httpRequest('/api/printer', 'GET');
    return response.data;
  }

  public async getJobState(): Promise<JobState> {
    const response = await this.httpRequest('/api/job', 'GET');
    return response.data;
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
      return Buffer.from(response.data, 'utf-8');
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
      return await axios(`${this.url}${path}`, {
        method,
        headers: {
          'X-Api-Key': this.apiKey,
        },
        ...options,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        debugLog(error);
        throw new OctoprintError(
          error.status ?? 500,
          error.response?.data?.error ?? 'Unknown error',
        );
      }
    }
  }
}
