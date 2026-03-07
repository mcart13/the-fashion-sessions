import { NextResponse } from "next/server";
import Fashn from "fashn";

const DAILY_CAP = 200;
let dailyCount = 0;
let lastResetDate = new Date().toDateString();

function checkAndIncrementDailyCount(): boolean {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailyCount = 0;
    lastResetDate = today;
  }
  if (dailyCount >= DAILY_CAP) {
    return false;
  }
  dailyCount++;
  return true;
}

export async function POST(request: Request) {
  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Virtual try-on is not configured yet." },
      { status: 503 },
    );
  }

  if (!checkAndIncrementDailyCount()) {
    return NextResponse.json(
      {
        error: "We've reached today's try-on limit. Please try again tomorrow!",
      },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { modelImage, garmentImage, category, garmentPhotoType } = body as {
    modelImage?: string;
    garmentImage?: string;
    category?: string;
    garmentPhotoType?: string;
  };

  if (!modelImage || !garmentImage) {
    return NextResponse.json(
      { error: "Both a photo and a garment selection are required." },
      { status: 400 },
    );
  }

  try {
    const client = new Fashn({ apiKey });
    const inputs: Record<string, unknown> = {
      model_image: modelImage,
      garment_image: garmentImage,
      category: category || "auto",
      garment_photo_type: garmentPhotoType || "auto",
      mode: "quality",
      moderation_level: "none",
    };
    const response = await client.predictions.subscribe({
      model_name: "tryon-v1.6",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inputs: inputs as any,
    });

    if (response.status !== "completed") {
      return NextResponse.json(
        { error: response.error?.message ?? "Try-on generation failed." },
        { status: 500 },
      );
    }

    return NextResponse.json({ output: response.output?.at(0) });
  } catch (error) {
    console.error("Fashn.ai error:", error);
    if (error instanceof Fashn.APIError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
