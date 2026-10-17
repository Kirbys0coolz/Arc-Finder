import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_2
const supabaseKey = import.meta.env.VITE_1

export const supabase = createClient(supabaseUrl, supabaseKey)