import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildOverviewPrompt, buildItineraryDaysPrompt } from "@/lib/prompts";
import { birminghamMockData } from "@/lib/mock-data";
import type { City, Itinerary, ItineraryData } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

type OverviewResponse = Omit<Itinerary, "itineraries">;

async function callAI<T>(prompt: string, maxTokens: number): Promise<T> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    max_tokens: maxTokens,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  const choice = completion.choices[0];

  if (choice.finish_reason === "length") {
    throw new Error("AI response was truncated. Please try again.");
  }

  const text = choice.message.content?.trim() ?? "";
  if (!text) throw new Error("AI returned empty response");

  return JSON.parse(text) as T;
}

const encoder = new TextEncoder();

function emitLine(controller: ReadableStreamDefaultController, type: string, data: object) {
  controller.enqueue(encoder.encode(JSON.stringify({ type, ...data }) + "\n"));
}

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

      const stream = new ReadableStream({
        async start(controller) {
          const mock: Itinerary = {
            ...birminghamMockData,
            city: city.name,
            country: city.country,
          };
          const { itineraries, ...overview } = mock;

          await new Promise((r) => setTimeout(r, 800));
          emitLine(controller, "overview", overview);

          await new Promise((r) => setTimeout(r, 400));
          emitLine(controller, "1day", itineraries["1day"]);

          await new Promise((r) => setTimeout(r, 400));
          emitLine(controller, "3days", itineraries["3days"]);

          await new Promise((r) => setTimeout(r, 400));
          emitLine(controller, "5days", itineraries["5days"]);

          controller.close();
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "application/x-ndjson" },
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const overviewPromise = callAI<OverviewResponse>(buildOverviewPrompt(city), 1024).then(
            (data) => emitLine(controller, "overview", { ...data, city: city.name, country: city.country })
          );

          const day1Promise = callAI<ItineraryData>(buildItineraryDaysPrompt(city, 1), 1536).then(
            (data) => emitLine(controller, "1day", data)
          );

          const day3Promise = callAI<ItineraryData>(buildItineraryDaysPrompt(city, 3), 2560).then(
            (data) => emitLine(controller, "3days", data)
          );

          const day5Promise = callAI<ItineraryData>(buildItineraryDaysPrompt(city, 5), 4096).then(
            (data) => emitLine(controller, "5days", data)
          );

          await Promise.all([overviewPromise, day1Promise, day3Promise, day5Promise]);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Internal server error";
          emitLine(controller, "error", { message });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/x-ndjson" },
    });
  } catch (error) {
    console.error("[/api/itinerary] Erro:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
