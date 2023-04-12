import { test } from "./src";

const model = "gpt-3.5-turbo";
const testCases = [
  {
    input: "Macbook",
    expectedOutput: "Apple",
  },
  {
    input: "Mustang",
    expectedOutput: "Ford",
  },
  {
    input: "Surface",
    expectedOutput: "Microsoft",
  },
  {
    input: "BigMac",
    expectedOutput: "McDonalds",
  },
  {
    input: "Pumpkin Spice Latte",
    expectedOutput: "Starbucks",
  },
];

test(
  "Classify brand to a product. Reply only with brand name without any other info",
  testCases,
  model
);

// This one is more effective
test(
  "Associate brand with a product. Respond only with brand name without any other info. Do not end with a period.",
  testCases,
  model
);
