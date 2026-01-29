import { apify } from "../apify";
import { instaInputSchema } from "./schema";
import { classifier } from "../classifier";

export async function enrich(usernames: string[]) {
  console.log("enrich: Starting library-based enrichment for:", usernames);

  const profileUrls = usernames.map(
    (u) => `https://www.instagram.com/${u.replace("@", "")}`,
  );

  const allCategorizedProfiles: any[] = [];

  for (const profileUrl of profileUrls) {
    try {
      const runPosts = await apify.actor("apidojo/instagram-scraper").call(
        instaInputSchema.parse({
          startUrls: [profileUrl],
        }),
      );

      const { items: results } = await apify
        .dataset(runPosts.defaultDatasetId)
        .listItems();

      const userMap = new Map<string, any>();

      results.forEach((item: any) => {
        // Use optional chaining to prevent crashes if 'owner' is missing
        const username = item.owner?.username;
        if (!username) return;

        if (!userMap.has(username)) {
          userMap.set(username, {
            username,
            followers: item.owner?.followerCount || 0,
            bio: item.biography || "",
            posts: [],
          });
        }

        const user = userMap.get(username);
        if (user.posts.length < 5) {
          user.posts.push({
            text: item.caption || "",
            likes: item.likeCount || 0,
            replies: item.commentCount || 0,
            url: item.url,
          });
        }
      });

      const categorizedProfiles = Array.from(userMap.values()).map((user) => {
        const combinedContent = `${user.bio} ${user.posts.map((p: any) => p.text).join(" ")}`;

        const classifications = classifier.getClassifications(combinedContent);
        const categories = classifications
          .sort((a, b) => b.value - a.value)
          .slice(0, 2)
          .filter((c) => c.value > 0)
          .map((c) => c.label);

        return {
          ...user,
          categories: categories.length > 0 ? categories : ["General"],
        };
      });

      allCategorizedProfiles.push(...categorizedProfiles);
    } catch (error) {
      // If one profile fails, log it and continue to the next one
      console.error(`Error enriching profile ${profileUrl}:`, error);
      continue;
    }
  }

  return allCategorizedProfiles;
}
