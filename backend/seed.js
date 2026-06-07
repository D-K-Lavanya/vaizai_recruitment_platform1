import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Reset Admin User
    await User.deleteOne({ email: 'admin@vaizai.com' });
    const admin = new User({
      name: 'System Admin',
      email: 'admin@vaizai.com',
      password: 'VaizAI_Secure_2026!',
      role: 'recruiter'
    });
    await admin.save();
    console.log('Admin user created: admin@vaizai.com / password123');

    // Add dklavanya14@gmail.com
    await User.deleteOne({ email: 'dklavanya14@gmail.com' });
    const user = new User({
      name: 'Lavanya D K',
      email: 'dklavanya14@gmail.com',
      password: 'VaizAI_Secure_2026!',
      role: 'recruiter'
    });
    await user.save();
    console.log('User created: dklavanya14@gmail.com / password123');

    // Add sample candidate
    await User.deleteOne({ email: 'candidate@vaizai.com' });
    const candidate = new User({
      name: 'Sample Candidate',
      email: 'candidate@vaizai.com',
      password: 'VaizAI_Secure_2026!',
      role: 'candidate'
    });
    await candidate.save();
    console.log('Candidate user created: candidate@vaizai.com / password123');

    // Create a sample job if none exist
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      const sampleJob = new Job({
        title: 'Senior AI Engineer',
        company: 'VaizAI',
        location: 'Remote',
        description: 'We are looking for a Senior AI Engineer to join our core platform team. You will be responsible for building and scaling our NLP-based resume parsing engine.'
      });
      await sampleJob.save();
      console.log('Sample job created');
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
