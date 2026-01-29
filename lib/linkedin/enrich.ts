import { apify } from "../apify";
import { linkedinInputSchema, linkedinProfileInputSchema } from "./schema";
import { classifier } from "../classifier";

export async function enrich(usernames: string[]) {
  console.log("enrich: Starting library-based enrichment for:", usernames);

  const profileUrls = usernames.map(
    (u) => `https://www.linkedin.com/in/${u.replace("@", "")}`,
  );
  const runPosts = await apify.actor("supreme_coder/linkedin-post").call(
    linkedinInputSchema.parse({
      urls: profileUrls,
    }),
  );
  const { items: postResults } = await apify
    .dataset(runPosts.defaultDatasetId)
    .listItems();
  const runProfiles = await apify
    .actor("harvestapi/linkedin-profile-scraper")
    .call(
      linkedinProfileInputSchema.parse({
        queries: profileUrls,
      }),
    );
  const { items: profileResults } = await apify
    .dataset(runProfiles.defaultDatasetId)
    .listItems();

  const userMap = new Map<string, any>();
  profileResults.forEach((profile: any) => {
    const username = profile.publicIdentifier;
    if (!username) return;

    userMap.set(username, {
      username,
      displayName: `${profile.firstName} ${profile.lastName}`,
      followers: profile.followerCount || 0,
      bio: `${profile.headline || ""} ${profile.about || ""}`.trim(),
      posts: [],
    });
  });
  postResults.forEach((item: any) => {
    const username = item.authorProfileId;
    if (!username || !userMap.has(username)) return;

    const user = userMap.get(username);
    if (user.posts.length < 5) {
      user.posts.push({
        text: item.text || "",
        likes: item.numLikes || 0,
        replies: item.numComments || 0,
        url: item.url,
        timestamp: item.postedAtISO,
      });
    }
  });
  const categorizedProfiles = Array.from(userMap.values()).map((user) => {
    const combinedContent = `${user.bio} ${user.posts.map((p: any) => p.text).join(" ")}`;

    const classifications = classifier.getClassifications(combinedContent);
    const categories = classifications
      .sort((a, b) => b.value - a.value)
      .slice(0, 2)
      .filter((c) => c.value > 0.1)
      .map((c) => c.label);

    return {
      ...user,
      categories: categories.length > 0 ? categories : ["General"],
    };
  });

  return categorizedProfiles;
}
