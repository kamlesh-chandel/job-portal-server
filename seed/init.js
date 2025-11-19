import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../src/models/role.model.js';

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

   await Role.deleteMany({ name: { $in: ['student', 'recruiter'] } });

    const roles = [
      { name: 'student' },
      { name: 'recruiter' },
    ];

    const inserted = await Role.insertMany(roles);
    console.log('Inserted roles:', inserted.map(r => r.name));

    await mongoose.disconnect();
    console.log('Seed complete, disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

run();
