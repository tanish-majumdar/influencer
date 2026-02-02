import { apify } from "../apify";
import { googleSearchInputSchema } from "./schema";

function extractLinkedInSlugFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("linkedin.com")) return null;
    const m = u.pathname.match(/^\/in\/([^\/?#]+)\/?$/i);
    return m?.[1] ? decodeURIComponent(m[1]).trim() : null;
  } catch {
    return null;
  }
}

interface GoogleSearchResult {
  rank: number;
  domain: string;
  url: string;
  title: string;
  snippet: string;
  favicon: string;
  deeplink: string;
  keyword: string;
}

export async function getEstablishedInfluencers(
  topic: string,
): Promise<string[]> {
  console.log("Discovering established influencers for topic:", topic);
  const query = `site:linkedin.com/in ("10K followers" OR "20K followers" OR "30K followers") "${topic}"`;

  const run = await apify
    .actor("s-r/free-google-search-results-serp---only-0-25-per-1-000-results")
    .call(
      googleSearchInputSchema.parse({
        queries: [query],
        maxResults: 50,
        country: "us",
      }),
    );

  const { items } = await apify.dataset(run.defaultDatasetId).listItems();

  console.log("Google Search results count:", items.length);

  const usernames: string[] = [];
  const seen = new Set<string>();

  for (const item of items as unknown as GoogleSearchResult[]) {
    const slug = extractLinkedInSlugFromUrl(item.url);
    if (slug && !seen.has(slug.toLowerCase())) {
      seen.add(slug.toLowerCase());
      usernames.push(slug);
    }
  }

  console.log("Extracted usernames:", usernames);
  return usernames;
}
