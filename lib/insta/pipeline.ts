import { enrich } from "./enrich";
import { getEstablishedInfluencers } from "./topInstaUsers";
import { userProfiles } from "./dummyData";

export async function discoverByDomain(domain: string) {
  //   const usernames = await getEstablishedInfluencers(domain);
  const usernames = userProfiles;
  const profiles = await enrich(usernames);

  const influencers = profiles.map((p) => ({
    name: p.username,
    platform: "Instagram",
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
