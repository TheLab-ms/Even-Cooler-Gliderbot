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

  public getPrinterState(): Promise<PrinterStatus> {
    return this.httpRequest('/api/printer', 'GET');
  }

  public getJobState(): Promise<JobState> {
    return this.httpRequest('/api/job', 'GET');
  }

  public async getSnapshot(): Promise<Buffer> {
    try {
      // Bun hack - For some reason octet streams are broken in Bun
      const proc = Bun.spawn(["curl", "-s", `${this.url}/webcam/?action=snapshot`]);
      const image = await new Response(proc.stdout);
      return Buffer.from(await image.arrayBuffer());
    } catch (e) {
      const fallbackImage = Bun.file('src/images/fallback.jpg');
      return Buffer.from(await fallbackImage.arrayBuffer());
    }
  }

  private async httpRequest(
    path: string,
    method: 'GET' | 'POST'
  ): Promise<any> {
    try {
      const response = await fetch(`${this.url}${path}`, {
        method,
        headers: {
          'X-Api-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        console.log("Not ok")
        const errorData = await response.json();
        throw new OctoprintError(
          response.status,
          errorData?.error ?? 'Unknown error'
        );
      }

      return await response.json();
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
