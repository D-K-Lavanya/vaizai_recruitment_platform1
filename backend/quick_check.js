import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Job from './models/Job.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function checkJobs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const jobs = await Job.find();
    console.log('--- Database Job List ---');
    jobs.forEach(j => console.log(`- ${j.title} (${j.company})`));
    console.log('Total jobs in DB:', jobs.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkJobs();
