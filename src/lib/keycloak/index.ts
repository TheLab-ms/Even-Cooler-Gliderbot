import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { KeyCloakConfig, KeyCloakTokenResponse, KeycloakUser, KeycloakUserResponse } from './types';

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

  getUsers(): Promise<KeycloakUserResponse[]> {
    return this.makeRequest<KeycloakUserResponse[]>({
      method: 'get',
      path: `users`,
    });
  }

  async getGroupMembers(groupId: string): Promise<KeycloakUser[]> {
    const members = await this.makeRequest<KeycloakUserResponse[]>({
      method: 'get',
      path: `groups/${groupId}/members`,
    });
    const cleanedMembers = members
      .map((member: KeycloakUserResponse) => ({
        id: member.id,
        createdTimestamp: member.createdTimestamp,
        username: member.username,
        enabled: member.enabled,
        totp: member.totp,
        emailVerified: member.emailVerified,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        discordId:
          member.attributes && member.attributes.discordId && member.attributes.discordId[0]
            ? member.attributes.discordId[0]
            : undefined,
        activeSubscriber:
          member.attributes &&
          member.attributes.activeSubscriber &&
          member.attributes.activeSubscriber[0]
            ? member.attributes.activeSubscriber[0]
            : undefined,
        disableableCredentialTypes: member.disableableCredentialTypes,
        requiredActions: member.requiredActions,
        notBefore: member.notBefore,
      }))
      .filter((member) => member.discordId);
    return cleanedMembers;
  }

  async lookupDiscordUserInGroup(
    discordId: string,
    groupId: string,
  ): Promise<KeycloakUser | undefined> {
    const keycloakMembers = await this.getGroupMembers(groupId);
    // Lookup discordId in keycloakMembers
    return keycloakMembers.find((member) => member.discordId === discordId);
  }
}
