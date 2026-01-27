import { searchDomain } from "./searchDomain";
import { extractTopTopics } from "./extractTopics";
import { searchX } from "./searchX";
import { enrich } from "./enrich";
import { searchBuilder } from "./searchBuilder";
import { dummyTopics } from "./dummyData";
import { searchX2 } from "./searchX2";

export async function discoverByDomain(domain: string) {
  // console.log("discoverByDomain: Starting discovery for domain:", domain);
  // console.log(process.env);
  const seedPosts = await searchDomain(domain);
  console.log(
    "discoverByDomain: Retrieved seed posts count:",
    seedPosts.length,
  );
  // const topics = await extractTopTopics(seedPosts);
  const topics = dummyTopics; //delete this line later
  console.log("discoverByDomain: Extracted topics:", topics);

  const result = [];

  for (const topic of topics) {
    console.log("discoverByDomain: Processing topic:", topic);

    const seedX = searchBuilder(topic);
    const posts = await searchX(seedX);

    const usernames: string[] = [];
    const seen = new Set();

    for (const p of posts) {
      if (p.authorFollowers >= 10000 && !seen.has(p.authorUsername)) {
        seen.add(p.authorUsername);
        usernames.push(p.authorUsername);
      }
      if (usernames.length === 5) break;
    }
    const profiles = await enrich(usernames);

    const influencers = profiles.map((p) => ({
      name: p.username,
      platform: "X",
      followers: p.followers,
      bio: p.bio || null,
      categories: p.categories,
      posts: p.tweets.map((t: any) => ({
        content: t.text,
        likes: t.likes,
        comments: t.replies,
      })),
    }));

    result.push({
      topic,
      influencers,
    });

    console.log(
      `discoverByDomain: Finished topic "${topic}" with ${influencers.length} influencers.`,
    );
  }

  return result;
}
