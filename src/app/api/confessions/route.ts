import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Confession from "@/models/Confession";
import { confessionSchema, paginationSchema } from "@/lib/validation";
import { moderateConfession, normalizeForDuplicateCheck } from "@/lib/moderation";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

// GET /api/confessions — Fetch approved confessions with cursor pagination
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const parsed = paginationSchema.safeParse({
      cursor: searchParams.get("cursor") || undefined,
      limit: searchParams.get("limit") || 20,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { cursor, limit } = parsed.data;

    // Build query — only approved confessions, no metadata
    const query: Record<string, unknown> = { status: "approved" };
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const confessions = await Confession.find(query)
      .select("confession stickyColor rotation createdAt imageUrl")
      .sort({ createdAt: -1 })
      .limit(limit + 1) // Fetch one extra to check if there are more
      .lean();

    const hasMore = confessions.length > limit;
    const results = hasMore ? confessions.slice(0, limit) : confessions;
    const nextCursor = hasMore
      ? results[results.length - 1].createdAt.toISOString()
      : null;

    return NextResponse.json({
      confessions: results,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching confessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch confessions" },
      { status: 500 }
    );
  }
}

// POST /api/confessions — Submit a new confession
export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    // Rate limit check
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many submissions. Please try again later.",
          resetIn: Math.ceil(rateLimit.resetIn / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)),
          },
        }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const parsed = confessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { confession, imageUrl } = parsed.data;

    // Content moderation
    const moderationResult = moderateConfession(confession);

    await dbConnect();

    // Duplicate check
    const normalized = normalizeForDuplicateCheck(confession);
    const recentConfessions = await Confession.find({
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })
      .select("confession")
      .lean();

    const isDuplicate = recentConfessions.some(
      (c) => normalizeForDuplicateCheck(c.confession) === normalized
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: "A similar confession was already submitted recently." },
        { status: 409 }
      );
    }

    // Parse user agent for metadata
    const userAgent = headersList.get("user-agent") || "";
    const language = headersList.get("accept-language")?.split(",")[0] || "";

    // Determine device type from user agent
    const isMobile = /mobile|android|iphone/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

    // Determine browser
    let browser = "unknown";
    if (/firefox/i.test(userAgent)) browser = "Firefox";
    else if (/edg/i.test(userAgent)) browser = "Edge";
    else if (/chrome/i.test(userAgent)) browser = "Chrome";
    else if (/safari/i.test(userAgent)) browser = "Safari";

    // Determine platform
    let platform = "unknown";
    if (/windows/i.test(userAgent)) platform = "Windows";
    else if (/mac/i.test(userAgent)) platform = "macOS";
    else if (/linux/i.test(userAgent)) platform = "Linux";
    else if (/android/i.test(userAgent)) platform = "Android";
    else if (/iphone|ipad/i.test(userAgent)) platform = "iOS";

    // Create confession
    const newConfession = await Confession.create({
      confession,
      imageUrl: imageUrl || undefined,
      status: moderationResult.suggestedStatus,
      moderationReason: moderationResult.reason || undefined,
      metadata: {
        ip,
        userAgent,
        language,
        platform,
        browser,
        deviceType,
      },
    });

    const confessionId = (newConfession as { _id?: unknown })?._id;

    return NextResponse.json(
      {
        success: true,
        message: moderationResult.safe
          ? "Your confession has been submitted and is under review."
          : "Your confession has been submitted for review.",
        id: confessionId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting confession:", error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to submit confession", details },
      { status: 500 }
    );
  }
}
