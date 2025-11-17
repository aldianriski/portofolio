import { z } from 'zod';

/**
 * Environment Variables Schema
 * This validates all required environment variables at build time
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Next.js
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),

  // Supabase (Public - Safe for client)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL',
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, {
    message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required',
  }),

  // Supabase (Server-only - Keep secret!)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, {
    message: 'SUPABASE_SERVICE_ROLE_KEY is required for server operations',
  }),

  // Admin Authentication
  ADMIN_PASSWORD: z.string().min(8, {
    message: 'ADMIN_PASSWORD must be at least 8 characters',
  }),
});

/**
 * Server-side environment variables
 * These are validated at runtime and only available on the server
 */
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
});

/**
 * Client-safe environment variables
 * Only includes variables prefixed with NEXT_PUBLIC_
 */
export const clientEnv = {
  SITE_URL: env.NEXT_PUBLIC_SITE_URL,
  SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>;
