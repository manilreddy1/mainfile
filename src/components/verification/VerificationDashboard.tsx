import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Video, BarChart4, UserCheck, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client'; // Assuming this path is correct
import { toast } from '@/hooks/use-toast';

// Type definitions
interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject?: string;
  submitted_at?: string; // This seems to come from profiles table directly
  verification_status: string;
  video_url?: string; // This should be populated in profiles table for consistency
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ErrorBoundary component (keep as is)
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Error</h1>
          <p className="text-red-500">Something went wrong: {this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Verification status constants
const VerificationStatus = {
  PENDING_VERIFICATION: 'pending_verification',
  WAITING_DEMO: 'waiting_demo', // This status might become less relevant with the new filter
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// MODIFIED: Fetch teachers based on new criteria and exclude approved
const getPendingTeachers = async (): Promise<Teacher[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      // Show teachers if:
      // 1. Their verification_status is 'pending_verification'
      // OR
      // 2. They have a video_url (meaning they've uploaded a video)
      .or(`verification_status.eq.${VerificationStatus.PENDING_VERIFICATION},video_url.not.is.null`)
      // AND
      // 3. Their verification_status is NOT 'approved'
      .not('verification_status', 'eq', VerificationStatus.APPROVED);

    if (error) throw error;
    console.log('getPendingTeachers data (filtered, excluding approved):', data);
    return (data as Teacher[]) || [];
  } catch (error) {
    console.error('getPendingTeachers error:', error);
    throw error;
  }
};

// Fetch teacher demo video URL from tutor_verifications (can remain as a fallback or specific check)
const getTeacherDemoUrl = async (teacherId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('tutor_verifications')
      .select('video_url')
      .eq('teacher_id', teacherId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: "Searched item was not found" (not an error if no video record yet)
        throw error;
    }
    console.log('getTeacherDemoUrl data from tutor_verifications:', data);
    return data?.video_url || null;
  } catch (error) {
    console.error('getTeacherDemoUrl error:', error);
    throw error;
  }
};

// Update teacher verification status and feedback
const updateTeacherVerification = async (teacherId: string, status: string, feedback: string | null = null): Promise<boolean> => {
  try {
    console.log(`Updating teacher ${teacherId} to status ${status}`);
    const updates: Partial<Teacher> & { updated_at: string } = {
      verification_status: status,
      updated_at: new Date().toISOString(),
    };

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', teacherId);

    if (profileError) {
      console.error('Profile update error:', profileError);
      throw profileError;
    }
    console.log('Profile updated:', profileData);

    if (feedback && status === VerificationStatus.REJECTED) { // Only update feedback on rejection
      const { data: verificationData, error: verificationError } = await supabase
        .from('tutor_verifications') // Assuming feedback is stored here
        .update({ feedback: feedback, updated_at: new Date().toISOString() })
        .eq('teacher_id', teacherId);

      // It's possible a teacher has no entry in tutor_verifications yet if rejected early
      if (verificationError && verificationError.code !== 'PGRST116') { // Allow "not found"
        console.warn('Verification update (feedback) warning/error:', verificationError);
        // Optionally, you could upsert here if feedback needs to be stored even without a prior record
      }
      console.log('Verification feedback updated (if applicable):', verificationData);
    }

    console.log(`Successfully updated teacher ${teacherId} to status ${status}`);
    return true;
  } catch (error) {
    console.error('updateTeacherVerification error:', error);
    throw error;
  }
};


