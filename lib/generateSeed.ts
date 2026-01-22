import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function generateSeed(input: string) {
  console.log("generateSeed: Starting seed generation for input:", input);
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    system: "Return a single Twitter search query string.",
    prompt: `Expand this topic into a broad Twitter/X search query using OR syntax: "${input}"`,
  });
  console.log("generateSeed: Generated seed query:", text.trim());

  return text.trim();
}
