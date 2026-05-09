import { env } from './env';

export function isAllowedOrigin(origin?: string): boolean {
  if (!origin) return true;
  if (env.CLIENT_ORIGINS.includes(origin)) return true;
  if (env.ALLOW_VERCEL_PREVIEWS && origin.endsWith('.vercel.app')) return true;
  return false;
}