// MODIFIED: Fetch verification statistics efficiently
const getVerificationStats = async () => {
  try {
    const statusesToCount = [
      VerificationStatus.PENDING_VERIFICATION,
      VerificationStatus.APPROVED,
      VerificationStatus.REJECTED,
      VerificationStatus.WAITING_DEMO, // Keep if this status is still meaningful
    ];
    
    let totalCount = 0;
    const counts: { [key: string]: number } = {
        pending: 0,
        approved: 0,
        rejected: 0,
        waiting: 0, // For WAITING_DEMO
    };

    // Get total count of all profiles considered 'teachers' (adjust if there's a user_type filter)
    const { count: totalProfilesCount, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        // .eq('user_type', 'teacher'); // Add if you only want to count teacher profiles

    if (totalError) throw totalError;
    totalCount = totalProfilesCount || 0;
    
    // Get counts for specific statuses
    const { data: statusData, error: statusError } = await supabase
      .from('profiles')
      .select('verification_status, id') // id is just to get rows, count will be done client side for simplicity with one query
      // .in('verification_status', statusesToCount); // Fetch only relevant statuses if table is huge

    if (statusError) throw statusError;

    counts.pending = statusData?.filter(p => p.verification_status === VerificationStatus.PENDING_VERIFICATION).length || 0;
    counts.approved = statusData?.filter(p => p.verification_status === VerificationStatus.APPROVED).length || 0;
    counts.rejected = statusData?.filter(p => p.verification_status === VerificationStatus.REJECTED).length || 0;
    counts.waiting = statusData?.filter(p => p.verification_status === VerificationStatus.WAITING_DEMO).length || 0;


    console.log('getVerificationStats data:', { total: totalCount, ...counts });
    return {
      total: totalCount, // This will be total profiles, adjust if needed
      pending: counts.pending,
      approved: counts.approved,
      rejected: counts.rejected,
      waiting: counts.waiting,
    };
  } catch (error) {
    console.error('getVerificationStats error:', error);
    throw error;
  }
};


// MODIFIED: Upload video to Supabase storage and update profile
const uploadVideo = async (file: File, teacherId: string): Promise<string> => {
  try {
    const fileName = `videos/${teacherId}_${Date.now()}_${file.name}`;
    console.log(`Uploading video to bucket teacher_demos, fileName: ${fileName}`);
    const { data: uploadData, error: uploadError } = await supabase.storage // Renamed 'data'
      .from('teacher_demos') // Ensure this bucket exists and has correct policies
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading video:', uploadError);
      throw uploadError;
    }
    console.log('Video uploaded to storage:', uploadData);


    const { data: urlData } = supabase.storage
      .from('teacher_demos')
      .getPublicUrl(fileName);

    const publicURL = urlData.publicUrl;
    if (!publicURL) {
      console.error('Failed to get public URL');
      throw new Error('Failed to get public URL');
    }

    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1); // Example: 1 month expiration

    // Upsert to tutor_verifications
    const { error: verificationError } = await supabase
      .from('tutor_verifications')
      .upsert(
        {
          teacher_id: teacherId,
          video_url: publicURL,
          // verification_status: VerificationStatus.PENDING_VERIFICATION, // Status on profiles table is primary
          expiration_date: expirationDate.toISOString(),
          submitted_at: new Date().toISOString(), // Add submitted_at here
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'teacher_id' }
      );

    if (verificationError) {
      console.error('Error upserting tutor_verifications:', verificationError);
      throw verificationError;
    }

    // Update profiles table with the video URL and set status to PENDING_VERIFICATION
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        verification_status: VerificationStatus.PENDING_VERIFICATION,
        video_url: publicURL, // Store video_url here too for easier access
        submitted_at: new Date().toISOString(), // Also update submitted_at on profile
        updated_at: new Date().toISOString(),
      })
      .eq('id', teacherId);

    if (profileError) {
      console.error('Error updating profiles table:', profileError);
      throw profileError;
    }

    console.log('Video uploaded and references updated successfully, public URL:', publicURL);
    return publicURL;
  } catch (error) {
    console.error('uploadVideo error:', error);
    throw error;
  }
};


