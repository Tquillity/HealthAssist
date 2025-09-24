import { Request, Response } from 'express';
import * as journalService from '../services/journalService';
import { AuthRequest } from '../middleware/auth';

// Create journal entry
export const createJournalEntry = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await journalService.createJournalEntry(req.user._id, req.body);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Server error creating journal entry' });
  }
};

// Get all journal entries for user
export const getJournalEntries = async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      limit: parseInt(req.query.limit as string) || 50
    };
    
    const entries = await journalService.getJournalEntries(req.user._id, filters);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Server error fetching journal entries' });
  }
};

// Get journal entry by ID
export const getJournalEntryById = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await journalService.getJournalEntryById(req.user._id, req.params.id);
    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    if (error instanceof Error && error.message === 'Journal entry not found') {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.status(500).json({ message: 'Server error fetching journal entry' });
  }
};

// Get journal entry by date
export const getJournalEntryByDate = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await journalService.getJournalEntryByDate(req.user._id, req.params.date);
    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry by date:', error);
    res.status(500).json({ message: 'Server error fetching journal entry' });
  }
};

// Update journal entry
export const updateJournalEntry = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await journalService.updateJournalEntry(req.user._id, req.params.id, req.body);
    res.json(entry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    if (error instanceof Error && error.message === 'Journal entry not found') {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.status(500).json({ message: 'Server error updating journal entry' });
  }
};

// Delete journal entry
export const deleteJournalEntry = async (req: AuthRequest, res: Response) => {
  try {
    const result = await journalService.deleteJournalEntry(req.user._id, req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    if (error instanceof Error && error.message === 'Journal entry not found') {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.status(500).json({ message: 'Server error deleting journal entry' });
  }
};

// Get journal analytics
export const getJournalAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string
    };
    
    const analytics = await journalService.getJournalAnalytics(req.user._id, filters);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching journal analytics:', error);
    res.status(500).json({ message: 'Server error fetching journal analytics' });
  }
};
