import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

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

function stripDataUrlPrefix(dataUrl: string): {
  data: string;
  mimeType: string;
} {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (match) {
    return { data: match[2], mimeType: match[1] };
  }
  return { data: dataUrl, mimeType: "image/jpeg" };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
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

  const { modelImage, garmentImage } = body as {
    modelImage?: string;
    garmentImage?: string;
  };

  if (!modelImage || !garmentImage) {
    return NextResponse.json(
      { error: "Both a photo and a garment selection are required." },
      { status: 400 },
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const person = stripDataUrlPrefix(modelImage);
    const garment = stripDataUrlPrefix(garmentImage);

    const contents = [
      {
        role: "user" as const,
        parts: [
          {
            inlineData: { data: person.data, mimeType: person.mimeType },
          },
          {
            inlineData: { data: garment.data, mimeType: garment.mimeType },
          },
          {
            text: "Generate a photorealistic image of the person in the first image wearing the clothing from the second image. Preserve the person's face, body shape, skin tone, and hair exactly as they are. The clothing should fit naturally on the person's body with realistic draping, shadows, and lighting that matches the original photo. Keep the same pose and background from the first image. Do not add any text or watermarks.",
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents,
      config: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: "Try-on generation failed. Please try again." },
        { status: 500 },
      );
    }

    const parts = candidates[0].content?.parts;
    if (!parts) {
      return NextResponse.json(
        { error: "Try-on generation failed. No content returned." },
        { status: 500 },
      );
    }

    for (const part of parts) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inline = (part as any).inlineData;
      if (inline?.data) {
        const mimeType = inline.mimeType || "image/png";
        const dataUrl = `data:${mimeType};base64,${inline.data}`;
        return NextResponse.json({ output: dataUrl });
      }
    }

    return NextResponse.json(
      { error: "No image was generated. Try a different photo or garment." },
      { status: 500 },
    );
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
