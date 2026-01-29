import { z } from "zod";

export const linkedinInputSchema = z.object({
  deepscrape: z.boolean().default(true),
  limitPerSource: z.number().min(1).max(100).default(5),
  rawData: z.boolean().default(false),
  urls: z.array(z.string()).min(1),
  scrapeUntil: z.string().default("2025-10-01"),
});

export const linkedinProfileInputSchema = z.object({
  profileScraperMode: z
    .string()
    .default("Profile details no email ($4 per 1k)"),
  queries: z.array(z.string()),
});
