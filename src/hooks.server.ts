import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import {
  CV_PUBLIC_SUPABASE_ANON_KEY,
  CV_PUBLIC_SUPABASE_URL
} from '$lib/public-env';
import type { Database } from '$server/database.types';

export const handle: Handle = async ({ event, resolve }) => {
  const pendingCookies: string[] = [];

  if (building && (!CV_PUBLIC_SUPABASE_URL || !CV_PUBLIC_SUPABASE_ANON_KEY)) {
    event.locals.session = null;
    event.locals.user = null;
    event.locals.getSession = async () => null;
    return resolve(event, {
      filterSerializedResponseHeaders: (name) => name === 'content-range'
    });
  }

  event.locals.supabase = createServerClient<Database>(
    CV_PUBLIC_SUPABASE_URL,
    CV_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookies) => {
          for (const { name, value, options } of cookies) {
            pendingCookies.push(
              event.cookies.serialize(name, value, {
                ...options,
                path: options.path ?? '/'
              })
            );
          }
        }
      }
    }
  ) as unknown as SupabaseClient<Database>;

  let session: Session | null = null;
  let sessionLoaded = false;

  event.locals.getSession = async () => {
    if (!sessionLoaded) {
      const { data } = await event.locals.supabase.auth.getSession();
      session = data.session;
      event.locals.session = session;
      event.locals.user = session?.user ?? null;
      sessionLoaded = true;
    }
    return session;
  };

  await event.locals.getSession();

  const response = await resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-range'
  });

  for (const cookie of pendingCookies) {
    response.headers.append('set-cookie', cookie);
  }

  return response;
};
