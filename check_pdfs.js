import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const applicationSchema = new mongoose.Schema({}, { strict: false });
const Application = mongoose.model('Application', applicationSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const apps = await Application.find({}, 'fullName cvFile.filename cvFile.contentType');
  console.log("Total applications:", apps.length);
  apps.forEach(app => {
    console.log(`Name: ${app.fullName} | CV File: ${app.cvFile?.filename || 'None'} | ID: ${app._id}`);
  });
  process.exit(0);
}
check();
