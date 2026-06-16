import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Contact Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, organization, email, type, message } = req.body;

    if (!name || typeof name !== 'string') throw new Error('Invalid name');
    if (!email || typeof email !== 'string') throw new Error('Invalid email');
    if (!message || typeof message !== 'string') throw new Error('Invalid message');

    await client.connect();
    const database = client.db('diganta_db');
    const collection = database.collection('contacts');

    const result = await collection.insertOne({
      name: String(name).trim(),
      organization: organization ? String(organization).trim() : '',
      email: String(email).trim(),
      type: type ? String(type).trim() : '',
      message: String(message).trim(),
      submittedAt: new Date().toISOString(),
    });

    res.status(200).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error('MongoDB Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Careers Endpoint
app.post('/api/careers', async (req, res) => {
  try {
    const { name, email, phone, link, coverLetter, role } = req.body;

    if (!name || typeof name !== 'string') throw new Error('Invalid name');
    if (!email || typeof email !== 'string') throw new Error('Invalid email');
    if (!role || typeof role !== 'string') throw new Error('Invalid role');

    await client.connect();
    const database = client.db('diganta_db');
    const collection = database.collection('applications');

    const result = await collection.insertOne({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : '',
      link: link ? String(link).trim() : '',
      role: String(role).trim(),
      coverLetter: coverLetter ? String(coverLetter).trim() : '',
      submittedAt: new Date().toISOString(),
    });

    res.status(200).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error('MongoDB Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Local MongoDB API server running on http://localhost:${PORT}`);
});
