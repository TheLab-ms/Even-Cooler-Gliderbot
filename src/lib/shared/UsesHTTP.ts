export default class UsesHTTP {
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
