const router = require('express').Router();
const auth = require('../middleware/auth');
const StudySession = require('../models/StudySession');

// Start a new session
router.post('/start', auth, async (req, res) => {
  try {
    const session = new StudySession({
      user: req.user.userId,
      startTime: new Date()
    });

    await session.save();
    res.json(session);
  } catch (err) {
    console.error('Error starting session:', err);
    res.status(500).json({ message: 'Error starting session' });
  }
});

// End a session
router.put('/end/:sessionId', auth, async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    session.endTime = new Date();
    session.duration = Math.floor((session.endTime - session.startTime) / 1000 / 60); // in minutes
    session.completed = true;

    await session.save();
    res.json(session);
  } catch (err) {
    console.error('Error ending session:', err);
    res.status(500).json({ message: 'Error ending session' });
  }
});

// Get today's sessions
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessions = await StudySession.find({
      user: req.user.userId,
      startTime: { $gte: today }
    }).sort({ startTime: -1 });

    res.json(sessions);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ message: 'Error fetching sessions' });
  }
});

module.exports = router; 