const router = require('express').Router();
const auth = require('../middleware/auth');
const BlockedSite = require('../models/BlockedSite');

// Get all blocked sites for the current user
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching blocked sites for user:', req.user.userId);
    const sites = await BlockedSite.find({ user: req.user.userId });
    res.json(sites);
  } catch (err) {
    console.error('Error fetching blocked sites:', err);
    res.status(500).json({ message: 'Error fetching blocked sites' });
  }
});

// Add a new blocked site
router.post('/', auth, async (req, res) => {
  try {
    const { url } = req.body;
    console.log('Adding blocked site:', url, 'for user:', req.user.userId);

    // Check if site is already blocked
    const existingSite = await BlockedSite.findOne({
      user: req.user.userId,
      url: url.toLowerCase()
    });

    if (existingSite) {
      return res.status(400).json({ message: 'This website is already blocked' });
    }

    const blockedSite = new BlockedSite({
      url: url.toLowerCase(),
      user: req.user.userId
    });

    await blockedSite.save();
    console.log('Successfully blocked site:', blockedSite);
    res.status(201).json(blockedSite);
  } catch (err) {
    console.error('Error adding blocked site:', err);
    res.status(500).json({ message: 'Error adding blocked site' });
  }
});

// Remove a blocked site
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Removing blocked site:', req.params.id);
    const site = await BlockedSite.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }

    console.log('Successfully removed blocked site:', site);
    res.json({ message: 'Site removed successfully' });
  } catch (err) {
    console.error('Error removing blocked site:', err);
    res.status(500).json({ message: 'Error removing blocked site' });
  }
});

module.exports = router; 