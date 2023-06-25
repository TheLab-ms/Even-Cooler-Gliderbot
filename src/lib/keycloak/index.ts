import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { KeyCloakConfig, KeyCloakTokenResponse, KeycloakUser } from './types';

export class Keycloak {
  private url: string;
  private realm: string;
  private user: string;
  private password: string;

  constructor(keycloakConfig: KeyCloakConfig) {
    this.url = keycloakConfig.url;
    this.realm = keycloakConfig.realm;
    this.user = keycloakConfig.user;
    this.password = keycloakConfig.password;
  }

  private async makeRequest<T>(config: {
    method: 'get' | 'post' | 'put' | 'delete';
    path: string;
  }): Promise<T> {
    const response: AxiosResponse<T> = await axios.request({
      method: config.method,
      url: `${this.url}/admin/realms/${this.realm}/${config.path}`,
      headers: {
        Authorization: `Bearer ${await this.getToken()}`,
      },
    });
    return response.data;
  }

  public async getToken(): Promise<string> {
    const credentials = qs.stringify({
      grant_type: 'password',
      client_id: 'admin-cli',
      username: this.user,
      password: this.password,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.url}/realms/${this.realm}/protocol/openid-connect/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: credentials,
    };
    const response: AxiosResponse<KeyCloakTokenResponse> = await axios.request(config);
    return response.data.access_token;
  }

  getUsers(): Promise<KeycloakUser[]> {
    return this.makeRequest<KeycloakUser[]>({
      method: 'get',
      path: `users`,
    });
  }

  getGroupMembers(groupId: string): Promise<KeycloakUser[]> {
    return this.makeRequest<KeycloakUser[]>({
      method: 'get',
      path: `groups/${groupId}/members`,
    });
  }
}
