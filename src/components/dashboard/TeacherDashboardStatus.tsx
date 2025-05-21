
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Profile } from "@/lib/supabase/types";

interface TeacherDashboardStatusProps {
  profile: Profile;
}

const TeacherDashboardStatus = ({ profile }: TeacherDashboardStatusProps) => {
  if (!profile || profile.user_type !== 'teacher') return null;

  if (profile.verification_status === 'waiting_demo') {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Demo Video Required</AlertTitle>
        <AlertDescription>
          Please upload your teaching demo video to activate your teacher dashboard.
          <a href="/upload-demo" className="ml-2 underline font-medium">
            Upload Now
          </a>
        </AlertDescription>
      </Alert>
    );
  }

  if (profile.verification_status === 'pending_verification') {
    return (
      <Alert className="mb-6 border-yellow-200 bg-yellow-50 text-yellow-800">
        <Clock className="h-4 w-4" />
        <AlertTitle>Verification in Progress</AlertTitle>
        <AlertDescription>
          Your demo has been submitted and is being reviewed by our team. You'll have full access to the teaching dashboard once approved.
        </AlertDescription>
      </Alert>
    );
  }

  if (profile.verification_status === 'rejected') {
    return (
      <Alert variant="destructive" className="mb-6">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Verification Failed</AlertTitle>
        <AlertDescription>
          Unfortunately, your teaching demo did not meet our requirements. 
          <a href="/upload-demo" className="ml-2 underline font-medium">
            Submit a New Demo
          </a>
        </AlertDescription>
      </Alert>
    );
  }

  if (profile.verification_status === 'approved') {
    return (
      <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Verified Teacher</AlertTitle>
        <AlertDescription>
          Your teaching account has been verified. You have full access to all teaching features.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default TeacherDashboardStatus;
