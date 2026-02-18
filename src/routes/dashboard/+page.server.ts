import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = locals.session ?? (await locals.getSession());
  if (!session) {
    throw redirect(303, `/login?next=${encodeURIComponent(url.pathname)}`);
  }

  const metadata = session.user.user_metadata ?? {};
  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: metadata.full_name || metadata.name || null
    }
  };
};
