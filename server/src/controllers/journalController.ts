import { Request, Response } from 'express';
import JournalEntry from '../models/JournalEntry';

// Create journal entry
export const createJournalEntry = async (req: Request, res: Response) => {
  try {
    const entryData = {
      ...req.body,
      userId: req.user._id
    };
    
    const entry = new JournalEntry(entryData);
    await entry.save();
    
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Server error creating journal entry' });
  }
};

// Get all journal entries for user
export const getJournalEntries = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;
    
    let query: any = { userId: req.user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }
    
    const entries = await JournalEntry.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit as string));
    
    res.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Server error fetching journal entries' });
  }
};

// Get journal entry by ID
export const getJournalEntryById = async (req: Request, res: Response) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ message: 'Server error fetching journal entry' });
  }
};

// Get journal entry by date
export const getJournalEntryByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const entry = await JournalEntry.findOne({
      userId: req.user._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    
    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry by date:', error);
    res.status(500).json({ message: 'Server error fetching journal entry' });
  }
};

// Update journal entry
export const updateJournalEntry = async (req: Request, res: Response) => {
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Server error updating journal entry' });
  }
};

// Delete journal entry
export const deleteJournalEntry = async (req: Request, res: Response) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ message: 'Server error deleting journal entry' });
  }
};

// Get journal analytics
export const getJournalAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query: any = { userId: req.user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }
    
    const entries = await JournalEntry.find(query);
    
    // Calculate analytics
    const analytics = {
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
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching journal analytics:', error);
    res.status(500).json({ message: 'Server error fetching journal analytics' });
  }
};
