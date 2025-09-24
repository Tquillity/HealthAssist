import mongoose, { Document, Schema } from 'mongoose';

export interface IJournalEntry extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  mood: {
    rating: number; // 1-10 scale
    notes?: string;
    emotions: string[]; // e.g., ['happy', 'anxious', 'calm']
  };
  energy: {
    rating: number; // 1-10 scale
    notes?: string;
    factors: string[]; // e.g., ['sleep', 'exercise', 'nutrition']
  };
  sleep: {
    hours: number;
    quality: number; // 1-10 scale
    notes?: string;
  };
  exercise: {
    duration: number; // minutes
    type: string;
    intensity: number; // 1-10 scale
    notes?: string;
  };
  nutrition: {
    meals: number;
    water: number; // glasses
    notes?: string;
  };
  stress: {
    rating: number; // 1-10 scale
    sources: string[];
    copingStrategies: string[];
    notes?: string;
  };
  gratitude: {
    entries: string[];
    notes?: string;
  };
  goals: {
    achieved: string[];
    progress: string[];
    notes?: string;
  };
  symptoms: {
    physical: string[];
    mental: string[];
    notes?: string;
  };
  isPrivate: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  mood: {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    notes: String,
    emotions: [String]
  },
  energy: {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    notes: String,
    factors: [String]
  },
  sleep: {
    hours: {
      type: Number,
      min: 0,
      max: 24
    },
    quality: {
      type: Number,
      min: 1,
      max: 10
    },
    notes: String
  },
  exercise: {
    duration: {
      type: Number,
      min: 0
    },
    type: String,
    intensity: {
      type: Number,
      min: 1,
      max: 10
    },
    notes: String
  },
  nutrition: {
    meals: {
      type: Number,
      min: 0
    },
    water: {
      type: Number,
      min: 0
    },
    notes: String
  },
  stress: {
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    sources: [String],
    copingStrategies: [String],
    notes: String
  },
  gratitude: {
    entries: [String],
    notes: String
  },
  goals: {
    achieved: [String],
    progress: [String],
    notes: String
  },
  symptoms: {
    physical: [String],
    mental: [String],
    notes: String
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Compound index for efficient queries
JournalEntrySchema.index({ userId: 1, date: -1 });
JournalEntrySchema.index({ userId: 1, date: 1 });

export default mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);
