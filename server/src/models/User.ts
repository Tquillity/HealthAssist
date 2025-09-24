import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  householdId: string;
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
    required: true,
    minlength: 6
  },
  householdId: {
    type: String,
    required: true,
    index: true
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
    }
  }
}, {
  timestamps: true
});

// Index for household queries
UserSchema.index({ householdId: 1 });

export default mongoose.model<IUser>('User', UserSchema);
