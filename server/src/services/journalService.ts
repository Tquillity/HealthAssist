import JournalEntry from '../models/JournalEntry';

export interface JournalFilters {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface JournalAnalytics {
  mood: {
    average: number;
    trend: number;
    distribution: { high: number; medium: number; low: number };
  };
  energy: {
    average: number;
    trend: number;
    distribution: { high: number; medium: number; low: number };
  };
  sleep: {
    averageHours: number;
    averageQuality: number;
  };
  exercise: {
    totalMinutes: number;
    averageIntensity: number;
    daysActive: number;
  };
  stress: {
    average: number;
    commonSources: Record<string, number>;
  };
  gratitude: {
    totalEntries: number;
    averagePerDay: number;
  };
}

// Create journal entry
export const createJournalEntry = async (userId: string, data: any) => {
  const entryData = {
    ...data,
    userId
  };
  
  const entry = new JournalEntry(entryData);
  await entry.save();
  
  return entry;
};

// Get all journal entries for user
export const getJournalEntries = async (userId: string, filters: JournalFilters) => {
  const { startDate, endDate, limit = 50 } = filters;
  
  let query: any = { userId };
  
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const entries = await JournalEntry.find(query)
    .sort({ date: -1 })
    .limit(limit);
  
  return entries;
};

// Get journal entry by ID
export const getJournalEntryById = async (userId: string, entryId: string) => {
  const entry = await JournalEntry.findOne({
    _id: entryId,
    userId
  });
  
  if (!entry) {
    throw new Error('Journal entry not found');
  }
  
  return entry;
};

// Get journal entry by date
export const getJournalEntryByDate = async (userId: string, date: string) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const entry = await JournalEntry.findOne({
    userId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
  
  return entry;
};

// Update journal entry
export const updateJournalEntry = async (userId: string, entryId: string, data: any) => {
  const entry = await JournalEntry.findOneAndUpdate(
    { _id: entryId, userId },
    data,
    { new: true, runValidators: true }
  );
  
  if (!entry) {
    throw new Error('Journal entry not found');
  }
  
  return entry;
};

// Delete journal entry
export const deleteJournalEntry = async (userId: string, entryId: string) => {
  const entry = await JournalEntry.findOneAndDelete({
    _id: entryId,
    userId
  });
  
  if (!entry) {
    throw new Error('Journal entry not found');
  }
  
  return { message: 'Journal entry deleted successfully' };
};

// Get journal analytics
export const getJournalAnalytics = async (userId: string, filters: JournalFilters): Promise<JournalAnalytics> => {
  const { startDate, endDate } = filters;
  
  let query: any = { userId };
  
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const entries = await JournalEntry.find(query);
  
  // Calculate analytics
  const analytics: JournalAnalytics = {
    mood: {
      average: 0,
      trend: 0,
      distribution: { high: 0, medium: 0, low: 0 }
    },
    energy: {
      average: 0,
      trend: 0,
      distribution: { high: 0, medium: 0, low: 0 }
    },
    sleep: {
      averageHours: 0,
      averageQuality: 0
    },
    exercise: {
      totalMinutes: 0,
      averageIntensity: 0,
      daysActive: 0
    },
    stress: {
      average: 0,
      commonSources: {}
    },
    gratitude: {
      totalEntries: 0,
      averagePerDay: 0
    }
  };
  
  if (entries.length > 0) {
    // Mood analytics
    const moodRatings = entries.map(e => e.mood.rating).filter(r => r);
    if (moodRatings.length > 0) {
      analytics.mood.average = moodRatings.reduce((a, b) => a + b, 0) / moodRatings.length;
      analytics.mood.distribution.high = moodRatings.filter(r => r >= 4).length;
      analytics.mood.distribution.medium = moodRatings.filter(r => r === 3).length;
      analytics.mood.distribution.low = moodRatings.filter(r => r <= 2).length;
    }
    
    // Energy analytics
    const energyRatings = entries.map(e => e.energy.rating).filter(r => r);
    if (energyRatings.length > 0) {
      analytics.energy.average = energyRatings.reduce((a, b) => a + b, 0) / energyRatings.length;
      analytics.energy.distribution.high = energyRatings.filter(r => r >= 4).length;
      analytics.energy.distribution.medium = energyRatings.filter(r => r === 3).length;
      analytics.energy.distribution.low = energyRatings.filter(r => r <= 2).length;
    }
    
    // Sleep analytics
    const sleepHours = entries.map(e => e.sleep.hours).filter(h => h);
    const sleepQuality = entries.map(e => e.sleep.quality).filter(q => q);
    if (sleepHours.length > 0) {
      analytics.sleep.averageHours = sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length;
    }
    if (sleepQuality.length > 0) {
      analytics.sleep.averageQuality = sleepQuality.reduce((a, b) => a + b, 0) / sleepQuality.length;
    }
    
    // Exercise analytics
    const exerciseMinutes = entries.map(e => e.exercise.duration).filter(d => d);
    const exerciseIntensity = entries.map(e => e.exercise.intensity).filter(i => i);
    if (exerciseMinutes.length > 0) {
      analytics.exercise.totalMinutes = exerciseMinutes.reduce((a, b) => a + b, 0);
      analytics.exercise.daysActive = exerciseMinutes.filter(m => m > 0).length;
    }
    if (exerciseIntensity.length > 0) {
      analytics.exercise.averageIntensity = exerciseIntensity.reduce((a, b) => a + b, 0) / exerciseIntensity.length;
    }
    
    // Stress analytics
    const stressRatings = entries.map(e => e.stress.rating).filter(r => r);
    if (stressRatings.length > 0) {
      analytics.stress.average = stressRatings.reduce((a, b) => a + b, 0) / stressRatings.length;
    }
    
    // Gratitude analytics
    const gratitudeEntries = entries.map(e => e.gratitude.entries).flat().filter(e => e);
    analytics.gratitude.totalEntries = gratitudeEntries.length;
    analytics.gratitude.averagePerDay = gratitudeEntries.length / entries.length;
  }
  
  return analytics;
};
