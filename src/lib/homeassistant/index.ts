import env from '../../utils/env';
import { CameraState, EntityState } from './types';

export default class HomeAssistant {
  public url: string;
  private apiKey: string;

  constructor(url = env.HOMEASSISTANT_URL, apiKey = env.HOMEASSISTANT_API_TOKEN) {
    this.url = url;
    this.apiKey = apiKey;
  }

  public getEntity<T = EntityState>(entityId: string) {
    return this.httpRequest<T>(`/api/states/${entityId}`, 'GET');
  }

  public async getCameraSnapshot(entityId: string) {
    const {
      attributes: { entity_picture },
    } = await this.getEntity<CameraState>(entityId);
    const response = await fetch(`${this.url}${entity_picture}`);
    return Buffer.from(await response.arrayBuffer());
  }

  private async httpRequest<T>(path: string, method: 'GET' | 'POST'): Promise<T> {
    const response: Response = await fetch(`${this.url}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(response.statusText, errorData?.error ?? 'Unknown error');
    }
    return await response.json();
  }
}
