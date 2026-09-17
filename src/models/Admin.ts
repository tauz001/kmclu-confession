import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  email?: string;
  password: string; // bcrypt hashed password
  role: "ADMIN" | "MODERATOR";
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true, // Allows null/missing email without index violation
    },
    password: {
      type: String,
      required: [true, "Hashed password is required"],
    },
    role: {
      type: String,
      enum: ["ADMIN", "MODERATOR"],
      default: "ADMIN",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose model recompilation in Next.js hot-reload
const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
