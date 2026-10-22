'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface AuthActionResult {
  error?: string;
  success?: boolean;
}

export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Por favor ingrese correo electrónico y contraseña.' };
  }

  // Atajo para desarrollo / demo local
  if (email === 'admin@sunnix.local' || email === 'demo@sunnix.local') {
    const cookieStore = await cookies();
    cookieStore.set('sunnix_demo_session', 'true', { path: '/' });
    redirect('/dashboard');
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch {
    // Si Supabase no está configurado en local, habilitar ingreso demo
    const cookieStore = await cookies();
    cookieStore.set('sunnix_demo_session', 'true', { path: '/' });
    redirect('/dashboard');
  }

  redirect('/dashboard');
}

export async function loginDemoAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('sunnix_demo_session', 'true', { path: '/' });
  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('sunnix_demo_session');

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Silently continue
  }

  redirect('/login');
}
