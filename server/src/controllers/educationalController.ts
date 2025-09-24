import { Request, Response } from 'express';
import * as educationalService from '../services/educationalService';

// Create educational resource
export const createEducationalResource = async (req: Request, res: Response) => {
  try {
    const resource = await educationalService.createEducationalResource(req.body);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating educational resource:', error);
    res.status(500).json({ message: 'Server error creating educational resource' });
  }
};

// Get all educational resources
export const getEducationalResources = async (req: Request, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string,
      difficulty: req.query.difficulty as string,
      tags: Array.isArray(req.query.tags) ? req.query.tags as string[] : req.query.tags as string,
      featured: req.query.featured as string,
      search: req.query.search as string,
      limit: parseInt(req.query.limit as string) || 20,
      page: parseInt(req.query.page as string) || 1
    };
    
    const result = await educationalService.getEducationalResources(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching educational resources:', error);
    res.status(500).json({ message: 'Server error fetching educational resources' });
  }
};

// Get educational resource by ID
export const getEducationalResourceById = async (req: Request, res: Response) => {
  try {
    const resource = await educationalService.getEducationalResourceById(req.params.id);
    res.json(resource);
  } catch (error) {
    console.error('Error fetching educational resource:', error);
    if (error instanceof Error && error.message === 'Educational resource not found') {
      return res.status(404).json({ message: 'Educational resource not found' });
    }
    res.status(500).json({ message: 'Server error fetching educational resource' });
  }
};

// Update educational resource
export const updateEducationalResource = async (req: Request, res: Response) => {
  try {
    const resource = await educationalService.updateEducationalResource(req.params.id, req.body);
    res.json(resource);
  } catch (error) {
    console.error('Error updating educational resource:', error);
    if (error instanceof Error && error.message === 'Educational resource not found') {
      return res.status(404).json({ message: 'Educational resource not found' });
    }
    res.status(500).json({ message: 'Server error updating educational resource' });
  }
};

// Delete educational resource
export const deleteEducationalResource = async (req: Request, res: Response) => {
  try {
    const result = await educationalService.deleteEducationalResource(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting educational resource:', error);
    if (error instanceof Error && error.message === 'Educational resource not found') {
      return res.status(404).json({ message: 'Educational resource not found' });
    }
    res.status(500).json({ message: 'Server error deleting educational resource' });
  }
};

// Get featured educational resources
export const getFeaturedEducationalResources = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const resources = await educationalService.getFeaturedEducationalResources(limit);
    res.json(resources);
  } catch (error) {
    console.error('Error fetching featured educational resources:', error);
    res.status(500).json({ message: 'Server error fetching featured educational resources' });
  }
};

// Like educational resource
export const likeEducationalResource = async (req: Request, res: Response) => {
  try {
    const result = await educationalService.likeEducationalResource(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error liking educational resource:', error);
    if (error instanceof Error && error.message === 'Educational resource not found') {
      return res.status(404).json({ message: 'Educational resource not found' });
    }
    res.status(500).json({ message: 'Server error liking educational resource' });
  }
};

// Get educational resource metadata
export const getEducationalResourceMetadata = async (req: Request, res: Response) => {
  try {
    const metadata = await educationalService.getEducationalResourceMetadata();
    res.json(metadata);
  } catch (error) {
    console.error('Error fetching educational resource metadata:', error);
    res.status(500).json({ message: 'Server error fetching educational resource metadata' });
  }
};
