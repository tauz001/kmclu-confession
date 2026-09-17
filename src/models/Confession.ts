import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConfessionMetadata {
  ip?: string;
  userAgent?: string;
  language?: string;
  platform?: string;
  browser?: string;
  deviceType?: string;
}

export interface IConfession extends Document {
  confession: string;
  imageUrl?: string;
  status: "pending" | "approved" | "rejected";
  stickyColor: string;
  rotation: number;
  createdAt: Date;
  updatedAt: Date;
  moderationReason?: string;
  metadata: IConfessionMetadata;
}

const STICKY_COLORS = [
  "#FFF9C4", // Butter yellow
  "#F8BBD0", // Soft pink
  "#C8E6C9", // Mint green
  "#D1C4E9", // Lavender
  "#FFE0B2", // Peach
  "#B3E5FC", // Sky blue
  "#FFCCBC", // Coral
  "#E1BEE7", // Light purple
  "#DCEDC8", // Lime
  "#F0F4C3", // Pale yellow-green
];

const ConfessionSchema = new Schema<IConfession>(
  {
    confession: {
      type: String,
      required: [true, "Confession text is required"],
      maxlength: [500, "Confession must be 500 characters or less"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    stickyColor: {
      type: String,
      default: () =>
        STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)],
    },
    rotation: {
      type: Number,
      default: () => Math.random() * 6 - 3, // -3 to 3 degrees
    },
    moderationReason: {
      type: String,
      default: null,
    },
    metadata: {
      ip: { type: String, select: false },
      userAgent: { type: String, select: false },
      language: { type: String, select: false },
      platform: { type: String, select: false },
      browser: { type: String, select: false },
      deviceType: { type: String, select: false },
    },
  },
  {
    timestamps: true,
    collection: "confessions",
  }
);

// Compound index for efficient querying
ConfessionSchema.index({ status: 1, createdAt: -1 });

// Virtual for truncated preview
ConfessionSchema.virtual("preview").get(function () {
  return this.confession.length > 100
    ? this.confession.substring(0, 100) + "..."
    : this.confession;
});

if (mongoose.models && mongoose.models.Confession) {
  delete (mongoose.models as Record<string, unknown>).Confession;
}

const Confession: Model<IConfession> =
  mongoose.model<IConfession>("Confession", ConfessionSchema);

export default Confession;
export { STICKY_COLORS };
