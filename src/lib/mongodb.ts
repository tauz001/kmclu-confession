import mongoose from "mongoose";

function getMongoUri(): string {
  const envUri = process.env.MONGODB_URI;
  if (envUri && !envUri.includes("<username>")) {
    return envUri;
  }

  throw new Error(
    "Please define a valid MONGODB_URI environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  // If already connected and ready, reuse connection
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = getMongoUri();
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        cached.conn = m;
        return m;
      })
      .catch((err) => {
        // Reset cache so future requests can retry rather than being permanently blocked
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }

  return cached.conn;
}

export default dbConnect;
