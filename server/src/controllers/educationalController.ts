import { Request, Response } from 'express';
import EducationalResource from '../models/EducationalResource';

// Create educational resource
export const createEducationalResource = async (req: Request, res: Response) => {
  try {
    const resource = new EducationalResource(req.body);
    await resource.save();
    
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating educational resource:', error);
    res.status(500).json({ message: 'Server error creating educational resource' });
  }
};

// Get all educational resources
export const getEducationalResources = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      difficulty, 
      tags, 
      featured, 
      search, 
      limit = 20, 
      page = 1 
    } = req.query;
    
    let query: any = { isActive: true };
    
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
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const resources = await EducationalResource.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));
    
    const total = await EducationalResource.countDocuments(query);
    
    res.json({
      resources,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching educational resources:', error);
    res.status(500).json({ message: 'Server error fetching educational resources' });
  }
};

// Get educational resource by ID
export const getEducationalResourceById = async (req: Request, res: Response) => {
  try {
    const resource = await EducationalResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Educational resource not found' });
    }
    
    // Increment view count
    resource.viewCount += 1;
    await resource.save();
    
    res.json(resource);
  } catch (error) {
    console.error('Error fetching educational resource:', error);
    res.status(500).json({ message: 'Server error fetching educational resource' });
  }
};

// Update educational resource
export const updateEducationalResource = async (req: Request, res: Response) => {
  try {
    const resource = await EducationalResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!resource) {
      return res.status(404).json({ message: 'Educational resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Error updating educational resource:', error);
    res.status(500).json({ message: 'Server error updating educational resource' });
  }
};

// Delete educational resource
export const deleteEducationalResource = async (req: Request, res: Response) => {
  try {
    const resource = await EducationalResource.findByIdAndDelete(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Educational resource not found' });
    }
    
    res.json({ message: 'Educational resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting educational resource:', error);
    res.status(500).json({ message: 'Server error deleting educational resource' });
  }
};

// Get featured educational resources
export const getFeaturedEducationalResources = async (req: Request, res: Response) => {
  try {
    const { limit = 5 } = req.query;
    
    const resources = await EducationalResource.find({
      isActive: true,
      featured: true
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit as string));
    
    res.json(resources);
  } catch (error) {
    console.error('Error fetching featured educational resources:', error);
    res.status(500).json({ message: 'Server error fetching featured educational resources' });
  }
};

// Like educational resource
export const likeEducationalResource = async (req: Request, res: Response) => {
  try {
    const resource = await EducationalResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Educational resource not found' });
    }
    
    resource.likeCount += 1;
    await resource.save();
    
    res.json({ likeCount: resource.likeCount });
  } catch (error) {
    console.error('Error liking educational resource:', error);
    res.status(500).json({ message: 'Server error liking educational resource' });
  }
};

// Get educational resource metadata
export const getEducationalResourceMetadata = async (req: Request, res: Response) => {
  try {
    const categories = await EducationalResource.distinct('category');
    const difficulties = await EducationalResource.distinct('difficulty');
    const allTags = await EducationalResource.distinct('tags');
    
    res.json({
      categories,
      difficulties,
      tags: allTags
    });
  } catch (error) {
    console.error('Error fetching educational resource metadata:', error);
    res.status(500).json({ message: 'Server error fetching educational resource metadata' });
  }
};
