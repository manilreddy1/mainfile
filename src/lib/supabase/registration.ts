
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserType } from './types';

/**
 * Register a new user
 */
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  userType: UserType,
  subject?: string
) => {
  try {
    // Check if email is valid
    if (!email || !email.includes('@')) {
      toast({
        title: 'Registration failed',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      throw new Error('Invalid email address');
    }

    // Sign up the user with email confirmation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) throw authError;

    // Set default verification status for teachers
    const verificationStatus = userType === 'teacher' ? 'waiting_demo' : undefined;

    // Create the profile manually to ensure it's created
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          user_type: userType,
          subject: subject || null,
          verification_status: verificationStatus,
          role: userType, // Set role same as user_type by default
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }
    }

    toast({
      title: 'Registration successful',
      description: 'Please check your email to verify your account before logging in.',
    });

    return authData;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle specific Supabase errors
    if (error.code === 'over_email_send_rate_limit') {
      toast({
        title: 'Registration throttled',
        description: 'Please try again in a minute',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Registration failed',
        description: error.message || 'There was an error creating your account',
        variant: 'destructive',
      });
    }
    throw error;
  }
};
