
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './types';

/**
 * Get the profile of a user by ID
 */
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as Profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, profileData: Partial<Profile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Upload profile avatar
 */
export const uploadAvatar = async (userId: string, file: File) => {
  try {
    // Create a unique file path
    const filePath = `${userId}/${Date.now()}-${file.name}`;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) throw uploadError;

    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    // Update the user's profile with the new avatar URL
    await updateUserProfile(userId, { avatar_url: data.publicUrl });
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};
