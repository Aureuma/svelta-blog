import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const session = locals.session ?? (await locals.getSession());
  const metadata = locals.user?.user_metadata ?? {};
  const user = locals.user
    ? {
        id: locals.user.id,
        email: locals.user.email,
        name: metadata.full_name || metadata.name || null
      }
    : null;

  return { session, user };
};
