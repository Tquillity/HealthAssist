import express from 'express';
import { Request, Response } from 'express';
import JournalEntry from '../models/JournalEntry';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all journal entries for a user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, limit = 30, page = 1 } = req.query;
    const userId = (req as any).user._id;

    const query: any = { userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const entries = await JournalEntry.find(query)
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await JournalEntry.countDocuments(query);

    res.json({
      entries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// Get journal entry by date
router.get('/date/:date', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const dateString = req.params.date; // e.g., "2025-09-24"
    
    // Parse the date string and create UTC date objects to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    
    
    const entry = await JournalEntry.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
});

// Create or update journal entry
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { date, ...entryData } = req.body;

    // Parse the date string and create UTC date objects to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    // Create UTC dates to avoid timezone conversion issues
    const entryDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0)); // Use noon UTC to avoid DST issues
    
    // Create date range for the full day in UTC
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    
    
    const existingEntry = await JournalEntry.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    let entry;
    if (existingEntry) {
      // Update existing entry
      entry = await JournalEntry.findByIdAndUpdate(
        existingEntry._id,
        { ...entryData, date: entryDate },
        { new: true, runValidators: true }
      );
    } else {
      // Create new entry
      entry = new JournalEntry({
        userId,
        date: entryDate,
        ...entryData
      });
      await entry.save();
    }

    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating/updating journal entry:', error);
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Failed to create/update journal entry',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update journal entry
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const entryId = req.params.id;
    const updateData = req.body;

    const entry = await JournalEntry.findOneAndUpdate(
      { _id: entryId, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

// Delete journal entry
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const entryId = req.params.id;

    const entry = await JournalEntry.findOneAndDelete({ _id: entryId, userId });

    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
});

// Get journal analytics
router.get('/analytics', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { startDate, endDate } = req.query;

    const query: any = { userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const entries = await JournalEntry.find(query).sort({ date: 1 });

    // Calculate analytics
    const analytics = {
      mood: {
        average: entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.mood.rating, 0) / entries.length : 0,
        trend: entries.length > 1 ? entries[entries.length - 1].mood.rating - entries[0].mood.rating : 0,
        distribution: {
          high: entries.filter(e => e.mood.rating >= 8).length,
          medium: entries.filter(e => e.mood.rating >= 5 && e.mood.rating < 8).length,
          low: entries.filter(e => e.mood.rating < 5).length
        }
      },
      energy: {
        average: entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.energy.rating, 0) / entries.length : 0,
        trend: entries.length > 1 ? entries[entries.length - 1].energy.rating - entries[0].energy.rating : 0,
        distribution: {
          high: entries.filter(e => e.energy.rating >= 8).length,
          medium: entries.filter(e => e.energy.rating >= 5 && e.energy.rating < 8).length,
          low: entries.filter(e => e.energy.rating < 5).length
        }
      },
      sleep: {
        averageHours: entries.length > 0 ? entries.reduce((sum, entry) => sum + (entry.sleep.hours || 0), 0) / entries.length : 0,
        averageQuality: entries.length > 0 ? entries.reduce((sum, entry) => sum + (entry.sleep.quality || 0), 0) / entries.length : 0
      },
      exercise: {
        totalMinutes: entries.reduce((sum, entry) => sum + (entry.exercise.duration || 0), 0),
        averageIntensity: entries.length > 0 ? entries.reduce((sum, entry) => sum + (entry.exercise.intensity || 0), 0) / entries.length : 0,
        daysActive: entries.filter(e => e.exercise.duration > 0).length
      },
      stress: {
        average: entries.length > 0 ? entries.reduce((sum, entry) => sum + (entry.stress.rating || 0), 0) / entries.length : 0,
        commonSources: entries.reduce((acc, entry) => {
          entry.stress.sources.forEach(source => {
            acc[source] = (acc[source] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>)
      },
      gratitude: {
        totalEntries: entries.reduce((sum, entry) => sum + entry.gratitude.entries.length, 0),
        averagePerDay: entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.gratitude.entries.length, 0) / entries.length : 0
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching journal analytics:', error);
    res.status(500).json({ error: 'Failed to fetch journal analytics' });
  }
});

export default router;
