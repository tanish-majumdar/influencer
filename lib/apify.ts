import { ApifyClient } from "apify-client";
import "dotenv/config";

export const apify = new ApifyClient({
  token: process.env.APIFY_TOKEN!,
});
