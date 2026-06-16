import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

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
}
