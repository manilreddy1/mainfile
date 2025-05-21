
-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat_files', 'Chat Files', true);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat_files');

-- Create policy to allow users to select their own files
CREATE POLICY "Allow users to select their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'chat_files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to make chat files publicly accessible for download
CREATE POLICY "Chat files are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'chat_files');
