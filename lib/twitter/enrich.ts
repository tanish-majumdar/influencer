import { apify } from "../apify";
import natural from "natural";

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
    (u) => `https://x.com/${u.replace("@", "")}`,
  );

  const CHUNK_SIZE = 5;
  const urlChunks = [];

  for (let i = 0; i < profileUrls.length; i += CHUNK_SIZE) {
    urlChunks.push(profileUrls.slice(i, i + CHUNK_SIZE));
  }
  console.log(`enrich: Processing ${urlChunks.length} batches...`);
  const results = [];

  for (const chunk of urlChunks) {
    const run = await apify.actor("scraper_one/x-profile-posts-scraper").call({
      profileUrls: chunk,
      resultsLimit: 5,
    });
    const { items } = await apify.dataset(run.defaultDatasetId).listItems();
    results.push(...items);
  }

  const userMap = new Map<string, any>();
  results.forEach((item: any) => {
    const username = item.author?.screenName;
    if (!username) return;

    if (!userMap.has(username)) {
      userMap.set(username, {
        username,
        followers: item.author.followersCount || 0,
        bio: item.author.description || "",
        tweets: [],
      });
    }
    const user = userMap.get(username);
    if (user.tweets.length < 5) {
      user.tweets.push({
        text: item.postText,
        likes: item.favouriteCount || 0,
        replies: item.replyCount || 0,
      });
    }
  });

  const categorizedProfiles = Array.from(userMap.values()).map((user) => {
    const combinedContent = `${user.bio} ${user.tweets.map((t: any) => t.text).join(" ")}`;

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

  return categorizedProfiles;
}
