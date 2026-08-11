import mongoose from "mongoose";
import dns from "dns";

// Fix Windows / ISP DNS SRV resolution issue for MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (_) { }

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || process.env.MONGODB_URL;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI, DATABASE_URL, or MONGODB_URL environment variable inside .env.local");
}


let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
