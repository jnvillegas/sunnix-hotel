/**
 * Helper para verificar si existe una conexión real configurada a Supabase
 * o si el entorno se encuentra operando en modo local / demo simulado.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (url.includes('demo-sunnix') || url.includes('placeholder')) return false;
  if (key.includes('placeholder') || key.includes('demo-anon-key')) return false;

  return true;
}
