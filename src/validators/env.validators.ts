import { z } from "zod";

export const envSchema = z.object({
  PORT: z
    .string()
    .default("5000")
    .transform(Number)
    .refine((val) => !isNaN(val), { message: "PORT must be a number" }),
  DATABASE_URL: z.url("DATABASE_URL must be a valid URL"),
  FRONTEND_URL: z.url("FRONTEND_URL must be a valid URL"),
  SUPABASE_URL: z.url("SUPABASE_URL must be a valid URL"),
  SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  REDIS_USERNAME: z.string("REDIS_USERNAME is required"),
  REDIS_PASSWORD: z.string("REDIS_PASSWORD is required"),
  REDIS_HOST: z.string("REDIS_HOST is required"),
  REDIS_PORT: z.string()
    .transform(Number)
    .refine((val) => !isNaN(val), { message: "REDIS_PORT must be a number" }),
});
