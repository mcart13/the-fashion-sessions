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

  const { modelImage, itemImages } = body as {
    modelImage?: string;
    itemImages?: string[];
  };

  if (!modelImage || !itemImages || itemImages.length === 0) {
    return NextResponse.json(
      { error: "A photo and at least one item are required." },
      { status: 400 },
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const person = stripDataUrlPrefix(modelImage);

    // Build image parts: person photo first, then each selected item
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageParts: any[] = [
      { inlineData: { data: person.data, mimeType: person.mimeType } },
    ];

    for (const img of itemImages) {
      const item = stripDataUrlPrefix(img);
      imageParts.push({
        inlineData: { data: item.data, mimeType: item.mimeType },
      });
    }

    // Build a prompt that references each item image by number
    const itemCount = itemImages.length;
    let itemRef: string;
    if (itemCount === 1) {
      itemRef = "the item shown in image 2";
    } else {
      const refs = itemImages.map((_, i) => `image ${i + 2}`);
      itemRef = `the items shown in ${refs.join(" and ")}`;
    }

    const prompt = `Generate a photorealistic image of the person in image 1 wearing ${itemRef}. Preserve the person's face, body shape, skin tone, and hair exactly as they are. Each item should fit naturally with realistic draping, shadows, and lighting that matches the original photo. Keep the same pose and background from image 1. Do not add any text or watermarks.`;

    const contents = [
      {
        role: "user" as const,
        parts: [...imageParts, { text: prompt }],
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
      { error: "No image was generated. Try a different photo or item." },
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
