# X (Twitter) OAuth Setup Guide

This guide will help you set up X (Twitter) OAuth authentication for your HealthAssist application.

## Prerequisites

- X Developer Account
- X Developer App created
- Environment variables configured

## Step 1: Create X Developer Account

1. Go to [X Developer Portal](https://developer.x.com/)
2. Sign in with your X account
3. Apply for developer access if you haven't already
4. Complete the developer application process

## Step 2: Create X Developer App

1. In the X Developer Portal, go to "Projects & Apps"
2. Click "Create App" or "New Project"
3. Fill in the required information:
   - **App Name**: HealthAssist
   - **App Description**: Health and wellness tracking application
   - **Website URL**: `http://localhost:3000` (for development)
   - **Callback URL**: `http://localhost:5000/api/auth/x/callback`

## Step 3: Configure App Settings

1. In your app settings, go to "Authentication settings"
2. Enable "OAuth 2.0"
3. Set the following URLs:
   - **Callback URL**: `http://localhost:5000/api/auth/x/callback`
   - **Website URL**: `http://localhost:3000`
4. Save the settings

## Step 4: Get API Keys

1. In your app dashboard, go to "Keys and tokens"
2. Copy the following values:
   - **Client ID** (API Key)
   - **Client Secret** (API Secret Key)

## Step 5: Configure Environment Variables

1. Copy `server/env.example` to `server/.env`
2. Add your X OAuth credentials:

```env
# X (Twitter) OAuth Configuration
X_CLIENT_ID=your_actual_client_id_here
X_CLIENT_SECRET=your_actual_client_secret_here
X_CALLBACK_URL=http://localhost:5000/api/auth/x/callback
```

## Step 6: Test the Integration

1. Start your development servers:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend
   cd client && npm start
   ```

2. Navigate to `http://localhost:3000/login`
3. Click the "X" button to test OAuth flow
4. You should be redirected to X for authentication
5. After successful authentication, you'll be redirected back to your app

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Ensure the callback URL in your X app matches exactly: `http://localhost:5000/api/auth/x/callback`
   - Check for typos in the URL

2. **"App not approved for OAuth" error**
   - Make sure your X Developer App has OAuth 2.0 enabled
   - Verify your app is in the correct state (not suspended)

3. **"Client ID not found" error**
   - Double-check your environment variables
   - Ensure the `.env` file is in the correct location (`server/.env`)
   - Restart your server after changing environment variables

4. **"Callback URL mismatch" error**
   - Verify the callback URL in your X app settings
   - Ensure it matches exactly: `http://localhost:5000/api/auth/x/callback`

### Development vs Production

For production deployment:

1. Update your X app settings with production URLs:
   - **Website URL**: `https://yourdomain.com`
   - **Callback URL**: `https://yourdomain.com/api/auth/x/callback`

2. Update your environment variables:
   ```env
   X_CALLBACK_URL=https://yourdomain.com/api/auth/x/callback
   CLIENT_URL=https://yourdomain.com
   ```

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique values for `X_CLIENT_SECRET`
- Regularly rotate your API keys
- Use HTTPS in production
- Implement rate limiting for OAuth endpoints

## X API Rate Limits

Be aware of X API rate limits:
- **OAuth 2.0**: 300 requests per 15-minute window per user
- **User lookup**: 300 requests per 15-minute window per user
- **Profile information**: 300 requests per 15-minute window per user

## Support

If you encounter issues:

1. Check the [X Developer Documentation](https://developer.x.com/en/docs)
2. Verify your app configuration in the X Developer Portal
3. Check your server logs for detailed error messages
4. Ensure all environment variables are correctly set

## Next Steps

After successful X OAuth integration:

1. Test user registration and login flows
2. Verify user profile data is correctly stored
3. Test account linking (if user already exists with same email)
4. Implement proper error handling for OAuth failures
5. Add user-friendly error messages for common issues

## Additional Features

Consider implementing:

- **Account linking**: Allow users to link multiple OAuth providers
- **Profile synchronization**: Sync profile data from X
- **Social features**: Integrate X-specific features if needed
- **Analytics**: Track OAuth usage and success rates
