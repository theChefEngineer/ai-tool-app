/*
  # User Profiles and History Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `full_name` (text, computed)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `paraphrase_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `original_text` (text)
      - `paraphrased_text` (text)
      - `mode` (text)
      - `readability_score` (integer)
      - `improvements` (jsonb)
      - `created_at` (timestamp)
    
    - `summary_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `original_text` (text)
      - `summary_text` (text)
      - `mode` (text)
      - `compression_ratio` (integer)
      - `key_points` (jsonb)
      - `created_at` (timestamp)
    
    - `translation_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `original_text` (text)
      - `translated_text` (text)
      - `source_language` (text)
      - `target_language` (text)
      - `detected_language` (text)
      - `confidence` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add function to automatically update full_name
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  full_name text GENERATED ALWAYS AS (
    CASE 
      WHEN first_name = '' AND last_name = '' THEN ''
      WHEN first_name = '' THEN last_name
      WHEN last_name = '' THEN first_name
      ELSE first_name || ' ' || last_name
    END
  ) STORED,
  email text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create paraphrase_history table
CREATE TABLE IF NOT EXISTS paraphrase_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_text text NOT NULL,
  paraphrased_text text NOT NULL,
  mode text NOT NULL DEFAULT 'standard',
  readability_score integer DEFAULT 7,
  improvements jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create summary_history table
CREATE TABLE IF NOT EXISTS summary_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_text text NOT NULL,
  summary_text text NOT NULL,
  mode text NOT NULL DEFAULT 'comprehensive',
  compression_ratio integer DEFAULT 50,
  key_points jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create translation_history table
CREATE TABLE IF NOT EXISTS translation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_text text NOT NULL,
  translated_text text NOT NULL,
  source_language text NOT NULL,
  target_language text NOT NULL,
  detected_language text DEFAULT '',
  confidence integer DEFAULT 95,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE paraphrase_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE summary_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for paraphrase_history
CREATE POLICY "Users can view own paraphrase history"
  ON paraphrase_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own paraphrase history"
  ON paraphrase_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own paraphrase history"
  ON paraphrase_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for summary_history
CREATE POLICY "Users can view own summary history"
  ON summary_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own summary history"
  ON summary_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own summary history"
  ON summary_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for translation_history
CREATE POLICY "Users can view own translation history"
  ON translation_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own translation history"
  ON translation_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own translation history"
  ON translation_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_profiles updated_at
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_paraphrase_history_user_id ON paraphrase_history(user_id);
CREATE INDEX IF NOT EXISTS idx_paraphrase_history_created_at ON paraphrase_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_summary_history_user_id ON summary_history(user_id);
CREATE INDEX IF NOT EXISTS idx_summary_history_created_at ON summary_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_translation_history_user_id ON translation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_translation_history_created_at ON translation_history(created_at DESC);