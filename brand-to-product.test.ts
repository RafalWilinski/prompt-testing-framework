import { test, testMany } from "./src";

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

testMany(
  [
    "Given the product, return company name",
    "Return company for associated product",
    "Classify brand to a product. Reply only with brand name without any other info",
    "Associate brand with a product. Respond only with brand name without any other info. Do not end with a period. Ignore apostrophes.",
  ],
  testCases,
  model
);
