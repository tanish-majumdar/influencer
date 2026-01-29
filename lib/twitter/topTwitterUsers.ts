import { generateText, Output } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";

export async function getEstablishedInfluencers(
  topic: string,
): Promise<string[]> {
  const { output } = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.array({ element: z.string() }),
    system: `You are an expert social media researcher.`,
    prompt: `
List exactly 10 REAL X (Twitter) USERNAMES for authoritative leaders in the domain of "${topic}".

STRICT RULES (VERY IMPORTANT):
- Return ONLY usernames, not display names
- NO spaces allowed
- NO punctuation except underscore (_)
- NO '@' symbol
- Each username must be valid as: https://x.com/<username>
- If unsure, SKIP the account and choose another

Return ONLY a JSON array of strings.
`,
  });

  return output;
}
