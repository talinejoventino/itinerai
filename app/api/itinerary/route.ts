import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildItineraryPrompt } from "@/lib/prompts";
import { birminghamMockData } from "@/lib/mock-data";
import type { City, Itinerary } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

export async function POST(req: NextRequest) {
  try {
    const city: City = await req.json();

    if (!city?.name || !city?.country) {
      return NextResponse.json(
        { error: "Invalid city. Provide name and country." },
        { status: 400 }
      );
    }

    if (USE_MOCK_DATA) {
      console.log("[MOCK MODE]:", city.name);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockItinerary: Itinerary = {
        ...birminghamMockData,
        city: city.name,
        country: city.country,
      };

      return NextResponse.json(mockItinerary);
    }

    const prompt = buildItineraryPrompt(city);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = completion.choices[0].message.content?.trim() ?? "";

    // Extract JSON even if it comes with extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON");
    }

    const itinerary: Itinerary = JSON.parse(jsonMatch[0]);

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("[/api/itinerary] Erro:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
