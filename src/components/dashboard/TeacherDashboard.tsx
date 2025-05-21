import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Users, Video, Clock as ClockIcon, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, Navigate } from "react-router-dom";
import TeacherDashboardStatus from "./TeacherDashboardStatus";
import { VerificationStatus } from "@/lib/supabase/types";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

interface Session {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  student_id: string;
  student_name?: string;
  status: string;
  meeting_link?: string;
}

const TeacherDashboard = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tutorId, setTutorId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || !profile) {
        console.log('TeacherDashboard: User or profile missing:', { user, profile });
        setErrorMessage('User authentication failed. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('TeacherDashboard: Loading data for teacher:', user.id);

        const { data: teacherProfile, error: teacherError } = await supabase
          .from('profiles')
          .select('tutor_id, verification_status')
          .eq('id', profile.id)
          .single();

        if (teacherError) {
          console.error('TeacherDashboard: Error fetching teacher profile:', teacherError);
          throw new Error(`Failed to fetch teacher profile: ${teacherError.message}`);
        }

        if (!teacherProfile) {
          console.warn('TeacherDashboard: No profile found for this teacher');
          setErrorMessage('Teacher profile not found. Please contact support.');
          return;
        }

        const teacherTutorId = teacherProfile.tutor_id;
        setTutorId(teacherTutorId);
        console.log('TeacherDashboard: Teacher profile:', teacherProfile);
        console.log('TeacherDashboard: Found tutor_id:', teacherTutorId);

        if (!teacherProfile.tutor_id || teacherProfile.verification_status !== VerificationStatus.APPROVED) {
          console.warn('TeacherDashboard: Skipping student fetch due to tutor_id or verification status:', {
            tutor_id: teacherProfile.tutor_id,
            verification_status: teacherProfile.verification_status,
          });
        }

        if (teacherProfile.verification_status === VerificationStatus.APPROVED && teacherTutorId) {
          console.log('TeacherDashboard: Teacher is approved and has a tutor_id, fetching assignments and sessions...');

          // Fetch assignments
          const { data: assignmentsData, error: assignmentsError } = await supabase
            .from('student_tutor_assignments')
            .select('student_id, status')
            .eq('tutor_id', teacherTutorId)
            .eq('status', 'active');

          if (assignmentsError) {
            console.error('TeacherDashboard: Error fetching assignments:', assignmentsError);
            throw new Error(`Failed to fetch assignments: ${assignmentsError.message}`);
          }

          console.log('TeacherDashboard: Assignments data:', assignmentsData);
          if (!assignmentsData || assignmentsData.length === 0) {
            console.warn('TeacherDashboard: No active assignments found for tutor_id:', teacherTutorId);
          }

          if (assignmentsData && assignmentsData.length > 0) {
            const studentIds = [...new Set(assignmentsData.map(a => a.student_id))];
            console.log('TeacherDashboard: Student IDs to fetch:', studentIds);

            const { data: studentProfiles, error: profilesError } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, email, avatar_url')
              .in('id', studentIds);

            if (profilesError) {
              console.error('TeacherDashboard: Error fetching student profiles:', profilesError);
              throw new Error(`Failed to fetch student profiles: ${profilesError.message}`);
            }

            console.log('TeacherDashboard: Student profiles fetched:', studentProfiles);
            if (!studentProfiles || studentProfiles.length === 0) {
              console.warn('TeacherDashboard: No student profiles found for student_ids:', studentIds);
            }

            if (studentProfiles) {
              const formattedStudents = studentProfiles.map(student => ({
                id: student.id,
                name: `${student.first_name} ${student.last_name}`,
                email: student.email,
                avatar_url: student.avatar_url
              }));
              console.log('TeacherDashboard: Final formatted students:', formattedStudents);
              setStudents(formattedStudents);
            }
          }

          // Fetch upcoming sessions
          console.log('TeacherDashboard: Fetching upcoming sessions...');
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('scheduled_sessions')
            .select(`
              id,
              title,
              start_time,
              end_time,
              student_id,
              status,
              meeting_link
            `)
            .eq('tutor_id', teacherTutorId)
            .gte('start_time', new Date().toISOString())
            .order('start_time', { ascending: true });

          if (sessionsError) {
            console.error('TeacherDashboard: Error fetching sessions:', sessionsError);
            throw new Error(`Failed to fetch sessions: ${sessionsError.message}`);
          }

          console.log('TeacherDashboard: Sessions data:', sessionsData);
          if (sessionsData) {
            const studentIds = [...new Set(sessionsData.map(s => s.student_id))];

            const { data: studentProfiles, error: studentProfilesError } = await supabase
              .from('profiles')
              .select('id, first_name, last_name')
              .in('id', studentIds);

            if (studentProfilesError) {
              console.error('TeacherDashboard: Error fetching student profiles for sessions:', studentProfilesError);
              throw new Error(`Failed to fetch student profiles for sessions: ${studentProfilesError.message}`);
            }

            console.log('TeacherDashboard: Student profiles for sessions:', studentProfiles);
            const studentMap = new Map();
            if (studentProfiles) {
              studentProfiles.forEach(student => {
                studentMap.set(student.id, `${student.first_name} ${student.last_name}`);
              });
            }

            const formattedSessions = sessionsData.map(session => ({
              ...session,
              student_name: studentMap.get(session.student_id) || `Student ${session.student_id.slice(0, 6)}`
            }));
            console.log('TeacherDashboard: Formatted sessions:', formattedSessions);
            setUpcomingSessions(formattedSessions);
          }
        }
      } catch (error: any) {
        console.error("TeacherDashboard: Error loading data:", error);
        setErrorMessage(error.message || "Failed to load dashboard data. Please try again.");
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        console.log('TeacherDashboard: Setting loading to false');
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, profile]);

  const startVideoSession = (sessionId: string) => {
    const meetingLink = `https://meet.jit.si/colearnerr-session-${sessionId}`;

    supabase
      .from('scheduled_sessions')
      .update({
        meeting_link: meetingLink,
        status: 'in_progress'
      })
      .eq('id', sessionId)
      .then(({ error }) => {
        if (error) {
          console.error('TeacherDashboard: Error starting video session:', error);
          toast({
            title: "Error",
            description: "Failed to start session",
            variant: "destructive"
          });
        } else {
          window.open(meetingLink, '_blank');

          setUpcomingSessions(prev => prev.map(session =>
            session.id === sessionId
              ? { ...session, meeting_link: meetingLink, status: 'in_progress' }
              : session
          ));

          toast({
            title: "Session started",
            description: "Video session has been initiated"
          });
        }
      });
  };

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

  if (profile.verification_status === 'waiting_demo') {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle>Complete Your Registration</CardTitle>
              <CardDescription>
                One more step to activate your teacher account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Video className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Upload Your Teaching Demo</h2>
                <p className="mb-6 text-gray-600 max-w-md mx-auto">
                  Please upload a short teaching demo video to complete your registration.
                  Our team will review your demo and approve your account.
                </p>
                <Link to="/upload-demo">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Upload Demo Video
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (profile.verification_status === 'pending_verification') {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle>Verification In Progress</CardTitle>
              <CardDescription>
                Your account is currently being reviewed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="rounded-full h-16 w-16 flex items-center justify-center bg-yellow-100 mx-auto mb-4">
                  <ClockIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Account Under Review</h2>
                <p className="mb-2 text-gray-600 max-w-md mx-auto">
                  Thank you for submitting your teaching demo. Our team is currently reviewing your submission.
                </p>
                <p className="text-gray-600 max-w-md mx-auto">
                  This process typically takes 1-2 business days. You'll receive a notification once your account is approved.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (profile.verification_status === 'rejected') {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
          <Card className="mb-6 border-red-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-red-600">Verification Not Approved</CardTitle>
              <CardDescription>
                Your teaching demo did not meet our requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="rounded-full h-16 w-16 flex items-center justify-center bg-red-100 mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Resubmission Required</h2>
                <p className="mb-6 text-gray-600 max-w-md mx-auto">
                  Unfortunately, your teaching demo did not meet our quality standards. Please review our guidelines
                  and submit a new demo video that better showcases your teaching abilities.
                </p>
                <Link to="/upload-demo">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Submit New Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <TeacherDashboardStatus profile={profile} />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-gray-600">Welcome, {profile.first_name || 'Teacher'}</p>
          </div>
        </div>

        {!tutorId && profile.verification_status === VerificationStatus.APPROVED && (
          <Card className="mb-6 border-yellow-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-yellow-600">Account Setup Incomplete</CardTitle>
              <CardDescription>
                Your teacher profile is missing a tutor ID. Please contact support to complete your setup.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-gray-600">
                <p>While you can access your dashboard, some features might be limited until your setup is complete.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                My Students
              </CardTitle>
              <CardDescription>
                Students assigned to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length > 0 ? (
                <div className="space-y-4">
                  {students.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          {student.avatar_url ? (
                            <img src={student.avatar_url} alt={student.name} className="w-10 h-10 rounded-full" />
                          ) : (
                            <span className="text-blue-600 font-medium">
                              {student.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <Link to={`/chat/${tutorId}?student=${student.id}`}>
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
                  <p>No students assigned yet</p>
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
                  <span className="text-gray-600">Students</span>
                  <span className="font-bold">{students.length}</span>
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
                      <p className="text-sm text-gray-600">with {session.student_name}</p>
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
                      {session.status === 'scheduled' ? (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => startVideoSession(session.id)}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      ) : session.meeting_link ? (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => window.open(session.meeting_link, '_blank')}
                        >
                          Join
                        </Button>
                      ) : null}
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

export default TeacherDashboard;