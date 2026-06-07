import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const updateJobCompany = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update "Data Analyst" job
    const result = await Job.updateMany(
      { title: 'Data Analyst' },
      { $set: { company: 'VaizAI Corp' } }
    );

    console.log(`Updated ${result.modifiedCount} job(s) with title "Data Analyst"`);

    // Also update "Senior AI Engineer" and others if needed for consistency
    await Job.updateMany(
      { company: 'VaizAI Corp' },
      { $set: { company: 'VaizAI Corp' } }
    );
    console.log('Normalized all "VaizAI Systems" to "VaizAI Corp"');

    process.exit(0);
  } catch (err) {
    console.error('Update error:', err);
    process.exit(1);
  }
};

updateJobCompany();
