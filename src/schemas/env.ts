import z from "zod";

const envSchema = z.object({
    DISCORD_TOKEN: z.string(),
    CLIENT_ID: z.string(),
    GUILD_ID: z.string(),
    CONFIG: z.string(),
    KEYCLOAK_URL: z.string().optional(),
    KEYCLOAK_REALM: z.string().optional(),
    KEYCLOAK_USER: z.string().optional(),
    KEYCLOAK_PASSWORD: z.string().optional(),
    KEYCLOAK_LEADERSHIP_GROUP: z.string().optional(),
    KEYCLOAK_MEMBERSHIP_GROUP: z.string().optional(),
    DISCORD_MEMBERSHIP_ROLE: z.string().optional(),
    DISCORD_LEADERSHIP_ROLE: z.string().optional(),
    HOMEASSISTANT_URL: z.string().url("Invalid URL"),
    HOMEASSISTANT_API_TOKEN: z.string(),
    NODE_ENV: z.enum(["DEV", "PROD"]).default("PROD")
});

export default envSchema;
