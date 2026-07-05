import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  // Section A: Basic Info
  universityEmail: { type: String, required: true, trim: true, lowercase: true },
  fullName: { type: String, required: true, trim: true },
  studentId: { type: String, required: true, trim: true },
  personalEmail: { type: String, required: true, trim: true, lowercase: true },
  department: { type: String, required: true, trim: true },
  currentSemester: { type: String, required: true, trim: true },

  // Section B: Application Preference
  teamType: { type: String, required: true, enum: ['Technical', 'Non-Technical'] },
  firstPreference: { type: String, required: true },
  firstPreferenceSubsection: { type: String, default: '' },
  secondPreference: { type: String, required: true },
  secondPreferenceSubsection: { type: String, default: '' },

  // Section C: General Questions
  whyDiganta: { type: String, required: true },
  aspectsOfInterest: { type: String, required: true },
  clubInvolvement: { type: String, default: '' },

  // Section D: Non-Technical Specific
  softwareTools: { type: [String], default: [] },
  comfortableTasks: { type: [String], default: [] },
  portfolioLinks: { type: String, default: '' },

  // Section E / Shared Questions
  skillsOrStrengths: { type: String, required: true },
  relevantExperiences: { type: String, required: true },
  hopeToLearn: { type: String, required: true },
  cvFile: {
    data: Buffer,
    contentType: String,
    filename: String
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Application', applicationSchema);
