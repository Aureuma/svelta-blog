import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/dashboard';

  if (code) {
    await locals.supabase.auth.exchangeCodeForSession(code);
  }

  throw redirect(303, next);
};
