# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Health & Wellness Hub application.

## Prerequisites

- Google Cloud Console account
- Access to create OAuth 2.0 credentials

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

## Step 2: Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: Health & Wellness Hub
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. Save and continue

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Configure the application:
   - **Name**: Health & Wellness Hub
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (for development)
     - Your production domain (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)

## Step 4: Configure Environment Variables

### Server Environment (.env)

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Secret for OAuth
SESSION_SECRET=your-session-secret-key-here
```

### Client Environment (.env)

```bash
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
```

## Step 5: Test the Implementation

1. Start the server:
   ```bash
   cd server && npm run dev
   ```

2. Start the client:
   ```bash
   cd client && npm start
   ```

3. Navigate to `http://localhost:3000/login`
4. Click "Continue with Google"
5. Complete the OAuth flow

## Features Implemented

✅ **Google OAuth Integration**
- Seamless login with Google accounts
- Automatic user creation for new Google users
- Account linking for existing users
- Profile picture integration
- Secure JWT token generation

✅ **User Experience**
- "Continue with Google" buttons on login and register pages
- Automatic redirect after successful authentication
- Error handling for OAuth failures
- Loading states during authentication

✅ **Security**
- Secure session management
- JWT token authentication
- CORS configuration
- Environment variable protection

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Ensure the redirect URI in Google Console matches your server callback URL
   - Check that the URL is exactly the same (including http/https)

2. **"invalid_client" error**
   - Verify your Google Client ID and Secret are correct
   - Ensure the environment variables are properly set

3. **CORS errors**
   - Check that CLIENT_URL in server .env matches your frontend URL
   - Ensure credentials: true is set in CORS configuration

### Development vs Production

- **Development**: Use `http://localhost:3000` and `http://localhost:5000`
- **Production**: Update URLs to your actual domain
- **HTTPS**: Google OAuth requires HTTPS in production

## Security Notes

- Never commit your Google Client Secret to version control
- Use environment variables for all sensitive configuration
- Rotate your secrets regularly
- Monitor OAuth usage in Google Cloud Console

## Next Steps

After setting up Google OAuth:

1. Test the authentication flow thoroughly
2. Set up production environment variables
3. Configure production redirect URIs
4. Monitor authentication logs
5. Consider implementing additional OAuth providers (Facebook, GitHub, etc.)

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify environment variables are loaded correctly
3. Test the OAuth flow in Google Cloud Console
4. Check server logs for authentication errors
