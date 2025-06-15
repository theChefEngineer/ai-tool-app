/*
  # Create user_usage table for tracking daily operations

  1. New Tables
    - `user_usage`
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (date, for tracking daily usage)
      - `operations` (integer, count of operations performed)
      - `updated_at` (timestamp, last update time)
      - Composite primary key on (user_id, date)

  2. Security
    - Enable RLS on `user_usage` table
    - Add policies for users to manage their own usage data
    - Users can SELECT, INSERT, and UPDATE their own usage records

  3. Indexes
    - Primary key index on (user_id, date)
    - Additional index on user_id for faster lookups
*/

CREATE TABLE IF NOT EXISTS public.user_usage (
    user_id uuid NOT NULL,
    date date NOT NULL,
    operations integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_usage_pkey PRIMARY KEY (user_id, date),
    CONSTRAINT user_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for user access control
CREATE POLICY "Users can view their own usage" 
  ON public.user_usage
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
  ON public.user_usage
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
  ON public.user_usage
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id 
  ON public.user_usage USING btree (user_id);

CREATE INDEX IF NOT EXISTS idx_user_usage_date 
  ON public.user_usage USING btree (date DESC);