import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import VerificationDashboard from '@/components/verification/VerificationDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase/types';

const VerificationPage = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authorization only after auth loading is complete
    if (!isLoading) {
      if (!user) {
        navigate('/login');
        return;
      }
      
      // Check if user has verification role
      if (profile && profile.role !== UserRole.VERIFICATION_MEMBER && profile.role !== UserRole.ADMIN) {
        navigate('/dashboard');
      }
    }
  }, [user, profile, isLoading, navigate]);

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user after loading, return null (redirect happens in useEffect)
  if (!user) {
    return null;
  }

  // If user doesn't have verification role, return null (redirect happens in useEffect)
  if (profile && profile.role !== UserRole.VERIFICATION_MEMBER && profile.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <VerificationDashboard />
    </main>
  );
};

export default VerificationPage;
