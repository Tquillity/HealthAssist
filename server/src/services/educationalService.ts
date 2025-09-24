import EducationalResource from '../models/EducationalResource';

export interface EducationalFilters {
  category?: string;
  difficulty?: string;
  tags?: string | string[];
  featured?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export interface EducationalPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface EducationalResponse {
  resources: any[];
  pagination: EducationalPagination;
}

// Create educational resource
export const createEducationalResource = async (data: any) => {
  const resource = new EducationalResource(data);
  await resource.save();
  return resource;
};

// Get all educational resources with filtering and pagination
export const getEducationalResources = async (filters: EducationalFilters): Promise<EducationalResponse> => {
  const { 
    category, 
    difficulty, 
    tags, 
    featured, 
    search, 
    limit = 20, 
    page = 1 
  } = filters;
  
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
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  const resources = await EducationalResource.find(query)
    .sort({ featured: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await EducationalResource.countDocuments(query);
  
  return {
    resources,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Get educational resource by ID
export const getEducationalResourceById = async (id: string) => {
  const resource = await EducationalResource.findById(id);
  
  if (!resource) {
    throw new Error('Educational resource not found');
  }
  
  // Increment view count
  resource.viewCount += 1;
  await resource.save();
  
  return resource;
};

// Update educational resource
export const updateEducationalResource = async (id: string, data: any) => {
  const resource = await EducationalResource.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
  
  if (!resource) {
    throw new Error('Educational resource not found');
  }
  
  return resource;
};

// Delete educational resource
export const deleteEducationalResource = async (id: string) => {
  const resource = await EducationalResource.findByIdAndDelete(id);
  
  if (!resource) {
    throw new Error('Educational resource not found');
  }
  
  return { message: 'Educational resource deleted successfully' };
};

// Get featured educational resources
export const getFeaturedEducationalResources = async (limit: number = 5) => {
  const resources = await EducationalResource.find({
    isActive: true,
    featured: true
  })
  .sort({ createdAt: -1 })
  .limit(limit);
  
  return resources;
};

// Like educational resource
export const likeEducationalResource = async (id: string) => {
  const resource = await EducationalResource.findById(id);
  
  if (!resource) {
    throw new Error('Educational resource not found');
  }
  
  resource.likeCount += 1;
  await resource.save();
  
  return { likeCount: resource.likeCount };
};

// Get educational resource metadata
export const getEducationalResourceMetadata = async () => {
  const categories = await EducationalResource.distinct('category');
  const difficulties = await EducationalResource.distinct('difficulty');
  const allTags = await EducationalResource.distinct('tags');
  
  return {
    categories,
    difficulties,
    tags: allTags
  };
};
