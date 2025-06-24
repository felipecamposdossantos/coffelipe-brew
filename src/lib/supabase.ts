
import { createClient } from '@supabase/supabase-js'

// Usar valores padrão válidos se as variáveis de ambiente não estiverem configuradas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Verificar se as variáveis de ambiente estão configuradas
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

if (!isSupabaseConfigured) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export { isSupabaseConfigured }
