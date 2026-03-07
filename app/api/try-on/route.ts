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

  interface ItemPayload {
    image: string;
    name: string;
    description: string;
    type: "clothing" | "accessory";
  }

  const { modelImage, items } = body as {
    modelImage?: string;
    items?: ItemPayload[];
  };

  if (!modelImage || !items || items.length === 0) {
    return NextResponse.json(
      { error: "A photo and at least one item are required." },
      { status: 400 },
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const person = stripDataUrlPrefix(modelImage);

    // Turn 1: Establish the customer's identity with their photo ONLY.
    // This anchors the person before any garment images with other models appear.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const turn1Parts: any[] = [
      {
        text: "This is my photo. I am the customer. Memorize my face, skin tone, hair color, hair style, body shape, and proportions exactly. In the next message I will ask you to dress me in specific items.",
      },
      {
        inlineData: { data: person.data, mimeType: person.mimeType },
      },
    ];

    // Turn 2 (prefilled model response): Confirms identity lock before garments enter context.
    const turn2Parts = [
      {
        text: "I've carefully studied your photo and locked in your exact appearance: your face, skin tone, hair, and body shape. Send me the items and I'll generate you wearing them.",
      },
    ];

    // Turn 3: Each item image is individually labeled inline with its description.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const turn3Parts: any[] = [];
    for (const item of items) {
      const parsed = stripDataUrlPrefix(item.image);
      const typeLabel =
        item.type === "clothing" ? "CLOTHING ITEM" : "ACCESSORY";
      turn3Parts.push({
        text: `[${typeLabel}: "${item.name}" — ${item.description}. IGNORE any person/model in this image, extract ONLY the garment/accessory.]`,
      });
      turn3Parts.push({
        inlineData: { data: parsed.data, mimeType: parsed.mimeType },
      });
    }

    turn3Parts.push({
      text: `Now generate a single photorealistic image of ME (the customer from my first photo) wearing ALL of the items above.

RULES:
1. IDENTITY: Use MY face, skin tone, hair, and body EXACTLY as shown in my photo. The person in the output MUST be me. Any other person visible in the item reference images is just a mannequin — ignore them completely.
2. GARMENT FIDELITY: Reproduce each item's exact color, material, texture, and style as described. Do not substitute or reinterpret any garment.
3. POSE & SETTING: Keep my same pose, camera angle, and background from my original photo.
4. REALISM: Natural fit, draping, shadows, and lighting consistent with my photo.
5. OUTPUT: One single image. No text, watermarks, borders, or split views.`,
    });

    const contents = [
      { role: "user" as const, parts: turn1Parts },
      { role: "model" as const, parts: turn2Parts },
      { role: "user" as const, parts: turn3Parts },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents,
      config: {
        responseModalities: ["IMAGE", "TEXT"],
        temperature: 0.2,
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
