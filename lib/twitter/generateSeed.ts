import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { twitterSeedSchema } from "./schema";

export async function generateSeed(input: string) {
  const { output } = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.object({
      schema: twitterSeedSchema,
    }),
    system: `
      You are a Twitter/X scraping config generator. 
      CRITICAL RULES for field formatting:
      1. searchTerms: MUST be a single string containing the full query logic. 
         - Pattern: "([Topic] OR [Synonym]) lang:en min_faves:1000 -filter:replies"
      2. min_faves should always be included in searchTerms and should be set to 1000.
      3. startTime/endTime: MUST use format "YYYY-MM-DD_HH:MM:SS_UTC".
      4. minLikes: Set to 0 if the filter is already inside the searchTerms string.
      5. sortBy: Default to "Latest".
      6. maxItems: Set to 5.
      
      Current Time: ${new Date().toISOString()}
    `,
    prompt: `Create a configuration for the topic: "${input}" based on the last 24 hours.`,
  });

  return output;
}
