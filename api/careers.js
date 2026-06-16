import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

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
}
