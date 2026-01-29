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

export const postSchema = z.object({
  text: z.string(),
  url: z.string(),
  createdAt: z.string(),
  likes: z.number(),
  replies: z.number(),
  retweets: z.number(),
  viewCount: z.number(),
  authorUsername: z.string(),
  authorName: z.string(),
  authorFollowers: z.number(),
  isBlueVerified: z.boolean(),
});
