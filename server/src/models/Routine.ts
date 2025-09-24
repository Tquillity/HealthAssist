import mongoose, { Document, Schema } from 'mongoose';

export interface IRoutine extends Document {
  title: string;
  description: string;
  imageUrl: string;
  category: 'breathwork' | 'meditation' | 'exercise' | 'stretching' | 'mindfulness' | 'sleep' | 'energy';
  metadata: {
    context: 'morning' | 'evening' | 'anytime';
    energy: 'low' | 'medium' | 'high';
    duration: '5min' | '15min' | '30min' | '60min';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    equipment: string[];
    tags: string[];
  };
  instructions: {
    steps: Array<{
      step: number;
      title: string;
      description: string;
      duration?: string;
      imageUrl?: string;
    }>;
    tips: string[];
    contraindications: string[];
  };
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoutineSchema = new Schema<IRoutine>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['breathwork', 'meditation', 'exercise', 'stretching', 'mindfulness', 'sleep', 'energy']
  },
  metadata: {
    context: {
      type: String,
      required: true,
      enum: ['morning', 'evening', 'anytime']
    },
    energy: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high']
    },
    duration: {
      type: String,
      required: true,
      enum: ['5min', '15min', '30min', '60min']
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    equipment: [{
      type: String,
      trim: true
    }],
    tags: [{
      type: String,
      trim: true
    }]
  },
  instructions: {
    steps: [{
      step: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      duration: {
        type: String,
        trim: true
      },
      imageUrl: {
        type: String,
        trim: true
      }
    }],
    tips: [{
      type: String,
      trim: true
    }],
    contraindications: [{
      type: String,
      trim: true
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
RoutineSchema.index({ category: 1, 'metadata.context': 1, 'metadata.energy': 1 });
RoutineSchema.index({ isActive: 1 });

export default mongoose.model<IRoutine>('Routine', RoutineSchema);
