/**
 * Admin Pre-Storage / Seeder Script
 *
 * Stores or updates an Admin account in MongoDB Atlas with a secure bcrypt password.
 *
 * Usage:
 *   npm run seed:admin
 *   node scripts/seed-admin.mjs [username] [password] [email]
 *
 * Example:
 *   node scripts/seed-admin.mjs admin secretPass123 admin@kmclu.com
 */
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Load .env.local
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

// CLI arguments or fallback to env / defaults
const args = process.argv.slice(2);
const username = (args[0] || process.env.ADMIN_USERNAME || "admin").toLowerCase().trim();
const rawPassword = args[1] || process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD || "admin123";
const email = (args[2] || process.env.ADMIN_EMAIL || env.ADMIN_EMAIL || "admin@kmclu.com").toLowerCase().trim();

console.log("\n🔐 ========================================================");
console.log("   KMCLU Confession Wall — Pre-Store Admin in Database");
console.log("========================================================\n");

if (!uri || uri.includes("<username>") || uri.includes("<password>")) {
  console.error("❌ ERROR: Valid MONGODB_URI is required to pre-store admin in database!");
  console.error("👉 Please set your MongoDB Atlas connection string in .env.local first.\n");
  process.exit(1);
}

try {
  console.log(`⏳ Connecting to database...`);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });

  console.log(`🔒 Hashing password with bcrypt (cost factor 10)...`);
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // Admin schema
  const AdminSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true, lowercase: true, trim: true },
      email: { type: String, lowercase: true, trim: true },
      password: { type: String, required: true },
      role: { type: String, default: "ADMIN" },
    },
    { timestamps: true }
  );

  const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

  // Upsert admin: update if exists, insert if not
  const result = await Admin.findOneAndUpdate(
    { username },
    {
      username,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
    { upsert: true, new: true }
  );

  console.log("\n🎉 SUCCESS: Admin account pre-stored in MongoDB!");
  console.log("--------------------------------------------------------");
  console.log(`   User ID / Username : ${result.username}`);
  console.log(`   Email              : ${result.email}`);
  console.log(`   Password           : ${rawPassword} (stored securely as bcrypt hash)`);
  console.log(`   Role               : ${result.role}`);
  console.log(`   MongoDB Object ID  : ${result._id}`);
  console.log("--------------------------------------------------------");
  console.log("\n👉 You can now log in at: http://localhost:3000/admin/login");
  console.log(`   Username/Email: ${result.username} (or ${result.email})`);
  console.log(`   Password      : ${rawPassword}\n`);

  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error("\n❌ SEEDING FAILED:", err.message);
  process.exit(1);
}
