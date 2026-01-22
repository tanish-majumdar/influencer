import { searchDomain } from "./searchDomain";
import { extractTopTopics } from "./extractTopics";
import { searchX } from "./searchX";
import { enrich } from "./enrich";

export async function discoverByDomain(domain: string) {
  console.log("discoverByDomain: Starting discovery for domain:", domain);
  const seedPosts = await searchDomain(domain);
  console.log(
    "discoverByDomain: Retrieved seed posts count:",
    seedPosts.length,
  );
  const topics = await extractTopTopics(seedPosts);
  console.log("discoverByDomain: Extracted topics:", topics);

  const result = [];

  for (const topic of topics) {
    console.log("discoverByDomain: Processing topic:", topic);
    const posts = await searchX(topic);
    console.log(
      "discoverByDomain: Retrieved posts for topic, count:",
      posts.length,
    );
    const users: string[] = [];
    const seen = new Set();

    for (const p of posts) {
      if (p.authorFollowers >= 10000 && !seen.has(p.authorUsername)) {
        seen.add(p.authorUsername);
        users.push(p.authorUsername);
      }
      if (users.length === 4) break;
    }
    console.log("discoverByDomain: Selected users for topic:", users);

    const profiles = await enrich(users);
    console.log("discoverByDomain: Enriched profiles count:", profiles.length);

    const influencers = profiles.map((p) => ({
      name: p.username,
      platform: "X",
      followers: p.followers,
      bio: p.bio ?? null,
      posts: p.tweets.slice(0, 10).map((t: any) => ({
        content: t.text,
        likes: t.likes,
        comments: t.replies,
      })),
    }));

    result.push({
      topic,
      influencers,
    });
    console.log("discoverByDomain: Added result for topic:", topic);
  }

  console.log(
    "discoverByDomain: Completed discovery, result count:",
    result.length,
  );
  return result;
}
