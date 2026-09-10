import { createClient } from '@supabase/supabase-js';

// Points at the same Supabase project RMBpay2 uses ("rmbpay"), NOT the
// separate empty "AdminDash" project — the real data lives here.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://rgfzrrfrshywpaoqbxvz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_7xfyOE_s3JUxk6sZwoi91w_HdLtPeRk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
