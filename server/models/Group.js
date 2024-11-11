// models/Group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupMembers: [
    {
      name: { type: String, required: true },
      rollNumber: { type: String, required: true, unique: true },
    },
  ],
  topic: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
