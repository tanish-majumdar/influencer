import { twitterSeedSchema } from "./schema";

export const dummySeed = twitterSeedSchema.parse({
  startTime: "2026-01-26_08:02:22_UTC",
  endTime: "2026-01-27_08:02:22_UTC",
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
  searchTerms: [
    "(AI OR Artificial Intelligence) lang:en min_faves:1000 -filter:replies",
  ],
  sortBy: "Latest",
});

export const dummyTopics = ["AI"];
