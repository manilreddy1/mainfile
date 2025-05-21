
import { supabase } from '@/integrations/supabase/client';

/**
 * Function to create the admin user if it doesn't exist
 */
export const createAdminUser = async () => {
  const adminEmail = "admin@colearnerr.com";
  const adminPassword = "Admin123@CoLearner";
  
  try {
    console.log('Attempting to create admin user...');
    
    // First check if admin exists in auth
    const { data: { session } } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    }).catch(() => {
      // If login fails, admin doesn't exist or password is wrong
      console.log('Admin login failed, will attempt to create admin user');
      return { data: { session: null } };
    });
    
    if (session) {
      console.log('Admin user already exists and credentials are correct');
      // Make sure we sign out after checking
      await supabase.auth.signOut();
      return;
    }
    
    // Check if admin exists in profiles table
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', adminEmail)
      .eq('user_type', 'admin');
      
    if (existingProfiles && existingProfiles.length > 0) {
      console.log('Admin profile exists, but credentials may be incorrect');
      return;
    }
    
    console.log('Creating admin user with signup...');
    
    // Create admin user with signup
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User',
          user_type: 'admin',
        },
      }
    });
    
    if (error) {
      console.error('Failed to create admin with signup:', error);
      return;
    }
    
    // If signup worked, create profile if needed
    if (data.user) {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();
        
      if (!existingProfile) {
        // Create the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            first_name: 'Admin',
            last_name: 'User',
            email: adminEmail,
            user_type: 'admin',
          });

        if (profileError) {
          console.error('Error creating admin profile:', profileError);
        } else {
          console.log('Admin user and profile created successfully');
        }
      }
      
      // Sign out after creation
      await supabase.auth.signOut();
    }
    
    console.log('Admin user creation process completed');
  } catch (error: any) {
    console.error('Failed to create admin user:', error.message);
  }
};
