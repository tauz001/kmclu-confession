/**
 * Database Connection Diagnostic Script
 *
 * Run with: npm run test:db
 */
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Load .env.local manually
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx > -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const uri = process.env.MONGODB_URI || env.MONGODB_URI;

console.log("\n🔍 ========================================================");
console.log("   KMCLU Confession Wall — MongoDB Atlas Diagnostics");
console.log("========================================================\n");

if (!uri) {
  console.error("❌ ERROR: MONGODB_URI is not set in .env.local!");
  console.error("👉 Please add your MongoDB Atlas connection string to .env.local:\n");
  console.error("   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/kmclu-confessions?retryWrites=true&w=majority\n");
  process.exit(1);
}

if (uri.includes("<username>") || uri.includes("<password>")) {
  console.error("⚠️  WARNING: Your MONGODB_URI still contains placeholder values:\n");
  console.error(`   ${uri}\n`);
  console.error("👉 Replace <username> with your Atlas database username.");
  console.error("👉 Replace <password> with your Atlas database user password.");
  console.error("👉 (Remember to URL-encode special characters like @, #, $, / in the password)\n");
  process.exit(1);
}

console.log("⏳ Connecting to MongoDB Atlas cluster...");

try {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 6000,
  });

  const admin = conn.connection.db.admin();
  const ping = await admin.ping();
  const dbName = conn.connection.name;
  const collections = await conn.connection.db.listCollections().toArray();

  console.log("\n🎉 SUCCESS: Successfully connected to MongoDB Atlas!");
  console.log(`   Database Name : ${dbName}`);
  console.log(`   Cluster Ping  : ${JSON.stringify(ping)}`);
  console.log(`   Collections   : ${collections.map((c) => c.name).join(", ") || "(empty database ready for confessions)"}`);
  console.log("\n✨ Your database is configured and fully ready for the website!\n");

  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error("\n❌ CONNECTION FAILED:", err.message);
  console.error("\n🛠️  Common Fixes:");
  console.error("1. Network Access: Ensure '0.0.0.0/0' (Allow Access from Anywhere) is added to IP Access List in MongoDB Atlas.");
  console.error("2. Credentials: Verify your database username and password in Database Access in Atlas.");
  console.error("3. Special Characters: If your password has symbols like '@', '%', '#', URL-encode them (e.g. '@' becomes '%40').\n");
  process.exit(1);
}
