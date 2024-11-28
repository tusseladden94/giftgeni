import type { AstroGlobal } from 'astro';
import { supabase } from '../lib/supabase';

export async function requireAuth(Astro: AstroGlobal) {
  const accessToken = Astro.cookies.get('sb-access-token')?.value;
  const refreshToken = Astro.cookies.get('sb-refresh-token')?.value;

  if (!accessToken || !refreshToken) {
    return Astro.redirect('/admin/login');
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      // Clear invalid cookies
      Astro.cookies.delete('sb-access-token');
      Astro.cookies.delete('sb-refresh-token');
      return Astro.redirect('/admin/login');
    }

    return null;
  } catch (error) {
    console.error('Auth error:', error);
    return Astro.redirect('/admin/login');
  }
}