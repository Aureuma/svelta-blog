import { building } from '$app/environment';
import { env } from '$env/dynamic/public';

const requirePublicEnv = (key: string) => {
  const value = env[key];
  if (value === undefined || value === '') {
    if (building) {
      return '';
    }
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

export const CV_PUBLIC_SUPABASE_URL = requirePublicEnv(
  'CV_PUBLIC_SUPABASE_URL'
);
export const CV_PUBLIC_SUPABASE_ANON_KEY = requirePublicEnv(
  'CV_PUBLIC_SUPABASE_ANON_KEY'
);
export const CV_PUBLIC_SITE_URL = requirePublicEnv('CV_PUBLIC_SITE_URL');
