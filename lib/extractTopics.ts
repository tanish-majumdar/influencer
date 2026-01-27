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
      element: z.string(),
    }),
    system: `
      You are a high-level trend analyst. 
      Instead of literal topics, extract 3 broad, liberal, and conceptual themes. 
      Think 'Industry Shifts', 'Cultural Sentiments', or 'Macro Trends' rather than specific keywords.
      Keep them under 4 words each.
    `,
    prompt: `Analyze the following discourse and identify the 3 most significant liberal themes or overarching narratives:\n${sample}`,
  });

  return output;
}
