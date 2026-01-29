import { generateText } from "ai";
import { createVertex } from "@ai-sdk/google-vertex";
import "dotenv/config"; // Make sure to load your .env variables

export async function testVertexConnection() {
  console.log("Testing Vertex AI connection...");

  try {
    // 1. Parse the JSON from your env
    const credentials = JSON.parse(
      process.env.GOOGLE_VERTEX_CREDENTIALS || "{}",
    );

    // 2. Initialize the provider
    const vertex = createVertex({
      project: credentials.project_id,
      location: "us-central1", // or your specific region
      googleAuthOptions: {
        credentials: {
          client_email: credentials.client_email,
          private_key: credentials.private_key,
        },
      },
    });

    // 3. Attempt a simple generation
    const { text } = await generateText({
      model: vertex("gemini-1.5-flash"),
      prompt: "Reply with the word 'Success' if you can read this.",
    });

    console.log("Result:", text);

    if (text.includes("Success")) {
      console.log("✅ Vertex AI is configured correctly!");
    }
  } catch (error) {
    console.error("❌ Vertex AI Connection Failed:");
    if (error instanceof Error) {
      console.error(error.message);

      // Common Error Help
      if (error.message.includes("403")) {
        console.error(
          "Hint: Check if 'Vertex AI User' role is assigned to the service account.",
        );
      }
      if (error.message.includes("404")) {
        console.error(
          "Hint: Ensure the Vertex AI API is enabled in your GCP project.",
        );
      }
    }
  }
}
