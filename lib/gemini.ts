import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function extractTopTopics(posts: any[]) {
  console.log(
    "extractTopTopics: Starting extraction for posts count:",
    posts.length,
  );
  const sample = posts
    .slice(0, 50)
    .map((p) => p.text)
    .join("\n");
  console.log("extractTopTopics: Sample text length:", sample.length);

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    system: "Return a JSON array of 3 short topic phrases.",
    prompt: `From these tweets, identify the top 3 distinct topics:\n${sample}`,
  });
  console.log("extractTopTopics: Generated text from AI:", text);

  const result = JSON.parse(text);
  console.log("extractTopTopics: Parsed topics:", result);
  return result;
}
