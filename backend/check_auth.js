import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'admin@vaizai.com' });
    
    if (!user) {
      console.log('User not found');
    } else {
      console.log('User found:', user.email);
      console.log('Stored Hash:', user.password);
      
      const isMatch = await user.comparePassword('password123');
      console.log('Password "password123" match:', isMatch);
      
      const manualMatch = await bcrypt.compare('password123', user.password);
      console.log('Manual bcrypt match:', manualMatch);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
