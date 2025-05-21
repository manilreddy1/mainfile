import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getUserProfile } from "@/lib/supabase";
import { Profile as ProfileType } from "@/lib/supabase/types";

const Profile = () => {
  const [displayProfile, setDisplayProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.id);
          setDisplayProfile(profile);
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive"
          });
        }
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  const getInitials = () => {
    if (!displayProfile) return "";
    const first = displayProfile.first_name?.[0] || "";
    const last = displayProfile.last_name?.[0] || "";
    return (first + last).toUpperCase();
  };

  if (isLoading || authLoading) {
    return (
      <div className="container-custom min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !displayProfile) {
    return (
      <main className="container-custom py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
          <p className="text-gray-500 mb-6">You need to be logged in to view your profile.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/login")}>Log In</Button>
            <Button variant="outline" onClick={() => navigate("/register")}>
              Sign Up
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container-custom py-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button onClick={() => navigate("/profile/edit")}>
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader className="flex flex-col items-center pb-2">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={displayProfile?.avatar_url || ""} alt={displayProfile?.first_name || "User"} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">
              {displayProfile?.first_name} {displayProfile?.last_name}
            </CardTitle>
            <p className="text-gray-500">{displayProfile?.email}</p>
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mt-2">
              {displayProfile?.user_type}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {displayProfile?.bio || "No bio provided yet."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-500">Email: </span>
                  <span className="text-gray-700">{displayProfile?.email}</span>
                </div>
                {displayProfile?.subject && (
                  <div>
                    <span className="text-gray-500">Subject: </span>
                    <span className="text-gray-700">{displayProfile.subject}</span>
                  </div>
                )}
                {displayProfile?.contact_details && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Additional Contact Details:</h4>
                    <p className="text-gray-700 whitespace-pre-line">{displayProfile.contact_details}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Profile;
