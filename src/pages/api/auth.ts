import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (data.session) {
      cookies.set('sb-access-token', data.session.access_token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      cookies.set('sb-refresh-token', data.session.refresh_token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Authentication failed' }), {
      status: 401
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      }), 
      { status: 500 }
    );
  }
};