import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { UploadCloud, Video, X } from 'lucide-react';
import { uploadTeacherDemo } from '@/lib/supabase/verification';
import { Profile } from '@/lib/supabase/types';

interface TeacherDemoUploadProps {
  profile: Profile;
  onUploadComplete?: () => void;
}

const TeacherDemoUpload = ({ profile, onUploadComplete }: TeacherDemoUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Store the uploaded video URL

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('video/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a video file',
        variant: 'destructive',
      });
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Video must be less than 100MB',
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);
    setVideoUrl(null); // Reset video URL when a new file is selected
  };

  const handleUpload = async () => {
    if (!file || !profile.id) {
      toast({
        title: 'Missing Information',
        description: 'Please select a file and ensure your profile ID is available.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      console.log('Attempting to upload demo for teacher ID:', profile.id);

      const publicVideoUrl = await uploadTeacherDemo(profile.id, file);

      if (publicVideoUrl) {
        setVideoUrl(publicVideoUrl); // Store the URL to display the video
        setFile(null);
        console.log('Upload completed successfully. Public URL:', publicVideoUrl);

        toast({
          title: 'Upload Successful',
          description: 'Your demo video has been uploaded. You can preview it below.',
          variant: 'success',
        });

        if (onUploadComplete) {
          onUploadComplete();
        }
      } else {
        toast({
          title: 'Upload Failed',
          description: 'Could not get a valid public URL for the video.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error in TeacherDemoUpload component during upload:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'There was a problem uploading your demo video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Video Upload</CardTitle>
        <CardDescription>
          Upload a teaching demo video to verify your teaching skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Video className="h-8 w-8 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload Demo
                  </>
                )}
              </Button>
            </div>
          ) : videoUrl ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <Video className="h-12 w-12 text-blue-500 mb-2" />
                <h3 className="text-lg font-medium">Video Uploaded</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                  Your demo video has been uploaded successfully.
                </p>
                <video
                  src={videoUrl}
                  controls
                  className="mt-4 w-full max-w-md rounded-lg"
                  onError={(e) => {
                    console.error('Video playback error:', e);
                    toast({
                      title: 'Playback Error',
                      description: 'Unable to play the video. The format may be unsupported or the URL is invalid.',
                      variant: 'destructive',
                    });
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <Button
                type="button"
                onClick={triggerFileInputClick}
                variant="outline"
              >
                Upload Another Video
              </Button>
              <input
                ref={fileInputRef}
                id="demo-upload"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <Video className="h-12 w-12 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium">Upload your teaching demo</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                  Drag and drop your video or click to browse. Maximum size 100MB.
                </p>
              </div>
              <div>
                <Button
                  type="button"
                  onClick={triggerFileInputClick}
                >
                  Select Video
                </Button>
                <input
                  ref={fileInputRef}
                  id="demo-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p className="font-medium">Tips for a good demo:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Keep your demo under 5 minutes</li>
            <li>Clearly show your teaching style and methods</li>
            <li>Demonstrate how you explain complex concepts</li>
            <li>Ensure good audio and video quality</li>
            <li>Use MP4 format with H.264 codec for best compatibility</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherDemoUpload;