// lib/supabase.ts (new file)
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://joranrwygcfklkqbndfb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcmFucnd5Z2Nma2xrcWJuZGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTk4MTMsImV4cCI6MjA4MDc5NTgxM30.MdiGr1Svk7SdVVKAR-sxag7SVeXIVp8nbczyvVTlMMo'

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)