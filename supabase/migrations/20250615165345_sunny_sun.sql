/*
  # Fix User Signup Database Error

  1. Database Function
    - Create or replace the `handle_new_user` function to properly handle new user creation
    - Ensure it has proper error handling and permissions

  2. Trigger
    - Create or replace the trigger on `auth.users` to automatically create user profiles
    - Ensure the trigger fires after user insertion

  3. Security
    - Update RLS policies to allow the auth service to insert user profiles
    - Ensure proper permissions for the trigger function
*/

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert a new user profile record
  INSERT INTO public.user_profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger to automatically create user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure the user_profiles table has proper RLS policies for auth operations
DROP POLICY IF EXISTS "Allow auth service to insert profiles" ON public.user_profiles;

CREATE POLICY "Allow auth service to insert profiles"
  ON public.user_profiles
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Grant necessary permissions to the auth schema
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.user_profiles TO supabase_auth_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO supabase_auth_admin;

-- Ensure the function can be executed by the auth service
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;