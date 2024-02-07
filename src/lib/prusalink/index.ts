import { JobState, PrinterStatus, PrusaLinkConfig } from './types';

export default class PrusaLink {
  private address: string;
  private apiKey: string;
  public name: string;
  constructor({ address, apiKey, name }: PrusaLinkConfig) {
    this.address = address;
    this.apiKey = apiKey;
    this.name = name;
  }
  public getPrinterState() {
    return this.httpRequest<PrinterStatus>('/api/printer', 'GET');
  }

  public getJobState() {
    return this.httpRequest<JobState>('/api/job', 'GET');
  }

  private async httpRequest<T>(path: string, method: 'GET' | 'POST', body?: Object): Promise<T> {
    const response: Response = await fetch(`${this.address}${path}`, {
      method,
      headers: {
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(response.statusText, errorData?.error ?? 'Unknown error');
    }
    return await response.json();
  }
}
