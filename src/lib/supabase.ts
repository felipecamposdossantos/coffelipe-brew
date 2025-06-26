
import { createClient } from '@supabase/supabase-js'

console.log('Initializing Supabase client...');

// Usar os valores do projeto Supabase configurado
const supabaseUrl = 'https://lawdsesikzlttnvrhkqn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhd2RzZXNpa3psdHRudnJoa3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDkyNjIsImV4cCI6MjA2NjI4NTI2Mn0.vggXeANPTHXEFFWRwLvmS37bOcQWbK5XXIrxHoxhPzo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})

export const isSupabaseConfigured = true

console.log('Supabase client initialized successfully');