const VerificationDashboard = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [demoUrlToPlay, setDemoUrlToPlay] = useState<string | null>(null); // Renamed for clarity
  const [feedback, setFeedback] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    waiting: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useEffect triggered to load data');
    // supabase.auth.getUser().then(({ data: { user }, error: authError }) => { // Renamed error
    //   console.log('Current user:', user);
    //   if (authError) console.error('Auth error:', authError);
    // });
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadTeachers(), loadStats()]);
    } catch (err: any) {
        console.error("Error loading initial data", err);
        setError(err.message || "Failed to load dashboard data.");
    } finally {
        setLoading(false);
    }
  }

  const loadTeachers = async () => {
    // setLoading(true); // Handled by loadInitialData
    try {
      const data = await getPendingTeachers();
      console.log('Loaded teachers:', data);
      setTeachers(data);
    } catch (err: any) {
      console.error('Error loading teachers:', err);
      setError((prevError) => prevError || 'Failed to load teachers'); // Keep existing error if any
      setTeachers([]); // Clear teachers on error
      throw err; // Re-throw for Promise.all
    } 
    // finally { setLoading(false); } // Handled by loadInitialData
  };

  const loadStats = async () => {
    try {
      const statsData = await getVerificationStats();
      console.log('Loaded stats:', statsData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Error loading stats:', err);
      setError((prevError) => prevError || 'Failed to load stats');
      throw err; // Re-throw for Promise.all
    }
  };

  const handleWatchVideo = async (teacher: Teacher) => {
    console.log('handleWatchVideo called with teacher:', teacher);
    setSelectedTeacher(teacher);

    // Prioritize video_url from the teacher object (profiles table), which should be up-to-date
    if (teacher.video_url) {
      console.log('Using teacher.video_url (from profiles):', teacher.video_url);
      setDemoUrlToPlay(teacher.video_url);
      setShowVideoDialog(true);
      return;
    }

    // Fallback or if explicitly checking tutor_verifications is needed
    try {
      const urlFromVerifications = await getTeacherDemoUrl(teacher.id);
      console.log('Fetched video URL from getTeacherDemoUrl (tutor_verifications):', urlFromVerifications);
      if (urlFromVerifications) {
        setDemoUrlToPlay(urlFromVerifications);
      } else {
        setDemoUrlToPlay(null); // Explicitly set to null if no URL found
         toast({
            title: 'No Video',
            description: 'No demo video found for this teacher.',
            variant: 'default',
          });
      }
      setShowVideoDialog(true);
    } catch (err: any) {
      console.error('Error fetching video URL:', err);
      toast({
        title: 'Error',
        description: 'Failed to load demo video.',
        variant: 'destructive',
      });
      setDemoUrlToPlay(null);
      setShowVideoDialog(true); // Still show dialog, but it will indicate no video
    }
  };

  const handleApprove = (teacher: Teacher) => {
    console.log('handleApprove called with teacher:', teacher);
    setSelectedTeacher(teacher);
    setShowApproveDialog(true);
  };

  const handleReject = (teacher: Teacher) => {
    console.log('handleReject called with teacher:', teacher);
    setSelectedTeacher(teacher);
    setFeedback(''); // Clear previous feedback
    setShowRejectDialog(true);
  };

  const confirmApprove = async () => {
    console.log('confirmApprove called with selectedTeacher:', selectedTeacher);
    if (!selectedTeacher) {
      console.error('No selected teacher');
      toast({ title: 'Error', description: 'No teacher selected.', variant: 'destructive' });
      return;
    }

    try {
      const success = await updateTeacherVerification(selectedTeacher.id, VerificationStatus.APPROVED);
      if (success) {
        await loadInitialData(); // Reload all data
        toast({ title: 'Teacher Approved', description: 'Teacher status updated.' });
      }
    } catch (err: any) {
      console.error('Error approving teacher:', err);
      toast({ title: 'Error', description: `Failed to approve: ${err.message}`, variant: 'destructive' });
    } finally {
      setShowApproveDialog(false);
    }
  };

  const confirmReject = async () => {
    if (!selectedTeacher) {
      toast({ title: 'Error', description: 'No teacher selected.', variant: 'destructive' });
      return;
    }
    if (!feedback.trim()) {
      toast({ title: 'Feedback Required', description: 'Please provide feedback for rejection.', variant: 'destructive' });
      return;
    }

    try {
      const success = await updateTeacherVerification(selectedTeacher.id, VerificationStatus.REJECTED, feedback);
      if (success) {
        setFeedback('');
        await loadInitialData(); // Reload all data
        toast({ title: 'Teacher Rejected', description: 'Teacher status updated and feedback noted.' });
      }
    } catch (err: any) {
      console.error('Error rejecting teacher:', err);
      toast({ title: 'Error', description: `Failed to reject: ${err.message}`, variant: 'destructive' });
    } finally {
      setShowRejectDialog(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, teacherForUpload: Teacher) => {
    console.log('handleVideoUpload called');
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    // No need to use selectedTeacher state here, pass the teacher directly
    // if (!selectedTeacher) {
    //   console.error('No selected teacher for video upload');
    //   toast({ title: 'Error', description: 'Please select a teacher first', variant: 'destructive' });
    //   return;
    // }

    try {
      console.log('Uploading video for teacherId:', teacherForUpload.id);
      const publicURL = await uploadVideo(file, teacherForUpload.id);
      console.log('Video upload successful, publicURL:', publicURL);
      // Update local teacher state for immediate reflection of video_url if needed, or rely on loadInitialData
      // setTeachers(prevTeachers => prevTeachers.map(t => t.id === teacherForUpload.id ? {...t, video_url: publicURL, verification_status: VerificationStatus.PENDING_VERIFICATION} : t));
      // setDemoUrlToPlay(publicURL); // Optionally set it to be playable immediately

      await loadInitialData(); // Reload all data to ensure consistency
      toast({ title: 'Success', description: 'Video uploaded successfully.' });
    } catch (err: any) {
      console.error('Video upload failed:', err);
      toast({ title: 'Error', description: `Failed to upload video: ${err.message}`, variant: 'destructive'});
    } finally {
        // Clear file input
        if (e.target) {
            e.target.value = "";
        }
    }
  };

 const getStatusBadge = (status: string) => {
    // console.log('getStatusBadge called with status:', status); // Less verbose
    switch (status) {
      case VerificationStatus.APPROVED:
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case VerificationStatus.REJECTED:
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      case VerificationStatus.PENDING_VERIFICATION:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">Pending</Badge>;
      case VerificationStatus.WAITING_DEMO:
        return <Badge className="bg-blue-500 hover:bg-blue-600">Waiting Demo</Badge>; // Changed color
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
    }
  };


  if (loading && !teachers.length) { // Show loading indicator only on initial load or if teachers array is empty
    return (
      <div className="container mx-auto py-8 text-center">
         <h1 className="text-3xl font-bold mb-6">Teacher Verification Dashboard</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading dashboard...</p>
      </div>
    );
  }
  
  if (error && !teachers.length) { // Show error prominently if loading failed and no teachers are shown
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Teacher Verification Dashboard</h1>
        <Card className="border-red-500">
            <CardHeader>
                <CardTitle className="text-red-600">Loading Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-red-500">{error}</p>
                <Button onClick={loadInitialData} className="mt-4">Try Again</Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Teacher Verification Dashboard</h1>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">An error occurred: {error}</p>}


        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart4 className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                <div className="text-2xl font-bold">{stats.pending}</div>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Waiting Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Video className="mr-2 h-4 w-4 text-blue-500" />
                <div className="text-2xl font-bold">{stats.waiting}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                <div className="text-2xl font-bold">{stats.approved}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                <div className="text-2xl font-bold">{stats.rejected}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading && <div className="text-center py-4"><p>Refreshing data...</p></div>}

        {!loading && teachers.length === 0 && !error ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Video className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-900">No Teachers Awaiting Review</h3>
            <p className="mt-2 text-gray-500">All applicable teachers have been reviewed or none match the current filter.</p>
          </div>
        ) : !loading && teachers.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Demo Video</TableHead>
                  <TableHead>Upload New Video</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      {teacher.first_name} {teacher.last_name}
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.subject || 'N/A'}</TableCell>
                    <TableCell>
                      {teacher.submitted_at
                        ? new Date(teacher.submitted_at).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{getStatusBadge(teacher.verification_status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleWatchVideo(teacher)}
                        disabled={!teacher.video_url && !getTeacherDemoUrl} // Disable if no obvious way to get a URL
                      >
                        <Video className="h-4 w-4" />
                        <span>Watch</span>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="file"
                        accept="video/*,.mkv,.mov,.mp4,.webm" // Common video types
                        onChange={(e) => handleVideoUpload(e, teacher)}
                        className="w-full text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-400 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleApprove(teacher)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-400 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleReject(teacher)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Teacher</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve {selectedTeacher?.first_name}{' '}
                {selectedTeacher?.last_name}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Teacher</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide feedback for why {selectedTeacher?.first_name}{' '}
                {selectedTeacher?.last_name}'s application is being rejected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mb-4">
              <Textarea
                placeholder="Rejection feedback (required)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmReject}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Rejection
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
          <AlertDialogContent className="max-w-3xl"> {/* Adjusted width */}
            <AlertDialogHeader>
              <AlertDialogTitle>
                Demo Video: {selectedTeacher?.first_name} {selectedTeacher?.last_name}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="my-4"> {/* Added margin */}
              {demoUrlToPlay ? (
                <video
                  key={demoUrlToPlay} // Add key to force re-render if URL changes for same dialog
                  src={demoUrlToPlay}
                  controls
                  // type="video/mp4" // Type attribute is often not needed if src is direct link
                  className="w-full rounded-md aspect-video bg-black" // Added bg-black for letterboxing
                  onError={(e) => {
                    console.error('Video playback error:', e);
                    toast({
                      title: 'Video Playback Error',
                      description: 'Failed to play video. Link may be broken or format unsupported.',
                      variant: 'destructive',
                    });
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="p-8 sm:p-12 bg-gray-100 rounded-md text-center">
                  <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg text-gray-700">No demo video available for this teacher.</p>
                  <p className="text-sm text-gray-500 mt-1">The video may not have been uploaded or the link is missing.</p>
                </div>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDemoUrlToPlay(null)}>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  );
};

export default VerificationDashboard;