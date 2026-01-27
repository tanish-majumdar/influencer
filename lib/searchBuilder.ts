import { z } from "zod";
import { twitterSeedSchema } from "./schema";

function convertToTwitterTime(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}_UTC`;
}

export function searchBuilder(
  query: string,
): z.infer<typeof twitterSeedSchema> {
  return {
    startTime: convertToTwitterTime(new Date(Date.now() - 24 * 60 * 60 * 1000)),
    endTime: convertToTwitterTime(new Date()),
    maxItems: 5,
    minLikes: 0,
    minReplies: 0,
    minRetweets: 0,
    onlyBuleVerifiedUsers: false,
    onlyImage: false,
    onlyQuote: false,
    onlyReply: false,
    onlyVerifiedUsers: false,
    onlyVideo: false,
    searchTerms: [`(${query}) lang:en min_faves:1000 -filter:replies`],
    sortBy: "Latest",
  };
}
