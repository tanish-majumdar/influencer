import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { discoverByDomain } from "@/lib/pipeline";
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
      fs.writeFileSync("discovery_results.json", dataToStore, "utf8");
      console.log("Results successfully saved to discovery_results.json");
    } catch (error) {
      console.error("Failed to save file:", error);
    }

    // for (const topicData of discoveryResult) {
    //   for (const influencer of topicData.influencers) {
    //     await prisma.influencer.upsert({
    //       where: {
    //         name_platform: {
    //           name: influencer.name,
    //           platform: influencer.platform,
    //         },
    //       },
    //       update: {
    //         followers: influencer.followers,
    //         bio: influencer.bio,
    //         posts: {
    //           create: influencer.posts,
    //         },
    //       },
    //       create: {
    //         name: influencer.name,
    //         platform: influencer.platform,
    //         followers: influencer.followers,
    //         bio: influencer.bio,
    //         posts: {
    //           create: influencer.posts,
    //         },
    //       },
    //     });
    //   }
    // }

    return NextResponse.json({ message: "Discovery process completed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
