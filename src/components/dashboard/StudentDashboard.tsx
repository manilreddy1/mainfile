import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Users, Clock as ClockIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, Navigate } from "react-router-dom";

interface Tutor {
  id: string;
  tutorId: number;
  name: string;
}

interface Session {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  tutor_id: number;
  tutor_name?: string;
  status: string;
  meeting_link?: string;
}

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      console.log('StudentDashboard: Starting loadDashboardData');
      console.log('StudentDashboard: User:', user);
      console.log('StudentDashboard: Profile:', profile);

      if (!user || !profile) {
        console.log('StudentDashboard: User or profile missing:', { user, profile });
        setErrorMessage('User authentication failed. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('StudentDashboard: Loading data for student ID:', user.id);

        // Verify student profile
        console.log('StudentDashboard: Fetching student profile for ID:', user.id);
        const { data: studentProfile, error: studentError } = await supabase
          .from('profiles')
          .select('id, user_type, first_name, last_name, email')
          .eq('id', user.id)
          .single();

        if (studentError) {
          console.error('StudentDashboard: Error fetching student profile:', studentError);
          throw new Error(`Failed to fetch student profile: ${studentError.message}`);
        }

        console.log('StudentDashboard: Fetched student profile:', studentProfile);
        if (!studentProfile || studentProfile.user_type !== 'student') {
          console.warn('StudentDashboard: Invalid student profile:', studentProfile);
          setErrorMessage('Invalid student profile. Please contact support.');
          setLoading(false);
          return;
        }

        // Fetch assigned tutors
        console.log('StudentDashboard: Fetching assignments for student ID:', user.id);
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('student_tutor_assignments')
          .select('tutor_id')
          .eq('student_id', user.id)
          .eq('status', 'active');

        if (assignmentsError) {
          console.error('StudentDashboard: Error fetching assignments:', assignmentsError);
          throw new Error(`Failed to fetch assignments: ${assignmentsError.message}`);
        }

        console.log('StudentDashboard: Assignments data:', assignmentsData);
        if (assignmentsData && assignmentsData.length > 0) {
          const tutorIds = [...new Set(assignmentsData.map(a => a.tutor_id))];
          console.log('StudentDashboard: Tutor IDs:', tutorIds);

          console.log('StudentDashboard: Fetching tutor profiles for tutor IDs:', tutorIds);
          const { data: tutorProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, tutor_id')
            .in('tutor_id', tutorIds);

          if (profilesError) {
            console.error('StudentDashboard: Error fetching tutor profiles:', profilesError);
            throw new Error(`Failed to fetch tutor profiles: ${profilesError.message}`);
          }

          console.log('StudentDashboard: Tutor profiles:', tutorProfiles);
          if (tutorProfiles) {
            const formattedTutors = tutorProfiles.map(tutor => ({
              id: tutor.id,
              tutorId: tutor.tutor_id,
              name: `${tutor.first_name} ${tutor.last_name}`
            }));
            console.log('StudentDashboard: Formatted tutors:', formattedTutors);
            setTutors(formattedTutors);
          }
        } else {
          console.log('StudentDashboard: No active assignments found');
        }

        // Fetch upcoming sessions
        console.log('StudentDashboard: Fetching upcoming sessions for student ID:', user.id);
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('scheduled_sessions')
          .select(`
            id,
            title,
            start_time,
            end_time,
            tutor_id,
            status,
            meeting_link
          `)
          .eq('student_id', user.id)
          .gte('start_time', new Date().toISOString())
          .order('start_time', { ascending: true });

        if (sessionsError) {
          console.error('StudentDashboard: Error fetching sessions:', sessionsError);
          throw new Error(`Failed to fetch sessions: ${sessionsError.message}`);
        }

        console.log('StudentDashboard: Sessions data:', sessionsData);
        if (sessionsData) {
          const tutorIds = [...new Set(sessionsData.map(s => s.tutor_id))];
          console.log('StudentDashboard: Tutor IDs for sessions:', tutorIds);

          console.log('StudentDashboard: Fetching tutor profiles for sessions:', tutorIds);
          const { data: tutorProfiles, error: tutorProfilesError } = await supabase
            .from('profiles')
            .select('tutor_id, first_name, last_name')
            .in('tutor_id', tutorIds);

          if (tutorProfilesError) {
            console.error('StudentDashboard: Error fetching tutor profiles for sessions:', tutorProfilesError);
            throw new Error(`Failed to fetch tutor profiles for sessions: ${tutorProfilesError.message}`);
          }

          console.log('StudentDashboard: Tutor profiles for sessions:', tutorProfiles);
          const tutorMap = new Map();
          if (tutorProfiles) {
            tutorProfiles.forEach(tutor => {
              tutorMap.set(tutor.tutor_id, `${tutor.first_name} ${tutor.last_name}`);
            });
          }

          const formattedSessions = sessionsData.map(session => ({
            ...session,
            tutor_name: tutorMap.get(session.tutor_id) || `Tutor ${session.tutor_id}`
          }));
          console.log('StudentDashboard: Formatted sessions:', formattedSessions);
          setUpcomingSessions(formattedSessions);
        } else {
          console.log('StudentDashboard: No upcoming sessions found');
        }
      } catch (error: any) {
        console.error("StudentDashboard: Error loading data:", error);
        setErrorMessage(error.message || "Failed to load dashboard data. Please try again.");
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        console.log('StudentDashboard: Setting loading to false');
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
          <Card className="mb-6 border-yellow-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-yellow-600">Setup Issue</CardTitle>
              <CardDescription>
                There was an issue loading your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="rounded-full h-16 w-16 flex items-center justify-center bg-yellow-100 mx-auto mb-4">
                  <Users className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Error</h2>
                <p className="mb-6 text-gray-600 max-w-md mx-auto">
                  {errorMessage}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-gray-600">Welcome, {profile.first_name || 'Student'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                My Tutors
              </CardTitle>
              <CardDescription>
                Tutors assigned to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tutors.length > 0 ? (
                <div className="space-y-4">
                  {tutors.map(tutor => (
                    <div key={tutor.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <h3 className="font-medium">{tutor.name}</h3>
                      </div>
                      <Link to={`/chat/${tutor.tutorId}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No tutors assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Tutors</span>
                  <span className="font-bold">{tutors.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Upcoming Sessions</span>
                  <span className="font-bold">{upcomingSessions.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>
              Your scheduled lessons
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map(session => (
                  <div key={session.id} className="flex flex-col md:flex-row justify-between p-4 rounded-lg border">
                    <div>
                      <h3 className="font-medium">{session.title}</h3>
                      <p className="text-sm text-gray-600">with {session.tutor_name}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {new Date(session.start_time).toLocaleString()} - {new Date(session.end_time).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center">
                      <div className="mr-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          session.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {session.status === 'scheduled' ? 'Scheduled' :
                           session.status === 'in_progress' ? 'In Progress' :
                           session.status}
                        </span>
                      </div>
                      {session.meeting_link && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => window.open(session.meeting_link, '_blank')}
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No upcoming sessions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default StudentDashboard;