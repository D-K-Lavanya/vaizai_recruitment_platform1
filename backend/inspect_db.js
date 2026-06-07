import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import Candidate from './models/Candidate.js';

dotenv.config();

const inspect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- JOBS ---');
    const jobs = await Job.find();
    console.log(JSON.stringify(jobs, null, 2));

    console.log('\n--- CANDIDATES ---');
    const candidates = await Candidate.find();
    console.log(JSON.stringify(candidates.map(c => ({
      name: c.name,
      email: c.email,
      skills: c.skills,
      resumeTextSnippet: c.resumeText ? c.resumeText.substring(0, 100) : 'MISSING'
    })), null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

inspect();
