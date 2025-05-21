
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserType, Profile } from './types';

/**
 * Log in a user with email and password
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // Get user profile data after successful login
    if (data.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }
        
      if (profileData) {
        // Store user type in localStorage for easy access
        localStorage.setItem('userType', profileData.user_type);
      }
    }
    
    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    toast({
      title: 'Login failed',
      description: error.message || 'Invalid credentials',
      variant: 'destructive',
    });
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear any local storage
    localStorage.removeItem('userType');
    
    toast({
      title: 'Logout successful',
      description: 'You have been logged out successfully.',
    });
  } catch (error: any) {
    toast({
      title: 'Logout failed',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }
};

/**
 * Get the current user session
 */
export const getCurrentUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Reset password for the user with the given email
 */
export const resetPassword = async (email: string) => {
  try {
    // Validate email
    if (!email || !email.includes('@')) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return { error: new Error('Invalid email address') };
    }

    // Make sure we're using the correct redirect URL format
    // This should match a route that our application can handle
    const redirectUrl = `${window.location.origin}/auth/callback`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) throw error;

    toast({
      title: 'Password reset email sent',
      description: 'Check your email for a password reset link',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Password reset error:', error);
    toast({
      title: 'Password reset failed',
      description: error.message || 'Failed to send reset email',
      variant: 'destructive',
    });
    return { error };
  }
};

/**
 * Update the password for the current user
 */
export const updatePassword = async (password: string) => {
  try {
    if (!password || password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return { error: new Error('Password too short') };
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) throw error;

    toast({
      title: 'Password updated',
      description: 'Your password has been updated successfully',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Password update error:', error);
    toast({
      title: 'Password update failed',
      description: error.message || 'Failed to update password',
      variant: 'destructive',
    });
    return { error };
  }
};
