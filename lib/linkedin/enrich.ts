import { apify } from "../apify";
import natural from "natural";
import { linkedinInputSchema } from "./schema";

const classifier = new natural.BayesClassifier();
classifier.addDocument(
  "software developer coding javascript typescript saas web tech",
  "Tech",
);
classifier.addDocument(
  "ai llm machine learning gpt chatbot neural automation",
  "AI",
);
classifier.addDocument(
  "bitcoin crypto web3 ethereum blockchain nft finance",
  "Crypto",
);
classifier.addDocument(
  "politics election government policy news vote economy",
  "Politics",
);
classifier.addDocument(
  "stocks investing finance money market trading venture",
  "Finance",
);
classifier.addDocument("funny lol meme joke sarcasm humor comedy", "Humor");

classifier.train();

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

  const { items: results } = await apify
    .dataset(runPosts.defaultDatasetId)
    .listItems();

  const userMap = new Map<string, any>();

  results.forEach((item: any) => {
    const username = item.authorProfileId;
    if (!username) return;

    if (!userMap.has(username)) {
      userMap.set(username, {
        username,
        displayName: item.authorName,
        bio: item.author?.occupation || "",
        posts: [],
      });
    }

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
