import { apify } from "./apify";

export async function enrich(usernames: string[]) {
  console.log("enrich: Starting enrichment for usernames:", usernames);

  const run = await apify.actor("apidojo/twitter-user-scraper").call({
    usernames,
    maxTweets: 10,
  });

  console.log("enrich: Actor run ID:", run.id);

  const { items } = await apify.dataset(run.defaultDatasetId).listItems();
  console.log("enrich: Retrieved items:", items.length);

  const result = items.map((u: any) => ({
    username: u.username,
    followers: u.followers || u.followersCount || 0,
    bio: u.description || u.bio || null,
    tweets: (u.tweets || []).slice(0, 10).map((t: any) => ({
      text: t.text,
      likes: t.likes || t.likeCount || 0,
      replies: t.replies || t.replyCount || 0,
    })),
  }));

  return result;
}
