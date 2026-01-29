import { generateText, Output } from "ai";
import { z } from "zod";
import { vertex } from "../vertex";

export async function getEstablishedInfluencers(
  topic: string,
): Promise<string[]> {
  const research = await generateText({
    model: vertex("gemini-2.5-flash"),
    tools: { google_search: vertex.tools.googleSearch({}) as any },
    system: `You are an expert B2B social media researcher. Use Google Search to find current, 
             active, and authoritative LinkedIn Top Voices and thought leaders.`,
    prompt: `Research and find 30 highly influential LinkedIn profiles specifically in the domain of "${topic}". 
             Requirements:
             1. List their LinkedIn profile identifiers (the part after linkedin.com/in/).
             2. Verify they are active in 2026 and have "Top Voice" status where applicable.
             3. Present the results as a clear list.`,
  });

  const structuredResult = await generateText({
    model: vertex("gemini-2.5-flash"),
    output: Output.array({ element: z.string() }),
    system: `You are a data formatter. Extract LinkedIn identifiers from the provided text 
             and return them as a clean JSON array of strings. Remove any URLs, '@' symbols, 
             or extra text.`,
    prompt: research.text,
  });

  const queries = (research.providerMetadata?.google?.groundingMetadata as any)
    ?.webSearchQueries;
  if (queries) {
    console.log(`Verified LinkedIn profiles using: ${queries.join(", ")}`);
  }

  return structuredResult.output;
}
