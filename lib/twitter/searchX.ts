import { apify } from "../apify";
import { z } from "zod";
import { twitterSeedSchema } from "./schema";

export async function searchX(query: z.infer<typeof twitterSeedSchema>) {
  console.log("searchX: Starting search for query:", query);

  const run = await apify
    .actor("fastcrawler/tweet-x-twitter-scraper-0-2-1k-pay-per-result-v2")
    .call(
      {
        ...query,
      },
      {
        maxTotalChargeUsd: 0.01,
      },
    );

  console.log("searchX: Actor run ID:", run.id);

  // const run = { defaultDatasetId: "efW3biSgwkLzrTf3J" }; //delete this line later

  const { items } = await apify.dataset(run.defaultDatasetId).listItems();
  // console.log(items);
  console.log("searchX: Retrieved items:", items.length);
  const result = items.map((t: any) => ({
    text: t.text,
    url: t.url,
    createdAt: t.createdAt,
    likes: t.likeCount || 0,
    replies: t.replyCount || 0,
    retweets: t.retweetCount || 0,
    viewCount: t.viewCount ? parseInt(t.viewCount) : 0,
    authorUsername: t.author?.userName || "unknown",
    authorName: t.author?.name || "unknown",
    authorFollowers: t.author?.followers || 0,
    isBlueVerified: t.author?.isBlueVerified || false,
  }));

  console.log("searchX: Processed results count:", result.length);

  return result;
}
