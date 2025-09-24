import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string; // Optional for OAuth users
  householdId: string;
  googleId?: string; // Google OAuth ID
  xId?: string; // X (Twitter) OAuth ID
  preferences: {
    energy: 'low' | 'medium' | 'high';
    preferredContext: 'morning' | 'evening' | 'anytime';
    routineDuration: '5min' | '15min' | '30min' | '60min';
    dietaryRestrictions: string[];
    healthGoals: string[];
  };
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    timezone: string;
    avatar?: string; // Google profile picture
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId && !this.xId; // Only required if not using OAuth
    },
    minlength: 6
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  xId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  householdId: {
    type: String,
    required: true
  },
  preferences: {
    energy: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    preferredContext: {
      type: String,
      enum: ['morning', 'evening', 'anytime'],
      default: 'anytime'
    },
    routineDuration: {
      type: String,
      enum: ['5min', '15min', '30min', '60min'],
      default: '15min'
    },
    dietaryRestrictions: [{
      type: String,
      trim: true
    }],
    healthGoals: [{
      type: String,
      trim: true
    }]
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    avatar: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Index for household queries
UserSchema.index({ householdId: 1 });

export default mongoose.model<IUser>('User', UserSchema);
