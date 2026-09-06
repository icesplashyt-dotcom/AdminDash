import { createClient } from "@supabase/supabase-js";

// These point at the same Supabase project used by the RMBPay user app
// (project ref: rgfzrrfrshywpaoqbxvz), so every real transaction, KYC
// submission, wallet change etc. from the user app is visible here.
//
// Values fall back to the real project so the dashboard works even if
// the Vercel project env vars below aren't set — but for production you
// should set these in Vercel: Project Settings -> Environment Variables.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://rgfzrrfrshywpaoqbxvz.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_7xfyOE_s3JUxk6sZwoi91w_HdLtPeRk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
