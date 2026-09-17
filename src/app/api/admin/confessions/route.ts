import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Confession from "@/models/Confession";
import { adminFilterSchema } from "@/lib/validation";

// GET /api/admin/confessions — List confessions with filters
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const parsed = adminFilterSchema.safeParse({
      status: searchParams.get("status") || "pending",
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { status, search, page, limit } = parsed.data;

    // Build query
    const query: Record<string, unknown> = {};
    if (status !== "all") {
      query.status = status;
    }
    if (search) {
      query.confession = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [confessions, total] = await Promise.all([
      Confession.find(query)
        .select("+metadata.ip +metadata.userAgent +metadata.language +metadata.platform +metadata.browser +metadata.deviceType")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Confession.countDocuments(query),
    ]);

    // Get counts for each status
    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      Confession.countDocuments({ status: "pending" }),
      Confession.countDocuments({ status: "approved" }),
      Confession.countDocuments({ status: "rejected" }),
    ]);

    return NextResponse.json({
      confessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        total: pendingCount + approvedCount + rejectedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching admin confessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch confessions" },
      { status: 500 }
    );
  }
}
