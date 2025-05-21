import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/lib/supabase/types";

const Dashboard = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Log auth state for debugging
  useEffect(() => {
    console.log("Dashboard auth state:", { 
      isLoading, 
      user: !!user, 
      profile: !!profile,
      profileData: profile
    });
  }, [isLoading, user, profile]);
  
  // Handle auth redirection with proper loading check
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container-custom min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Handle case where auth is loaded but profile is still loading
  // This prevents the "missing profile" message from flashing briefly
  if (user && !profile && !isLoading) {
    return (
      <div className="container-custom min-h-screen py-12">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Profile Setup Needed</h1>
          <p className="mb-6">
            Please complete your profile setup to access the dashboard.
          </p>
          <button
            onClick={() => navigate("/profile/edit")}
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on user type
  if (profile) {
    const userType = profile.user_type;
    
    switch (userType) {
      case UserType.STUDENT:
        return <StudentDashboard />;
      case UserType.TEACHER:
        return <TeacherDashboard />;
      case UserType.ADMIN:
        return <AdminDashboard />;
      case UserType.VERIFICATION_MEMBER:
        return <Navigate to="/verification" />;
      default:
        return <StudentDashboard />;
    }
  }

  // Fallback - should not reach here if logic is correct
  return <Navigate to="/login" />;
};

export default Dashboard;
