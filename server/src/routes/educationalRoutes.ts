import express from 'express';
import { Request, Response } from 'express';
import * as educationalService from '../services/educationalService';
import { authenticateToken } from '../middleware/auth';

const router: express.Router = express.Router();

// Get all educational resources (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string,
      difficulty: req.query.difficulty as string,
      tags: Array.isArray(req.query.tags)
        ? (req.query.tags as string[])
        : (req.query.tags as string),
      featured: req.query.featured as string,
      search: req.query.search as string,
      limit: parseInt(req.query.limit as string) || 20,
      page: parseInt(req.query.page as string) || 1,
    };

    const result = await educationalService.getEducationalResources(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching educational resources:', error);
    res.status(500).json({ error: 'Failed to fetch educational resources' });
  }
});

// Get featured resources
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const resources =
      await educationalService.getFeaturedEducationalResources(limit);
    res.json(resources);
  } catch (error) {
    console.error('Error fetching featured resources:', error);
    res.status(500).json({ error: 'Failed to fetch featured resources' });
  }
});

// Get resource by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const resource = await educationalService.getEducationalResourceById(
      req.params.id
    );
    res.json(resource);
  } catch (error) {
    console.error('Error fetching educational resource:', error);
    if (
      error instanceof Error &&
      error.message === 'Educational resource not found'
    ) {
      return res.status(404).json({ error: 'Educational resource not found' });
    }
    res.status(500).json({ error: 'Failed to fetch educational resource' });
  }
});

// Get categories and metadata
router.get('/meta/categories', async (req: Request, res: Response) => {
  try {
    const metadata = await educationalService.getEducationalResourceMetadata();
    res.json(metadata);
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

// Like a resource (authenticated)
router.post(
  '/:id/like',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const result = await educationalService.likeEducationalResource(
        req.params.id
      );
      res.json({
        message: 'Resource liked successfully',
        likeCount: result.likeCount,
      });
    } catch (error) {
      console.error('Error liking resource:', error);
      if (
        error instanceof Error &&
        error.message === 'Educational resource not found'
      ) {
        return res
          .status(404)
          .json({ error: 'Educational resource not found' });
      }
      res.status(500).json({ error: 'Failed to like resource' });
    }
  }
);

// Create educational resource (admin only - for now, any authenticated user)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const resourceData = {
      ...req.body,
      author: (req as AuthRequest).user.username || 'Admin',
    };

    const resource =
      await educationalService.createEducationalResource(resourceData);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating educational resource:', error);
    res.status(500).json({ error: 'Failed to create educational resource' });
  }
});

// Update educational resource (admin only)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const resource = await educationalService.updateEducationalResource(
      req.params.id,
      req.body
    );
    res.json(resource);
  } catch (error) {
    console.error('Error updating educational resource:', error);
    if (
      error instanceof Error &&
      error.message === 'Educational resource not found'
    ) {
      return res.status(404).json({ error: 'Educational resource not found' });
    }
    res.status(500).json({ error: 'Failed to update educational resource' });
  }
});

// Delete educational resource (admin only)
router.delete(
  '/:id',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const result = await educationalService.deleteEducationalResource(
        req.params.id
      );
      res.json(result);
    } catch (error) {
      console.error('Error deleting educational resource:', error);
      if (
        error instanceof Error &&
        error.message === 'Educational resource not found'
      ) {
        return res
          .status(404)
          .json({ error: 'Educational resource not found' });
      }
      res.status(500).json({ error: 'Failed to delete educational resource' });
    }
  }
);

export default router;
