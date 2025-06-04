/*
  # Create interviews schema

  1. New Tables
    - `interviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `job_role` (text)
      - `experience_level` (text)
      - `questions` (jsonb array)
      - `answers` (jsonb array)
      - `video_url` (text)
      - `overall_score` (integer)
      - `feedback` (jsonb)
      - `created_at` (timestamp with time zone)
    
  2. Security
    - Enable RLS on interviews table
    - Add policies for authenticated users to:
      - Create their own interviews
      - Read their own interviews
      - Update their own interviews
*/

CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  job_role text NOT NULL,
  experience_level text NOT NULL,
  questions jsonb[] NOT NULL DEFAULT '{}',
  answers jsonb[] NOT NULL DEFAULT '{}',
  video_url text,
  overall_score integer,
  feedback jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own interviews"
  ON interviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interviews"
  ON interviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own interviews"
  ON interviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);