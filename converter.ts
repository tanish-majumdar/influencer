import * as fs from "fs";
import { stringify } from "csv-stringify/sync";

interface Post {
  likes: number;
  comments: number;
}
interface Influencer {
  name: string;
  platform: string;
  followers?: number; // Optional field
  categories: string[];
  posts: Post[];
}
interface TwitterTopic {
  topic: string;
  influencers: Influencer[];
}

const calcMetrics = (inf: Influencer) => {
  // Use 500 if followers is missing
  const followers = inf.followers || 500;

  const valid = inf.posts.filter((p) => p.likes >= 0 && p.comments >= 0);
  if (!valid.length || !followers)
    return { engRate: 0, avgLikes: 0, avgComments: 0 };

  const totLikes = valid.reduce((s, p) => s + p.likes, 0);
  const totComments = valid.reduce((s, p) => s + p.comments, 0);
  return {
    engRate: (totLikes + totComments) / followers,
    avgLikes: Math.round(totLikes / valid.length),
    avgComments: Math.round(totComments / valid.length),
  };
};

const toRow = (inf: Influencer, topic?: string) => {
  const m = calcMetrics(inf);
  const followers = inf.followers || 500; // Ensure CSV shows 500, not blank/0

  return {
    Name: inf.name,
    Followers: followers,
    "Engagement Rate": `${(m.engRate * 100).toFixed(2)}%`,
    "Avg Likes": m.avgLikes,
    "Avg Comments": m.avgComments,
    Category: inf.categories?.join(", ") || topic || "Unknown",
    Platform: inf.platform,
  };
};

export const convertAllToCSV = (
  twitterPath: string,
  instaPath: string,
  linkedinPath: string,
  outPath: string,
) => {
  const twitter: TwitterTopic[] = JSON.parse(
    fs.readFileSync(twitterPath, "utf-8"),
  );
  const insta: Influencer[] = JSON.parse(fs.readFileSync(instaPath, "utf-8"));
  const linkedin: Influencer[] = JSON.parse(
    fs.readFileSync(linkedinPath, "utf-8"),
  );

  const rows = [
    ...twitter.flatMap((t) => t.influencers.map((i) => toRow(i, t.topic))),
    ...insta.map((i) => toRow(i)),
    ...linkedin.map((i) => toRow(i)),
  ];

  fs.writeFileSync(outPath, stringify(rows, { header: true }));
  console.log(`✓ Combined: ${rows.length} influencers → ${outPath}`);
};

convertAllToCSV(
  "./discovery_results_twitter.json",
  "./discovery_results_insta.json",
  "./discovery_results_linkedin.json",
  "./all_influencers.csv",
);
