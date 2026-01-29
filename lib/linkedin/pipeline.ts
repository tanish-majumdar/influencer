import { enrich } from "./enrich";
import { getEstablishedInfluencers } from "./topLinkedinUsers";
import { userProfiles } from "./dummyData";

export async function discoverByDomain(domain: string) {
  const usernames = await getEstablishedInfluencers(domain);
  console.log("Established Influencers:", usernames);
  return;
  // const usernames = userProfiles;
  const profiles = await enrich(usernames);

  const influencers = profiles.map((p) => ({
    name: p.username,
    platform: "Linkedin",
    followers: p.followers,
    bio: p.bio || null,
    categories: p.categories,
    posts: p.posts.map((t: any) => ({
      content: t.text,
      likes: t.likes,
      comments: t.replies,
    })),
  }));

  return influencers;
}
