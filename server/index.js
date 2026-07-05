import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import Contact from './models/Contact.js';
import Application from './models/Application.js';

// Get current directory for dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Setup Multer for CV uploads using Memory Storage for MongoDB
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// API Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { organization, email, type, message } = req.body;

    // Validate inputs
    if (!organization || !email || !type || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new contact submission
    const newContact = new Contact({
      organization,
      email,
      type,
      message
    });

    await newContact.save();
    
    console.log('New Contact Submission Saved!');
    res.status(201).json({ success: true, message: 'Partnership request submitted successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.post('/api/careers', upload.single('cvFile'), async (req, res) => {
  try {
    const data = req.body;

    // Parse array strings coming from FormData
    if (data.softwareTools && typeof data.softwareTools === 'string') {
      try { data.softwareTools = JSON.parse(data.softwareTools); } catch (e) {}
    }
    if (data.comfortableTasks && typeof data.comfortableTasks === 'string') {
      try { data.comfortableTasks = JSON.parse(data.comfortableTasks); } catch (e) {}
    }

    const requiredFields = [
      'universityEmail', 'fullName', 'studentId', 'personalEmail', 'department', 'currentSemester',
      'teamType', 'firstPreference', 'secondPreference', 'whyDiganta', 'aspectsOfInterest',
      'skillsOrStrengths', 'relevantExperiences', 'hopeToLearn'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ error: `Field ${field} is required` });
      }
    }

    if (!req.file) {
      return res.status(400).json({ error: 'CV file is required' });
    }

    const newApplication = new Application({
      ...data,
      softwareTools: data.softwareTools || [],
      comfortableTasks: data.comfortableTasks || [],
      cvFile: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      }
    });

    await newApplication.save();
    
    console.log('New Recruitment Application Saved!');
    res.status(201).json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ error: 'Failed to process application' });
  }
});

// Route to view CV directly from MongoDB
app.get('/api/careers/cv/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application || !application.cvFile || !application.cvFile.data) {
      return res.status(404).json({ error: 'CV not found' });
    }
    
    // Set headers so the browser displays the PDF natively instead of downloading it
    res.set('Content-Type', application.cvFile.contentType);
    res.set('Content-Disposition', `inline; filename="${application.cvFile.filename}"`);
    res.send(application.cvFile.data);
  } catch (error) {
    console.error('Error fetching CV:', error);
    res.status(500).json({ error: 'Failed to retrieve CV' });
  }
});

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
  });
});
