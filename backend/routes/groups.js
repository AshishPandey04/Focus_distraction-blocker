const router = require('express').Router();
const auth = require('../middleware/auth');
const Group = require('../models/Group');
const User = require('../models/User');

// Get all groups for the current user (both created and joined)
router.get('/my-groups', auth, async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [
        { creator: req.user.userId },
        { members: req.user.userId }
      ]
    }).populate('creator', 'username email')
      .populate('members', 'username email')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

// Create a new group
router.post('/create', auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    const newGroup = new Group({
      name,
      description,
      creator: req.user.userId,
      members: [req.user.userId] // Creator is automatically a member
    });

    await newGroup.save();

    // Populate creator and members info before sending response
    const populatedGroup = await Group.findById(newGroup._id)
      .populate('creator', 'username email')
      .populate('members', 'username email');

    res.status(201).json(populatedGroup);
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ message: 'Error creating group' });
  }
});

// Get all available groups (with search)
router.get('/available', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {
      // Don't show groups user is already a member of
      members: { $ne: req.user.userId }
    };

    // Add search condition if search term exists
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const groups = await Group.find(query)
      .populate('creator', 'username email')
      .populate('members', 'username email')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (err) {
    console.error('Error fetching available groups:', err);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

// Join a group
router.post('/join/:groupId', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is already a member
    if (group.members.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }

    // Add user to group members
    group.members.push(req.user.userId);
    await group.save();

    // Return populated group data
    const updatedGroup = await Group.findById(group._id)
      .populate('creator', 'username email')
      .populate('members', 'username email');

    res.json(updatedGroup);
  } catch (err) {
    console.error('Error joining group:', err);
    res.status(500).json({ message: 'Error joining group' });
  }
});

module.exports = router; 