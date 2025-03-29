const router = require('express').Router();
const auth = require('../middleware/auth');
const StudySession = require('../models/StudySession');

// Start session
router.post('/start', auth, async (req, res) => {
  try {
    const session = new StudySession({
      user: req.user.userId,
      startTime: new Date()
    });
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// End session
router.put('/end/:sessionId', auth, async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.endTime = new Date();
    session.duration = Math.floor((session.endTime - session.startTime) / 1000 / 60);
    session.completed = true;
    await session.save();

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's sessions for today
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessions = await StudySession.find({
      user: req.user.userId,
      startTime: { $gte: today }
    });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 