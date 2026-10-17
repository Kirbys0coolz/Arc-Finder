import { supabase } from './supabase';
import type { Profile, NewProfile } from './types';

export async function createProfile(p: NewProfile): Promise<Profile> {
  const { data: {user} } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
    
  const { data, error } = await supabase
    .from('profiles')
    .insert(p)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getMyProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data;
}