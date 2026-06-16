import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Contact from './models/Contact.js';

import Application from './models/Application.js';

// Get current directory for dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

app.post('/api/careers', async (req, res) => {
  try {
    const { fullName, email, contactNumber, roleOfInterest, portfolioLink, motivation } = req.body;

    if (!fullName || !email || !contactNumber || !roleOfInterest || !portfolioLink || !motivation) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newApplication = new Application({
      fullName,
      email,
      contactNumber,
      roleOfInterest,
      portfolioLink,
      motivation
    });

    await newApplication.save();
    
    console.log('New Careers Application Saved!');
    res.status(201).json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ error: 'Failed to process application' });
  }
});

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
  });
});
