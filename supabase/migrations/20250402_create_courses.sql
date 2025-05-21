
-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Teachers can insert courses"
  ON courses FOR INSERT
  WITH CHECK (auth.uid() = instructor_id AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'teacher'
  ));

CREATE POLICY "Teachers can update their own courses"
  ON courses FOR UPDATE
  USING (auth.uid() = instructor_id);

CREATE POLICY "Teachers can delete their own courses"
  ON courses FOR DELETE
  USING (auth.uid() = instructor_id);
