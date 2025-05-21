import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile, VerificationStatus, UserRole, UserType } from "@/lib/supabase/types";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  hasActiveSubscription: () => Promise<boolean>;
  getAssignedTutors: () => Promise<any[]>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileFetching, setIsProfileFetching] = useState(false);

  // Function to fetch profile data
  const fetchProfile = async (userId: string) => {
    // Prevent multiple simultaneous profile fetches
    if (isProfileFetching) return null;
    
    try {
      setIsProfileFetching(true);
      console.log("Fetching profile for user:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      // Convert string values to their proper enum types before returning
      if (data) {
        console.log("Profile data fetched:", data);
        
        // Create properly typed profile object
        const typedProfile: Profile = {
          ...data,
          verification_status: data.verification_status as VerificationStatus,
          role: data.role as UserRole,
          user_type: data.user_type as UserType // Convert string to UserType enum
        };
        
        return typedProfile;
      }
      
      return null;
    } catch (error) {
      console.error("Exception fetching profile:", error);
      return null;
    } finally {
      setIsProfileFetching(false);
    }
  };

  useEffect(() => {
    console.log("AuthProvider initializing");
    setIsLoading(true);

    // Set up auth state listener first - this is crucial
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, "Session:", currentSession ? "exists" : "none");

        // Update session and user state synchronously
        setSession(currentSession);
        setUser(currentSession?.user || null);

        // If session exists, fetch profile in a separate task to avoid auth deadlocks
        if (currentSession?.user) {
          // Use setTimeout to defer the profile fetch and avoid potential auth deadlocks
          setTimeout(async () => {
            const userProfile = await fetchProfile(currentSession.user.id);
            if (userProfile) {
              setProfile(userProfile);
              console.log("Profile fetched after auth change:", userProfile);
            } else {
              setProfile(null);
            }
            // Only set loading to false after profile is fetched
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Getting initial session");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting initial session:", error);
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        console.log("Initial session:", initialSession ? "exists" : "none");

        if (initialSession?.user) {
          // Update session and user state synchronously
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Fetch profile in a non-blocking way
          const userProfile = await fetchProfile(initialSession.user.id);
          if (userProfile) {
            setProfile(userProfile);
            console.log("Profile fetched during initialization:", userProfile);
          } else {
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize auth after setting up the listener
    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    try {
      console.log("Signing out...");
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      console.log("Sign out complete");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasActiveSubscription = async () => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .lte('start_date', new Date().toISOString())
        .gte('end_date', new Date().toISOString())
        .maybeSingle();
        
      if (error) {
        console.error("Error checking subscription:", error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error("Exception checking subscription:", error);
      return false;
    }
  };
  
  const getAssignedTutors = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('student_tutor_assignments')
        .select('*')
        .eq('student_id', user.id)
        .eq('status', 'active');
        
      if (error) {
        console.error("Error fetching assigned tutors:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Exception fetching assigned tutors:", error);
      return [];
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signOut,
    hasActiveSubscription,
    getAssignedTutors,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
