import { building } from '$app/environment';
import { env } from '$env/dynamic/private';

const optionalEnv = (key: string, fallback = '') => {
  const value = env[key];
  if (value === undefined || value === '') {
    return fallback;
  }
  return value;
};

const DEV_RELAXED_ENV =
  optionalEnv('VIVA_DEV_RELAXED_ENV', 'false') === 'true';

const requireEnv = (key: string, relaxInDev = false) => {
  const value = env[key];
  if (value === undefined || value === '') {
    if (building) {
      return '';
    }
    if (relaxInDev && DEV_RELAXED_ENV) {
      console.warn(`Missing env var in relaxed dev mode: ${key}`);
      return '';
    }
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

export const CV_SUPABASE_INTERNAL_URL = requireEnv('CV_SUPABASE_INTERNAL_URL');
export const CV_SUPABASE_SERVICE_ROLE_KEY = requireEnv(
  'CV_SUPABASE_SERVICE_ROLE_KEY'
);

export const CV_GEMINI_API_KEY = requireEnv('CV_GEMINI_API_KEY', true);
export const CV_GEMINI_MODEL_NAME = requireEnv('CV_GEMINI_MODEL_NAME', true);

export const CV_DEV_AUTOLOGIN =
  optionalEnv('CV_DEV_AUTOLOGIN', 'false') === 'true';
export const CV_DEV_AUTOLOGIN_EMAIL = optionalEnv(
  'CV_DEV_AUTOLOGIN_EMAIL',
  'hello@convelt.com'
);
export const CV_DEV_AUTOLOGIN_PASSWORD = optionalEnv(
  'CV_DEV_AUTOLOGIN_PASSWORD',
  ''
);
