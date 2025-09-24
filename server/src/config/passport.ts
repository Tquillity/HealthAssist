import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User';

// Import TwitterStrategy with type assertion
const TwitterStrategy = require('passport-twitter-oauth2').Strategy;

// Google OAuth Strategy (only if environment variables are set)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }

    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails?.[0]?.value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.profile.avatar = profile.photos?.[0]?.value;
      await user.save();
      return done(null, user);
    }

    // Create new user
    const newUser = new User({
      username: profile.displayName?.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).substr(2, 5),
      email: profile.emails?.[0]?.value,
      googleId: profile.id,
      householdId: `household_${Date.now()}`,
      profile: {
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
        avatar: profile.photos?.[0]?.value,
        timezone: 'UTC'
      }
    });

    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error, false);
  }
  }));
}

// X (Twitter) OAuth Strategy (only if environment variables are set)
if (process.env.X_CLIENT_ID && process.env.X_CLIENT_SECRET) {
  passport.use(new TwitterStrategy({
    clientID: process.env.X_CLIENT_ID,
    clientSecret: process.env.X_CLIENT_SECRET,
    callbackURL: process.env.X_CALLBACK_URL || '/api/auth/x/callback'
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Check if user already exists with this X ID
      let user = await User.findOne({ xId: profile.id });
      
      if (user) {
        return done(null, user);
      }

      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails?.[0]?.value });
      
      if (user) {
        // Link X account to existing user
        user.xId = profile.id;
        user.profile.avatar = profile.photos?.[0]?.value;
        await user.save();
        return done(null, user);
      }

      // Create new user
      const newUser = new User({
        username: profile.username || profile.displayName?.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).substr(2, 5),
        email: profile.emails?.[0]?.value || `${profile.username}@x.placeholder`,
        xId: profile.id,
        householdId: `household_${Date.now()}`,
        profile: {
          firstName: profile.displayName?.split(' ')[0] || profile.username || '',
          lastName: profile.displayName?.split(' ').slice(1).join(' ') || '',
          avatar: profile.photos?.[0]?.value,
          timezone: 'UTC'
        }
      });

      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      return done(error, false);
    }
  }));
}

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.userId);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;
