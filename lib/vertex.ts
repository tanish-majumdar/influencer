import { createVertex } from "@ai-sdk/google-vertex";
import "dotenv/config";

const credentials = JSON.parse(process.env.GOOGLE_VERTEX_CREDENTIALS || "{}");

export const vertex = createVertex({
  project: credentials.project_id,
  location: "us-central1",
  googleAuthOptions: {
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
  },
});
