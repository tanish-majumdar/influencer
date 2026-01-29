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
    prompt: `List 15 extremely famous Instagram usernames who are authoritative leaders specifically in the domain of "${topic}". 
             Return ONLY the usernames without the '@' symbol. 
             Focus on high-engagement, verified-style accounts.`,
  });
  return output;
}
