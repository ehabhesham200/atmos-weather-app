import mongoose from 'mongoose';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB via MONGODB_URI');
    return;
  }

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const dbPath = path.join(__dirname, '..', '.mongodb-data');
  fs.mkdirSync(dbPath, { recursive: true });

  const mongod = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: 'wiredTiger' },
  });
  await mongoose.connect(mongod.getUri('weather_app'));
  console.log(`Connected to embedded MongoDB (data persisted in ${dbPath})`);
}
