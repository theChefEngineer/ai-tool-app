# Google Authentication Setup Guide

## Current Status
Google OAuth is not yet configured in your Supabase project. The authentication system will gracefully handle this and show users an informative message.

## To Enable Google Authentication:

### 1. Set up Google OAuth Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set the application type to "Web application"
6. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:5173/auth/callback` (for development)

### 2. Configure Supabase
1. Go to your Supabase Dashboard
2. Navigate to Authentication → Providers
3. Enable Google provider
4. Add your Google OAuth credentials:
   - Client ID (from Google Cloud Console)
   - Client Secret (from Google Cloud Console)
5. Save the configuration

### 3. Update Environment Variables
Add to your `.env` file:
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 4. Test the Integration
1. The Google Sign-In button will automatically become available
2. Users can sign in with their Google accounts
3. The system handles both new user registration and existing user login

## Current Behavior
- Google Sign-In button shows a configuration message
- Users can still use email/password authentication
- The system gracefully handles the missing Google OAuth configuration
- No errors or crashes occur

## Security Features
- Secure OAuth 2.0 flow with PKCE
- Automatic token management via Supabase
- Proper error handling and user feedback
- Session persistence across app restarts

Once you complete the Google OAuth setup in Supabase, the Google Sign-In functionality will work seamlessly!