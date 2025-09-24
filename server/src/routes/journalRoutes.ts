import express from 'express';
import { Request, Response } from 'express';
import * as journalService from '../services/journalService';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

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
router.get('/date/:date', authenticateToken, async (req: AuthRequest, res: Response) => {
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
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
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
