import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  url: string;
  category: string;
  affiliate_tag: string;
  is_visible: boolean;
  created_at: string;
}