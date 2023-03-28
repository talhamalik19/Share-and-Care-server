import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  applicantName: {
    type: String,
    required: true,
    trim: true,
  },
  applicantEmail: {
    type: String,
    required: true,
    trim: true,
  },
  applicantPhone: {
    type: String,
    required: true,
    trim: true,
  },
  applicantCnic: {
    type: String,
    required: true,
    trim: true,
  },
  applicantRequestStatus: {
    default: 'Applied',
    type: String,
    trim: true,
    required: true,
  },
});

const volunteerSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true,
    trim: true,
  },
  hospitalEmail: {
    type: String,
    required: true,
    trim: true,
  },
  hospitalPhone: {
    type: String,
    required: true,
    trim: true,
  },
  hospitalLocation: {
    type: String,
    required: true,
    trim: true,
  },
  volunteerRequestTitle: {
    type: String,
    required: true,
    trim: true,
  },
  volunteerRequestDescription: {
    type: String,
    required: true,
    trim: true,
  },
  volunteersRequired: {
    type: String,
    required: true,
    trim: true,
  },
  timeDuration: {
    type: String,
    required: true,
    trim: true,
  },
  requestStatus: {
    default: 'Enabled',
    type: String,
    trim: true,
    required: true,
  },
  applicants: [applicantSchema],
  ignoredBy: [
    {
      type: String,
      trim: true,
    },
  ],
});

export default mongoose.model('volunteers', volunteerSchema);
