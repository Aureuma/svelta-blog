import type { SupabaseClient, Session, User } from '@supabase/supabase-js';
import type { Database } from '$server/database.types';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      getSession: () => Promise<Session | null>;
      session: Session | null;
      user: User | null;
    }
  }
}

export {};
