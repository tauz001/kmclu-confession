import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Confession from "@/models/Confession";
import { adminActionSchema } from "@/lib/validation";

// PATCH /api/admin/confessions/[id] — Approve or reject
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    const body = await request.json();
    const parsed = adminActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid action", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();

    const confession = await Confession.findByIdAndUpdate(
      id,
      {
        status: parsed.data.status,
        moderationReason: parsed.data.reason || null,
      },
      { new: true }
    );

    if (!confession) {
      return NextResponse.json(
        { error: "Confession not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      confession: {
        _id: confession._id,
        status: confession.status,
        moderationReason: confession.moderationReason,
      },
    });
  } catch (error) {
    console.error("Error updating confession:", error);
    return NextResponse.json(
      { error: "Failed to update confession" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/confessions/[id] — Delete confession
export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    await dbConnect();

    const confession = await Confession.findByIdAndDelete(id);

    if (!confession) {
      return NextResponse.json(
        { error: "Confession not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Confession deleted",
    });
  } catch (error) {
    console.error("Error deleting confession:", error);
    return NextResponse.json(
      { error: "Failed to delete confession" },
      { status: 500 }
    );
  }
}
