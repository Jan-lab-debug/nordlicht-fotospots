import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser-side Supabase client.
 * Use this in Client Components and for direct browser uploads to Storage.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
