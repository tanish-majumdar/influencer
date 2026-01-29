import { z } from "zod";

export const instaInputSchema = z.object({
  customMapFunction: z.string().default("(object) => { return {...object} }"),
  maxItems: z.number().min(1).max(1000).default(5),
  startUrls: z.array(z.string()).min(1),
  until: z.string().default("2023-12-31"),
});
