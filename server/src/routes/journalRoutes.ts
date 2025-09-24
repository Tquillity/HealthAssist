import express from 'express';
import { Request, Response } from 'express';
import { z } from 'zod';
import * as journalService from '../services/journalService';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// Validation schemas
const journalDateParamsSchema = z.object({
  params: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  }),
});

const createJournalEntrySchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    mood: z.enum(['very_low', 'low', 'neutral', 'good', 'excellent']).optional(),
    energy: z.enum(['very_low', 'low', 'medium', 'high', 'very_high']).optional(),
    sleep: z.object({
      hours: z.number().min(0, 'Sleep hours must be non-negative').max(24, 'Sleep hours cannot exceed 24'),
      quality: z.enum(['poor', 'fair', 'good', 'excellent']).optional(),
    }).optional(),
    activities: z.array(z.string()).optional(),
    notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
    symptoms: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional(),
  }),
});

const updateJournalEntrySchema = z.object({
  params: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  }),
  body: z.object({
    mood: z.enum(['very_low', 'low', 'neutral', 'good', 'excellent']).optional(),
    energy: z.enum(['very_low', 'low', 'medium', 'high', 'very_high']).optional(),
    sleep: z.object({
      hours: z.number().min(0, 'Sleep hours must be non-negative').max(24, 'Sleep hours cannot exceed 24'),
      quality: z.enum(['poor', 'fair', 'good', 'excellent']).optional(),
    }).optional(),
    activities: z.array(z.string()).optional(),
    notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
    symptoms: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional(),
  }),
});

// Get all journal entries for a user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      limit: parseInt(req.query.limit as string) || 30
    };
    
    const entries = await journalService.getJournalEntries(req.user._id, filters);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// Get journal entry by date
router.get('/date/:date', authenticateToken, validate(journalDateParamsSchema), async (req: AuthRequest, res: Response) => {
  try {
    const entry = await journalService.getJournalEntryByDate(req.user._id, req.params.date);
    
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
router.post('/', authenticateToken, validate(createJournalEntrySchema), async (req: AuthRequest, res: Response) => {
  try {
    const entry = await journalService.createJournalEntry(req.user._id, req.body);
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
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const entry = await journalService.updateJournalEntry(req.user._id, req.params.id, req.body);
    res.json(entry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    if (error instanceof Error && error.message === 'Journal entry not found') {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

// Delete journal entry
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await journalService.deleteJournalEntry(req.user._id, req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    if (error instanceof Error && error.message === 'Journal entry not found') {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
});

// Get journal analytics
router.get('/analytics', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string
    };
    
    const analytics = await journalService.getJournalAnalytics(req.user._id, filters);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching journal analytics:', error);
    res.status(500).json({ error: 'Failed to fetch journal analytics' });
  }
});

export default router;
