import { z } from "zod";

// Sanitize HTML/script tags from input
function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove inline event handlers
    .trim();
}

export const confessionSchema = z.object({
  confession: z
    .string()
    .min(1, "Confession cannot be empty")
    .max(500, "Confession must be 500 characters or less")
    .transform(sanitizeInput)
    .refine((val) => val.length > 0, {
      message: "Confession cannot be empty after sanitization",
    }),
  imageUrl: z.string().max(2500000, "Image exceeds maximum allowed size").optional(),
});

export const adminActionSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  reason: z.string().optional(),
});

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const adminFilterSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "all"]).default("pending"),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type ConfessionInput = z.infer<typeof confessionSchema>;
export type AdminAction = z.infer<typeof adminActionSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type AdminFilterInput = z.infer<typeof adminFilterSchema>;
