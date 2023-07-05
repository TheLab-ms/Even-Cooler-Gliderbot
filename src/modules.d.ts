declare namespace NodeJS {
  export interface ProcessEnv {
    DISCORD_TOKEN: string;
    CLIENT_ID: string;
    GUILD_ID: string;
    CONFIG: string;
    KEYCLOAK_URL: string;
    KEYCLOAK_REALM: string;
    KEYCLOAK_USER: string;
    KEYCLOAK_PASSWORD: string;
    KEYCLOAK_LEADERSHIP_GROUP: string;
    KEYCLOAK_MEMBERSHIP_GROUP: string;
    DISCORD_MEMBERSHIP_ROLE: string;
    DISCORD_LEADERSHIP_ROLE: string;
  }
}
