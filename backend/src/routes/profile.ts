import { Router, Response } from 'express';
import Profile from '../models/Profile';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// All profile routes require authentication
router.use(protect);

// GET /api/profile — get the profile for logged-in user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let profile = await Profile.findOne({ userId: req.userId });

    if (!profile) {
      // Create a default profile if one doesn't exist yet
      profile = await Profile.create({
        userId: req.userId,
        name: '',
        age: 0,
        gender: 'Prefer not to say',
        country: '',
        sleepHours: 8,
        interests: [],
        stressors: [],
      });
    }

    res.json(profile.toObject());
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// PUT /api/profile — update the profile for logged-in user
router.put('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, age, gender, country, sleepHours, interests, stressors } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { name, age, gender, country, sleepHours, interests, stressors },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(updatedProfile?.toObject());
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// DELETE /api/profile — reset profile to defaults
router.delete('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resetData = {
      name: '',
      age: 0,
      gender: 'Prefer not to say',
      country: '',
      sleepHours: 8,
      interests: [],
      stressors: [],
    };

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      resetData,
      { new: true, upsert: true }
    );

    res.json(profile?.toObject());
  } catch (error) {
    console.error('Reset profile error:', error);
    res.status(500).json({ error: 'Failed to reset profile.' });
  }
});

export default router;
