# ParaText Pro - AI-Powered Writing Assistant

A comprehensive AI-powered writing assistant built with React, TypeScript, and Supabase.

## Features

- **AI Paraphrasing**: Multiple writing styles (standard, formal, creative, shorten, expand)
- **Text Summarization**: Comprehensive, executive, academic, bullet points, and quick summaries
- **Translation**: Multi-language translation with auto-detection
- **Grammar Checking**: Advanced grammar and style analysis
- **Document Transcription**: AI-powered text extraction from PDF, DOC, DOCX files
- **AI Content Detection**: Detect and humanize AI-generated content
- **Plagiarism Detection**: Advanced plagiarism analysis
- **Chat Assistant**: Interactive AI writing assistant
- **History Management**: Track and manage all your writing activities
- **Premium Subscriptions**: Stripe-powered subscription management

## Configuration Requirements

### 1. Supabase Setup

1. Create a new Supabase project
2. Copy your project URL and anon key to `.env`
3. **CRITICAL**: Set your Site URL in Supabase Dashboard → Authentication → URL Configuration:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

### 2. Google OAuth Configuration

For Google Sign-In to work properly:

1. **Google Cloud Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create/select your project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - **CRITICAL**: Add the correct redirect URI:
     ```
     https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
     ```

2. **Supabase Configuration**:
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth Client ID and Secret

3. **Environment Variables**:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

### 3. Port Configuration

The development server runs on port 3000 to match Supabase configuration:

```bash
npm run dev  # Runs on http://localhost:3000
```

## Common Issues & Solutions

### Google OAuth Errors

**Problem**: "Invalid Refresh Token: Refresh Token Not Found"
**Solution**: 
1. Check that your Google Cloud Console redirect URI matches exactly:
   `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
2. Ensure Supabase Site URL is set to `http://localhost:3000` for development

**Problem**: "ERR_CONNECTION_REFUSED"
**Solution**: 
1. Ensure the dev server is running: `npm run dev`
2. Check that the server is running on port 3000

**Problem**: Stuck on redirect after Google login
**Solution**:
1. Verify port configuration matches between Supabase and Vite
2. Clear browser cache and localStorage
3. Check browser console for authentication errors

### Authentication Flow

The app handles authentication through these steps:
1. User initiates Google OAuth
2. Redirected to Google for authentication
3. Google redirects to Supabase callback URL
4. Supabase processes the authentication
5. User redirected to `/auth/callback` in the app
6. App processes the session and redirects to main interface

## Development

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Database Schema

The app uses Supabase with the following main tables:
- `user_profiles` - User profile information
- `paraphrase_history` - Paraphrasing activity history
- `summary_history` - Summarization activity history
- `translation_history` - Translation activity history
- `user_usage` - Daily usage tracking
- `stripe_customers` - Stripe customer data
- `stripe_subscriptions` - Subscription management
- `stripe_orders` - Order tracking

## Deployment

The app is configured for deployment on Netlify with automatic builds from the main branch.

## Support

For configuration issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Supabase and Google Cloud Console configurations match
4. Clear browser cache and localStorage if experiencing auth issues