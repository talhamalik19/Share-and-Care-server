import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  resourceName: {
    type: String,
    required: true,
    trim: true,
  },
  resourceQuantity: {
    type: String,
    required: true,
    trim: true,
  },
  resourceDuration: {
    type: String,
    required: true,
    trim: true,
  },
  resourceNotes: {
    type: String,
    default: 'No Additional Notes Provided',
    trim: true,
  },
  userType: {
    type: String,
    required: true,
    default: 'user',
  },
  requestStatus: {
    type: String,
    default: 'Pending',
    trim: true,
  },
  requestedByName: {
    type: String,
    required: true,
    trim: true,
  },
  requestedByEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  requestedByPhone: {
    type: String,
    required: true,
    trim: true,
  },
  requestedByAddress: {
    type: String,
    required: true,
    trim: true,
  },
  approvedByName: {
    type: String,
    default: 'Pending',
    trim: true,
  },
  approvedByPhone: {
    type: String,
    default: 'Pending',
    trim: true,
  },
  approvedByEmail: {
    type: String,
    default: 'Pending',
    trim: true,
  },
  ignoredBy: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('resources', resourceSchema);
