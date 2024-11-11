// routes/groupRoutes.js
const express = require('express');
const Group = require('../models/Group');
const router = express.Router();

// Create Group
router.post('/create', async (req, res) => {
  const { topic, groupMembers } = req.body;

  // Check if any roll number already exists
  for (const member of groupMembers) {
    const existingMember = await Group.findOne({
      'groupMembers.rollNumber': member.rollNumber,
    });
    if (existingMember) {
      return res.status(400).json({ message: `Roll number ${member.rollNumber} is already taken` });
    }
  }

  // Check if 3 groups already selected the same topic
  const groupCount = await Group.countDocuments({ topic });
  if (groupCount >= 3) {
    return res.status(400).json({ message: 'Topic already selected by 3 groups' });
  }

  // Create the new group
  const newGroup = new Group({ topic, groupMembers });

  try {
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
);

// Get all groups
router.get('/all', async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups', error });
  }
});

router.get('/available-topics', async (req, res) => {
  const availableTopicList = [
    "Topic 1 : I/O Hardware, Port, Bus, Controller, Bus Architecture", 
    "Topic 2 : Polling, Interrupts, I/O Requests to Hardware Operations, Interrupt Driven I/O Cycle, Life Cycle of IO request", 
    "Topic 3 : Direct Memory Access, Applications of IO interface", 
    "Topic 4 : Kernel I/O Structure, Characteristics of I/O Devices", 
    "Topic 5 : Kernel I/O Subsystem, Error Handling, I/O Protection", 
    "Topic 6 : Use of a System Call to Perform I/O, Kernel Data Structures, UNIX I/O Kernel Structure", 
    "Topic 7 : The Security Problem, Security Violation Categories, Security Violation Methods", 
    "Topic 8 : Security Measure Levels, Program Threats, System and Network Threats (Cont.)", 
    "Topic 9 : Cryptography as a Security Tool, Secure Communication over Insecure Medium, User Authentication, Passwords", 
    "Topic 10 : Implementing Security Defenses, Firewalling to Protect Systems and Networks, Network Security Through Domain Separation Via Firewall"
  ];
  

  try {
    // Get the count of groups per topic
    const topicsCount = await Group.aggregate([
      { $group: { _id: "$topic", count: { $sum: 1 } } },
    ]);

    // Map available topics with the number of slots remaining
    const availableTopics = availableTopicList.map((topic) => {
      const topicData = topicsCount.find((item) => item._id === topic);
      return {
        topic,
        availableSlots: topicData ? 3 - topicData.count : 3, // Default to 3 if no groups are assigned to the topic
      };
    });

    // Send the available topics as a response
    res.json(availableTopics);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});


// Edit group
router.put('/:id', async (req, res) => {
  const { groupMembers, topic } = req.body;
  const groupId = req.params.id;

  try {
    const updatedGroup = await Group.findByIdAndUpdate(groupId, { groupMembers, topic }, { new: true });
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error updating group', error });
  }
});

// Delete group
router.delete('/:id', async (req, res) => {
  const groupId = req.params.id;

  try {
    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting group', error });
  }
});
router.post('/check-roll-number', async (req, res) => {
  const { rollNumber } = req.body;

  if (!rollNumber) {
    return res.status(400).json({ message: 'Roll number is required' });
  }

  try {
    // Check if any member in any group has the same roll number
    const existingMember = await Group.findOne({
      'groupMembers.rollNumber': rollNumber,
    });

    if (existingMember) {
      return res.status(400).json({ taken: true, message: `Roll number ${rollNumber} is already taken` });
    }

    // If no such roll number exists
    return res.status(200).json({ taken: false, message: 'Roll number is available' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
