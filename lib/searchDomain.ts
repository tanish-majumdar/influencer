import { generateSeed } from "./generateSeed";
import { searchX } from "./searchX";
import { dummySeed } from "./dummyData";

export async function searchDomain(input: string) {
  // console.log("searchDomain: Starting search for input:", input);
  // const seed = await generateSeed(input);
  // console.log("searchDomain: Generated seed:", seed);
  // const result = await searchX(seed);
  const result = await searchX(dummySeed); //delete this line later
  console.log("searchDomain: Searched X, raw results count:", result.length);
  console.log("The results are:", result);
  return result;
}
