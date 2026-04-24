import { Router, Response } from 'express';
import Mood from '../models/Mood';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// All mood routes require authentication
router.use(protect);

// GET /api/mood — get all moods for logged-in user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const moods = await Mood.find({ userId: req.userId })
      .sort({ date: -1 })
      .lean();

    res.json(moods);
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ error: 'Failed to fetch moods.' });
  }
});

// POST /api/mood — add a new mood entry
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, emoji } = req.body;

    if (!name || !emoji) {
      res.status(400).json({ error: 'Mood name and emoji are required.' });
      return;
    }

    const mood = await Mood.create({
      userId: req.userId,
      name,
      emoji,
      date: new Date(),
    });

    res.status(201).json(mood);
  } catch (error) {
    console.error('Add mood error:', error);
    res.status(500).json({ error: 'Failed to save mood.' });
  }
});

// DELETE /api/mood — clear all moods for logged-in user
router.delete('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Mood.deleteMany({ userId: req.userId });
    res.json({ message: 'All moods cleared.' });
  } catch (error) {
    console.error('Clear moods error:', error);
    res.status(500).json({ error: 'Failed to clear moods.' });
  }
});

export default router;
