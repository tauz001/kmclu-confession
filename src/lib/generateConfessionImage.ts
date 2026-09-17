import { ConfessionItem } from "@/components/wall/StickyNote";

/**
 * Wraps text into lines that fit within maxWidth on a 2D canvas context.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Draws a rounded rectangle path on the canvas context.
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Generates an elegant 1080x1080 high-res image of the sticky note confession.
 */
export async function generateConfessionBlob(item: ConfessionItem): Promise<Blob> {
  // Ensure custom font is ready
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.ready;
      await Promise.race([
        document.fonts.load("bold 40px Caveat"),
        new Promise((resolve) => setTimeout(resolve, 300)),
      ]);
    } catch {
      // Font fallback gracefully
    }
  }

  const canvas = document.createElement("canvas");
  const size = 1080;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");

  // 1. Dark authentic painted wall background
  const wallGrad = ctx.createRadialGradient(size / 2, size / 2, 100, size / 2, size / 2, size * 0.75);
  wallGrad.addColorStop(0, "#191d2c");
  wallGrad.addColorStop(1, "#0d0f17");
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, size, size);

  // Background subtle noise / plaster dots
  ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // 2. Top Header Stencil Badge
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  roundRect(ctx, size / 2 - 240, 50, 480, 42, 21);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#fef08a";
  ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🤫 KMCLU CONFESSION WALL • 100% ANONYMOUS", size / 2, 71);
  ctx.restore();

  // 3. Central Sticky Note Card Setup
  const cardW = 840;
  const cardH = 780;
  const cardX = (size - cardW) / 2;
  const cardY = 145;
  const rotationDeg = item.rotation !== undefined ? item.rotation : -1.8;
  const rotationRad = (rotationDeg * Math.PI) / 180;

  ctx.save();
  ctx.translate(size / 2, cardY + cardH / 2);
  ctx.rotate(rotationRad);
  ctx.translate(-size / 2, -(cardY + cardH / 2));

  // Soft Drop Shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 24;
  ctx.shadowOffsetX = 4;
  ctx.fillStyle = item.stickyColor || "#fff9c4";
  roundRect(ctx, cardX, cardY, cardW, cardH, 8);
  ctx.fill();
  ctx.restore();

  // Card Border
  ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 8);
  ctx.stroke();

  // Card paper texture grain
  ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
  for (let gx = cardX; gx < cardX + cardW; gx += 16) {
    for (let gy = cardY; gy < cardY + cardH; gy += 16) {
      if ((gx + gy) % 32 === 0) ctx.fillRect(gx, gy, 1.5, 1.5);
    }
  }

  // 4. Translucent Masking Tape at Top
  ctx.save();
  const tapeW = 200;
  const tapeH = 46;
  const tapeX = size / 2 - tapeW / 2;
  const tapeY = cardY - 20;

  ctx.translate(tapeX + tapeW / 2, tapeY + tapeH / 2);
  ctx.rotate(-0.03);
  ctx.translate(-(tapeX + tapeW / 2), -(tapeY + tapeH / 2));

  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  ctx.fillRect(tapeX, tapeY, tapeW, tapeH);

  // Dashed tear lines on sides of tape
  ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(tapeX, tapeY);
  ctx.lineTo(tapeX, tapeY + tapeH);
  ctx.moveTo(tapeX + tapeW, tapeY);
  ctx.lineTo(tapeX + tapeW, tapeY + tapeH);
  ctx.stroke();
  ctx.restore();

  // 5. Attached Photo (if present)
  let textStartY = cardY + 80;
  let availableHeight = cardH - 180;

  if (item.imageUrl) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = item.imageUrl!;
      });

      const photoW = 260;
      const photoH = 195;
      const photoX = size / 2 - photoW / 2;
      const photoY = cardY + 50;

      // Polaroid white frame
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(photoX - 10, photoY - 10, photoW + 20, photoH + 28);
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.strokeRect(photoX - 10, photoY - 10, photoW + 20, photoH + 28);

      // Photo itself
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
      ctx.restore();

      textStartY = photoY + photoH + 50;
      availableHeight -= 220;
    } catch {
      // Photo load skipped gracefully
    }
  }

  // 6. Confession Text (Handwritten font, Centered)
  ctx.fillStyle = "#1e1e1e";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const len = item.confession.length;
  let fontSize = 42;
  let lineHeight = 56;

  if (len > 300) {
    fontSize = 28;
    lineHeight = 38;
  } else if (len > 180) {
    fontSize = 34;
    lineHeight = 46;
  } else if (len > 90) {
    fontSize = 40;
    lineHeight = 52;
  }

  ctx.font = `bold ${fontSize}px 'Caveat', 'Segoe Print', cursive, sans-serif`;

  const maxTextWidth = cardW - 120;
  const lines = wrapText(ctx, item.confession, maxTextWidth);

  // Vertically center lines in available content space
  const totalTextHeight = lines.length * lineHeight;
  const textCenterY = textStartY + (availableHeight - totalTextHeight) / 2 + lineHeight / 2;

  lines.forEach((line, idx) => {
    const y = textCenterY + idx * lineHeight;
    ctx.fillText(line, size / 2, y);
  });

  // 7. Footer Divider & Info inside the sticky note
  const footerY = cardY + cardH - 65;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
  ctx.setLineDash([]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cardX + 40, footerY);
  ctx.lineTo(cardX + cardW - 40, footerY);
  ctx.stroke();

  const formattedDate = new Date(item.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, monospace";
  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.textAlign = "left";
  ctx.fillText(`🕒 ${formattedDate}`, cardX + 45, footerY + 34);

  ctx.textAlign = "right";
  ctx.fillText("KMCLU Whisper 🤫", cardX + cardW - 45, footerY + 34);

  ctx.restore(); // Restore card translation/rotation

  // 8. Bottom Canvas Footer Watermark
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, monospace";
  ctx.textAlign = "center";
  ctx.fillText("Say It. Leave It. Let It Float. • KMCLU Confessions", size / 2, size - 42);

  // Return canvas as PNG blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create image blob"));
    }, "image/png");
  });
}

/**
 * Triggers image download or native share sheet for the generated sticky note image.
 */
export async function downloadOrShareConfessionImage(item: ConfessionItem) {
  const blob = await generateConfessionBlob(item);
  const file = new File([blob], `kmclu-confession-${item._id || "note"}.png`, {
    type: "image/png",
  });

  // Try native share on mobile if supported
  if (
    typeof navigator !== "undefined" &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: "KMCLU Confession",
        text: `"${item.confession.slice(0, 100)}..."`,
      });
      return "shared";
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") return "cancelled";
    }
  }

  // Fallback to direct download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kmclu-confession-${item._id || "note"}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "downloaded";
}
