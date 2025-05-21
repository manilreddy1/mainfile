
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { VerificationStatus, Profile } from './types';

/**
 * Upload teacher demo video
 */
export const uploadTeacherDemo = async (userId: string, file: File) => {
  try {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return null;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 100MB',
        variant: 'destructive',
      });
      return null;
    }

    // Create a folder path
    const filePath = `${userId}/demo-${Date.now()}.mp4`;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('teacher_demos')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) throw uploadError;

    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from('teacher_demos')
      .getPublicUrl(filePath);
    
    // Update teacher verification status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        verification_status: VerificationStatus.PENDING_VERIFICATION
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    toast({
      title: 'Success',
      description: 'Demo video uploaded successfully. Your account is now pending verification.',
    });
    
    return data.publicUrl;
  } catch (error: any) {
    console.error('Error uploading demo video:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to upload demo video',
      variant: 'destructive',
    });
    return null;
  }
};

/**
 * Get all teachers pending verification
 */
export const getPendingTeachers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'teacher')
      .eq('verification_status', VerificationStatus.PENDING_VERIFICATION);
    
    if (error) throw error;
    return data as Profile[];
  } catch (error: any) {
    console.error('Error fetching pending teachers:', error);
    return [];
  }
};

/**
 * Get teacher demo video URL
 */
export const getTeacherDemoUrl = async (teacherId: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('teacher_demos')
      .list(teacherId, {
        sortBy: { column: 'created_at', order: 'desc' },
        limit: 1,
      });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      const { data: urlData } = supabase.storage
        .from('teacher_demos')
        .getPublicUrl(`${teacherId}/${data[0].name}`);
      
      return urlData.publicUrl;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error getting teacher demo URL:', error);
    return null;
  }
};

/**
 * Update teacher verification status
 */
export const updateTeacherVerification = async (
  teacherId: string,
  status: VerificationStatus,
  notes?: string
) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        verification_status: status
      })
      .eq('id', teacherId);
    
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: `Teacher ${status === VerificationStatus.APPROVED ? 'approved' : 'rejected'} successfully`,
    });
    
    // In a real app, you would send an email notification here
    console.log(`Teacher ${teacherId} ${status}. Notes: ${notes || 'None'}`);
    
    return true;
  } catch (error: any) {
    console.error('Error updating teacher verification:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to update teacher verification',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Check if current user is a verification member or admin
 */
export const isVerificationAuthorized = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    
    return data?.role === 'verification_member' || data?.role === 'admin';
  } catch (error) {
    console.error('Error checking verification authorization:', error);
    return false;
  }
};

/**
 * Get verification statistics
 */
export const getVerificationStats = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('verification_status')
      .eq('user_type', 'teacher');
    
    if (error) throw error;
    
    const stats = {
      total: data.length,
      pending: data.filter(p => p.verification_status === VerificationStatus.PENDING_VERIFICATION).length,
      approved: data.filter(p => p.verification_status === VerificationStatus.APPROVED).length,
      rejected: data.filter(p => p.verification_status === VerificationStatus.REJECTED).length,
      waiting: data.filter(p => p.verification_status === VerificationStatus.WAITING_DEMO).length
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting verification stats:', error);
    return { total: 0, pending: 0, approved: 0, rejected: 0, waiting: 0 };
  }
};
