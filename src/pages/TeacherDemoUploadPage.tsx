import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDemoUpload from '@/components/verification/TeacherDemoUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { getCurrentUser, getUserProfile } from '@/lib/supabase';
import { Profile } from '@/lib/supabase/types';

const TeacherDemoUploadPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const user = await getCurrentUser();
        if (!user) {
          toast({
            title: 'Authentication required',
            description: 'Please login to upload your demo',
            variant: 'destructive',
          });
          navigate('/login');
          return;
        }

        const userProfile = await getUserProfile(user.id);
        
        if (!userProfile) {
          toast({
            title: 'Profile not found',
            description: 'Unable to load your profile',
            variant: 'destructive',
          });
          return;
        }

        if (userProfile.user_type !== 'teacher') {
          toast({
            title: 'Access denied',
            description: 'Only teachers can upload demo videos',
            variant: 'destructive',
          });
          navigate('/dashboard');
          return;
        }

        setProfile(userProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUploadComplete = () => {
    toast({
      title: 'Upload successful',
      description: 'Your demo has been submitted for review',
    });
    navigate('/dashboard');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Teacher Verification</CardTitle>
            <CardDescription>
              Upload your teaching demo video to complete your registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Before you can access the full teaching dashboard, we need to verify
              your teaching credentials and style. Please upload a short demo video
              (5 minutes or less) that showcases your teaching abilities.
            </p>
            <p className="mb-4">
              Our verification team will review your submission and approve your
              account within 1-2 business days.
            </p>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : profile ? (
          <TeacherDemoUpload 
            profile={profile} 
            onUploadComplete={handleUploadComplete}
          />
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500">Unable to load your profile. Please try again later.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default TeacherDemoUploadPage;
