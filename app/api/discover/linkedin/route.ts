import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/db";
import { discoverByDomain } from "@/lib/linkedin/pipeline";
import fs from "fs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");
  if (!domain) {
    return NextResponse.json(
      { error: "Domain parameter is required" },
      { status: 400 },
    );
  }

  try {
    const discoveryResult = await discoverByDomain(domain);
    console.log(discoveryResult);

    const dataToStore = JSON.stringify(discoveryResult, null, 2);
    try {
      fs.writeFileSync("discovery_results_linkedin.json", dataToStore, "utf8");
      console.log(
        "Results successfully saved to discovery_results_linkedin.json",
      );
    } catch (error) {
      console.error("Failed to save file:", error);
    }
    return NextResponse.json({ message: "Discovery process completed" });
  } catch (error) {
    console.error("Error during discovery process:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
