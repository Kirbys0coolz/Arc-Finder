import { supabase } from './supabase';
import type { Profile, NewProfile } from './types';

export async function createProfile(p: NewProfile): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert(p)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data;
}