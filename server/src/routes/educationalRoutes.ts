import express from 'express';
import { Request, Response } from 'express';
import EducationalResource from '../models/EducationalResource';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all educational resources (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      difficulty, 
      tags, 
      featured, 
      search,
      limit = 20, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    
    const resources = await EducationalResource.find(query)
      .select('-content') // Exclude full content for list view
      .sort(sort)
      .limit(Number(limit))
      .skip(skip);

    const total = await EducationalResource.countDocuments(query);

    res.json({
      resources,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching educational resources:', error);
    res.status(500).json({ error: 'Failed to fetch educational resources' });
  }
});

// Get featured resources
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const { limit = 6 } = req.query;
    
    const resources = await EducationalResource.find({ 
      isActive: true, 
      featured: true 
    })
    .select('-content')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

    res.json(resources);
  } catch (error) {
    console.error('Error fetching featured resources:', error);
    res.status(500).json({ error: 'Failed to fetch featured resources' });
  }
});

// Get resource by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const resource = await EducationalResource.findById(req.params.id);
    
    if (!resource || !resource.isActive) {
      return res.status(404).json({ error: 'Educational resource not found' });
    }

    // Increment view count
    await EducationalResource.findByIdAndUpdate(req.params.id, {
      $inc: { viewCount: 1 }
    });

    res.json(resource);
  } catch (error) {
    console.error('Error fetching educational resource:', error);
    res.status(500).json({ error: 'Failed to fetch educational resource' });
  }
});

// Get categories and metadata
router.get('/meta/categories', async (req: Request, res: Response) => {
  try {
    const categories = await EducationalResource.distinct('category', { isActive: true });
    const difficulties = await EducationalResource.distinct('difficulty', { isActive: true });
    const allTags = await EducationalResource.distinct('tags', { isActive: true });
    
    res.json({
      categories,
      difficulties,
      tags: allTags.filter(tag => tag && tag.trim().length > 0)
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

// Like a resource (authenticated)
router.post('/:id/like', authenticateToken, async (req: Request, res: Response) => {
  try {
    const resource = await EducationalResource.findByIdAndUpdate(
      req.params.id,
      { $inc: { likeCount: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ error: 'Educational resource not found' });
    }

    res.json({ 
      message: 'Resource liked successfully',
      likeCount: resource.likeCount 
    });
  } catch (error) {
    console.error('Error liking resource:', error);
    res.status(500).json({ error: 'Failed to like resource' });
  }
});

// Create educational resource (admin only - for now, any authenticated user)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const resourceData = {
      ...req.body,
      author: (req as any).user.username || 'Admin'
    };

    const resource = new EducationalResource(resourceData);
    await resource.save();

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating educational resource:', error);
    res.status(500).json({ error: 'Failed to create educational resource' });
  }
});

// Update educational resource (admin only)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const resource = await EducationalResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ error: 'Educational resource not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error('Error updating educational resource:', error);
    res.status(500).json({ error: 'Failed to update educational resource' });
  }
});

// Delete educational resource (admin only)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const resource = await EducationalResource.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ error: 'Educational resource not found' });
    }

    res.json({ message: 'Educational resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting educational resource:', error);
    res.status(500).json({ error: 'Failed to delete educational resource' });
  }
});

export default router;
