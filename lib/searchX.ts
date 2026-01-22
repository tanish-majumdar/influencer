import { apify } from "./apify";

export async function searchX(query: string) {
  console.log("searchX: Starting search for query:", query);

  const run = await apify.actor("apidojo/tweet-scraper").call({
    searchTerms: [query],
    maxTweets: 100,
    includeReplies: false,
    includeRetweets: false,
  });

  console.log("searchX: Actor run ID:", run.id);

  const { items } = await apify.dataset(run.defaultDatasetId).listItems();
  console.log("searchX: Retrieved items:", items.length);

  const result = items.map((t: any) => ({
    text: t.text,
    authorUsername: t.username,
    authorFollowers: t.userFollowers || 0,
    likes: t.likes || 0,
    replies: t.replies || 0,
  }));

  return result;
}
