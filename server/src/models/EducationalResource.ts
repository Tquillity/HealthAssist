import mongoose, { Document, Schema } from 'mongoose';

export interface IEducationalResource extends Document {
  title: string;
  content: string;
  excerpt: string;
  category: 'nutrition' | 'exercise' | 'mental-health' | 'sleep' | 'wellness' | 'meditation' | 'stress-management' | 'hormones' | 'recipes' | 'lifestyle';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number; // in minutes
  author: string;
  imageUrl?: string;
  videoUrl?: string;
  externalUrl?: string;
  isExternal: boolean;
  isActive: boolean;
  featured: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const EducationalResourceSchema = new Schema<IEducationalResource>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['nutrition', 'exercise', 'mental-health', 'sleep', 'wellness', 'meditation', 'stress-management', 'hormones', 'recipes', 'lifestyle']
  },
  tags: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  readTime: {
    type: Number,
    required: true,
    min: 1
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  externalUrl: {
    type: String,
    trim: true
  },
  isExternal: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
EducationalResourceSchema.index({ category: 1, isActive: 1 });
EducationalResourceSchema.index({ featured: 1, isActive: 1 });
EducationalResourceSchema.index({ tags: 1 });
EducationalResourceSchema.index({ createdAt: -1 });

export default mongoose.model<IEducationalResource>('EducationalResource', EducationalResourceSchema);
