import { generateText, Output } from "ai";
import { z } from "zod";
import { vertex } from "../vertex";

export async function getEstablishedInfluencers(
  topic: string,
): Promise<string[]> {
  const result = await generateText({
    model: vertex("gemini-2.5-flash"),
    tools: { google_search: vertex.tools.googleSearch({}) as any },
    output: Output.array({ element: z.string() }),
    system: `You are an expert social media researcher. Use Google Search to find current, 
             active, and authoritative Instagram leaders for any given topic.`,
    prompt: `Find 30 extremely famous Instagram usernames who are authoritative leaders 
             specifically in the domain of "${topic}". 
             Requirements:
             1. Return ONLY the usernames (no '@').
             2. Ensure they are currently active in 2026.
             3. Verify their authority via search results.`,
  });
  const hasSources = result.sources && result.sources.length > 0;
  const hasGroundingMetadata =
    !!result.providerMetadata?.google?.groundingMetadata;

  if (!hasSources && !hasGroundingMetadata) {
    console.warn(
      "STRICT CHECK FAILED: The response was not grounded in Google Search. Results may be hallucinatory.",
    );
  }
  const queries = (result.providerMetadata?.google?.groundingMetadata as any)
    ?.webSearchQueries;
  if (queries) {
    console.log(`Verified using Google Search queries: ${queries.join(", ")}`);
  }

  return result.output;
}
