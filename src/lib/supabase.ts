import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '$server/database.types';
import {
  CV_PUBLIC_SUPABASE_URL,
  CV_PUBLIC_SUPABASE_ANON_KEY
} from '$lib/public-env';

export const supabase = createBrowserClient<Database>(
  CV_PUBLIC_SUPABASE_URL,
  CV_PUBLIC_SUPABASE_ANON_KEY
);
