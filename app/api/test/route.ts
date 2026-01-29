import { testVertexConnection } from "@/lib/test";

export function GET() {
  testVertexConnection();
  return new Response(
    "Vertex AI connection test initiated. Check server logs.",
  );
}
