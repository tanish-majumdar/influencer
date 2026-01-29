import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { postSchema } from "./schema";

export async function extractTopTopics(posts: z.infer<typeof postSchema>[]) {
  console.log(
    "extractTopTopics: Starting liberal extraction for posts count:",
    posts.length,
  );

  const sample = posts
    .slice(0, 50)
    .map((p) => p.text)
    .join("\n");

  const { output } = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.array({
      element: z.string().max(20),
    }),
    system: `
      You are an expert in Social Media Search (SEO). 
      Your goal is to extract the 3 most "searchable" broad topics from the text.
      
      Rules:
      1. MAX 2 WORDS.
      2. USE "REAL WORLD" LANGUAGE: Only use words that a person would actually type into a search bar.
      3. NO JARGON: Avoid academic or "smart" words (e.g., no 'discourse', 'societal', 'paradigm', 'friction').
      4. BROAD BUCKETS: Group specific complaints into the simplest possible category.
    `,
    prompt: `Based on these posts, what are the 3 simplest, most common topics people are searching for? \n${sample}`,
  });

  return output;
}
