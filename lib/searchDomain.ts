import { generateSeed } from "./generateSeed";
import { searchX } from "./searchX";

export async function searchDomain(input: string) {
  console.log("searchDomain: Starting search for input:", input);
  const seed = await generateSeed(input);
  console.log("searchDomain: Generated seed:", seed);
  const result = await searchX(seed);
  console.log("searchDomain: Searched X, results count:", result.length);
  return result;
}
