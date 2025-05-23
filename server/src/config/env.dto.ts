import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),

  API_URL: z.string().refine((data) => {
    const url = new URL(data);
    return url.protocol === "http:" || url.protocol === "https:";
  }),

  API_DATABASE_URL: z.string(),

  API_OIDC_DISCOVERY_URL: z.string(),
  API_OIDC_CLIENT_ID: z.string(),
  API_OIDC_CLIENT_SECRET: z.string(),

  JWT_STATE_EXPIRATION_TIME_MS: z.number().default(5 * 60 * 1000), // 5m
  JWT_ACCESS_TOKEN_MAX_AGE_MS: z.number().default(60 * 60 * 1000), // 1h
  JWT_REFRESH_TOKEN_MAX_AGE_MS: z.number().default(7 * 24 * 60 * 60 * 1000), // 7d
});

export type Env = z.infer<typeof envSchema>;
