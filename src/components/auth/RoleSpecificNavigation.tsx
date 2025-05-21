
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase/types';

const RoleSpecificNavigation = () => {
  const { profile } = useAuth();
  
  // Don't render if no profile
  if (!profile) return null;
  
  // Check the role field for verification members or admins
  const isVerifier = 
    profile.role === UserRole.VERIFICATION_MEMBER || 
    profile.role === UserRole.ADMIN;
  
  if (!isVerifier) return null;

  return (
    <Link to="/verification">
      <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
        <CheckCircle2 size={16} />
        <span>Verification Panel</span>
      </Button>
    </Link>
  );
};

export default RoleSpecificNavigation;
