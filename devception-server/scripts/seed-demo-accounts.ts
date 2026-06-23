import mongoose from 'mongoose';
import { randomBytes, scryptSync } from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../src/models/User.model';

dotenv.config({ path: path.join(__dirname, '../.env') });

const DEMO_ACCOUNTS = [
  'demo1@devception.com',
  'demo2@devception.com',
  'demo3@devception.com',
  'demo4@devception.com'
];

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codecrew';
  console.log(`Connecting to MongoDB at ${uri}...`);
  await mongoose.connect(uri);

  const hashed = hashPassword('Devception123');

  for (let i = 0; i < DEMO_ACCOUNTS.length; i++) {
    const email = DEMO_ACCOUNTS[i];
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          googleId: `email:${email}`,
          email,
          displayName: `Demo Player ${i + 1}`,
          password: hashed,
          avatarUrl: '',
        }
      },
      { upsert: true, new: true }
    );
    console.log(`Upserted ${email} (ID: ${user._id})`);
  }

  console.log('Demo accounts seeded successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
