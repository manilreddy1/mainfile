
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Video } from 'lucide-react';
import { Profile } from '@/lib/supabase/types';

interface TeacherUploadReminderProps {
  profile: Profile;
}

const TeacherUploadReminder = ({ profile }: TeacherUploadReminderProps) => {
  if (profile.user_type !== 'teacher' || 
      profile.verification_status !== 'waiting_demo') {
    return null;
  }

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-amber-700">
          <AlertCircle className="mr-2 h-5 w-5" />
          Action Required: Upload Teaching Demo
        </CardTitle>
        <CardDescription className="text-amber-600">
          Your account is pending verification
        </CardDescription>
      </CardHeader>
      <CardContent className="text-amber-700">
        <p>
          To complete your teacher registration, please upload a short demo video
          showcasing your teaching style and methods. This will help us verify your
          teaching credentials.
        </p>
      </CardContent>
      <CardFooter>
        <Link to="/upload-demo">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Video className="mr-2 h-4 w-4" />
            Upload Demo Video
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TeacherUploadReminder;
