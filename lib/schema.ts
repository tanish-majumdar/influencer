import { z } from "zod";

export const twitterSeedSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  maxItems: z.number(),
  minLikes: z.number(),
  minReplies: z.number(),
  minRetweets: z.number(),
  onlyBuleVerifiedUsers: z.boolean(),
  onlyImage: z.boolean(),
  onlyQuote: z.boolean(),
  onlyReply: z.boolean(),
  onlyVerifiedUsers: z.boolean(),
  onlyVideo: z.boolean(),
  searchTerms: z.array(z.string()),
  sortBy: z.enum(["Latest", "Top"]),
});

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
