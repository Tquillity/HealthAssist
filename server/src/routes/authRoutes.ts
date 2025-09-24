import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { z } from 'zod';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  body: z.object({
    username: z.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be less than 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    password: z.string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be less than 100 characters'),
    firstName: z.string()
      .min(1, 'First name is required')
      .max(50, 'First name must be less than 50 characters'),
    lastName: z.string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must be less than 50 characters'),
    householdId: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    username: z.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be less than 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      .optional(),
    email: z.string().email('Invalid email address').optional(),
    profile: z.object({
      firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters').optional(),
      lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters').optional(),
      timezone: z.string().optional(),
    }).optional(),
    preferences: z.object({
      theme: z.enum(['light', 'dark', 'auto']).optional(),
      notifications: z.boolean().optional(),
    }).optional(),
  }),
});

const householdParamsSchema = z.object({
  params: z.object({
    householdId: z.string().min(1, 'Household ID is required'),
  }),
});

// Register new user
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, householdId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      householdId: householdId || `household_${Date.now()}`,
      profile: {
        firstName,
        lastName,
        timezone: 'UTC'
      }
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, householdId: user.householdId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        householdId: user.householdId,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user has a password (not an OAuth user)
    if (!user.password) {
      return res.status(401).json({ message: 'Please use OAuth sign-in for this account' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, householdId: user.householdId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        householdId: user.householdId,
        profile: user.profile,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, validate(updateProfileSchema), async (req: AuthRequest, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Get household members
router.get('/household/:householdId', authenticateToken, validate(householdParamsSchema), async (req: AuthRequest, res) => {
  try {
    const { householdId } = req.params;
    
    if (req.user.householdId !== householdId) {
      return res.status(403).json({ message: 'Access denied to this household' });
    }

    const members = await User.find({ householdId })
      .select('username email profile preferences createdAt')
      .sort({ createdAt: 1 });

    res.json(members);
  } catch (error) {
    console.error('Household members fetch error:', error);
    res.status(500).json({ message: 'Server error fetching household members' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req: any, res) => {
    try {
      const user = req.user;
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, householdId: user.householdId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user._id,
        username: user.username,
        email: user.email,
        householdId: user.householdId,
        profile: user.profile
      }))}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
    }
  }
);

// X (Twitter) OAuth routes
router.get('/x', passport.authenticate('twitter', {
  scope: ['tweet.read', 'users.read']
}));

router.get('/x/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  async (req: any, res) => {
    try {
      const user = req.user;
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, householdId: user.householdId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user._id,
        username: user.username,
        email: user.email,
        householdId: user.householdId,
        profile: user.profile
      }))}`);
    } catch (error) {
      console.error('X OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
    }
  }
);

export default router;
