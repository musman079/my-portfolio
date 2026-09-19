import mongoose from "mongoose";
import dns from "dns";

// Fix Windows / ISP DNS SRV resolution issue for MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (_) { }

const getMongoUri = () =>
  process.env.MONGODB_URI || process.env.DATABASE_URL || process.env.MONGODB_URL;



let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

    const uri = getMongoUri();
    if (!uri) {
      throw new Error(
        "Please define MONGODB_URI, DATABASE_URL, or MONGODB_URL in your environment."
      );
    }

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
