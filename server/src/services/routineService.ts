import Routine from '../models/Routine';

export interface RoutineFilters {
  category?: string;
  context?: string;
  energy?: string;
  duration?: string;
  difficulty?: string;
}

export interface RoutineLotteryData {
  count?: number;
  category?: string;
  context?: string;
  energy?: string;
  duration?: string;
  difficulty?: string;
  excludeIds?: string[];
}

export interface RoutineLotteryResponse {
  message: string;
  routines: any[];
  totalAvailable: number;
}

export interface RoutineMetadata {
  categories: string[];
  contexts: string[];
  energyLevels: string[];
  durations: string[];
  difficulties: string[];
}

// Get all routines with optional filtering
export const getRoutines = async (filters: RoutineFilters) => {
  const { category, context, energy, duration, difficulty } = filters;
  
  const filter: any = { isActive: true };
  
  if (category) filter.category = category;
  if (context) filter['metadata.context'] = context;
  if (energy) filter['metadata.energy'] = energy;
  if (duration) filter['metadata.duration'] = duration;
  if (difficulty) filter['metadata.difficulty'] = difficulty;

  const routines = await Routine.find(filter).sort({ createdAt: -1 });
  return routines;
};

// Get routine by ID
export const getRoutineById = async (routineId: string) => {
  const routine = await Routine.findById(routineId);
  
  if (!routine) {
    throw new Error('Routine not found');
  }

  return routine;
};

// Todo-lottery: Get random routine(s) based on filters
export const getRoutineLottery = async (data: RoutineLotteryData): Promise<RoutineLotteryResponse> => {
  const { 
    count = 1, 
    category, 
    context, 
    energy, 
    duration, 
    difficulty,
    excludeIds = [] 
  } = data;

  const filter: any = { 
    isActive: true,
    _id: { $nin: excludeIds }
  };
  
  if (category) filter.category = category;
  if (context) filter['metadata.context'] = context;
  if (energy) filter['metadata.energy'] = energy;
  if (duration) filter['metadata.duration'] = duration;
  if (difficulty) filter['metadata.difficulty'] = difficulty;

  // Get all matching routines
  const allRoutines = await Routine.find(filter);
  
  if (allRoutines.length === 0) {
    return { 
      message: 'No routines found matching your criteria',
      routines: [],
      totalAvailable: 0
    };
  }

  // Shuffle and select random routines
  const shuffled = allRoutines.sort(() => 0.5 - Math.random());
  const selectedRoutines = shuffled.slice(0, Math.min(count, allRoutines.length));

  return {
    message: `Selected ${selectedRoutines.length} routine(s)`,
    routines: selectedRoutines,
    totalAvailable: allRoutines.length
  };
};

// Create new routine
export const createRoutine = async (userId: string, data: any) => {
  const routineData = {
    ...data,
    createdBy: userId
  };

  const routine = new Routine(routineData);
  await routine.save();

  return routine;
};

// Update routine
export const updateRoutine = async (routineId: string, data: any) => {
  const routine = await Routine.findByIdAndUpdate(
    routineId,
    data,
    { new: true, runValidators: true }
  );

  if (!routine) {
    throw new Error('Routine not found');
  }

  return routine;
};

// Delete routine (soft delete)
export const deleteRoutine = async (routineId: string) => {
  const routine = await Routine.findByIdAndUpdate(
    routineId,
    { isActive: false },
    { new: true }
  );

  if (!routine) {
    throw new Error('Routine not found');
  }

  return routine;
};

// Get routine metadata
export const getRoutineMetadata = async (): Promise<RoutineMetadata> => {
  const categories = await Routine.distinct('category', { isActive: true });
  const contexts = await Routine.distinct('metadata.context', { isActive: true });
  const energyLevels = await Routine.distinct('metadata.energy', { isActive: true });
  const durations = await Routine.distinct('metadata.duration', { isActive: true });
  const difficulties = await Routine.distinct('metadata.difficulty', { isActive: true });

  return {
    categories,
    contexts,
    energyLevels,
    durations,
    difficulties
  };
};
