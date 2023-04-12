import { OpenAIApi, Configuration, ConfigurationParameters } from "openai";
import { jaroWinklerSimilarity } from "./similarity";

interface TestInput {
  input: string;
  expectedOutput: string;
}

interface FailedCase {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  accuracy: number;
}

async function testPromptAccuracy(
  prompt: string,
  testCases: TestInput[],
  openai: OpenAIApi,
  modelName: string
): Promise<{
  succeededCases: TestInput[];
  failedCases: FailedCase[];
}> {
  const failedCases: FailedCase[] = [];
  const succeededCases: TestInput[] = [];

  for (const testCase of testCases) {
    try {
      const gptResponse = await openai.createChatCompletion({
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: testCase.input,
          },
        ],
        model: modelName,
      });

      const gptOutput = gptResponse.data.choices[0].message?.content ?? "";

      if (gptOutput === testCase.expectedOutput) {
        succeededCases.push(testCase);
      } else {
        failedCases.push({
          ...testCase,
          actualOutput: gptOutput,
          accuracy: jaroWinklerSimilarity(gptOutput, testCase.expectedOutput),
        });
      }
    } catch (e) {
      console.error(
        "Failed to invoke OpenAI API",
        (e as any).response.data.error
      );
    }
  }

  return {
    succeededCases,
    failedCases,
  };
}

export async function testMany(
  prompts: string[],
  testCases: TestInput[],
  modelName: string,
  config?: ConfigurationParameters
) {
  const results = await Promise.all(
    prompts.map((prompt) => test(prompt, testCases, modelName, config))
  );
  const theMostAccuratePrompt = results.reduce((prev, curr) =>
    prev.succeededCases.length > curr.succeededCases.length ? prev : curr
  );

  console.log(
    `The most accurate prompt is: \x1b[33m${theMostAccuratePrompt.prompt}\x1b[0m`
  );
}

export async function test(
  prompt: string,
  testCases: TestInput[],
  modelName: string,
  config?: ConfigurationParameters
) {
  const openai = new OpenAIApi(
    new Configuration(
      config ?? {
        apiKey: process.env.OPENAI_API_KEY,
      }
    )
  );
  const { failedCases, succeededCases } = await testPromptAccuracy(
    prompt,
    testCases,
    openai,
    modelName
  );

  console.log(
    `PROMPT [\x1b[33m${prompt}\x1b[0m]: \x1b[33m${
      (succeededCases.length / testCases.length) * 100
    }%\x1b[0m of test cases passed`
  );

  if (failedCases.length > 0) {
    console.error("Failed cases:");
    console.table(failedCases);
  }

  return { failedCases, succeededCases, prompt };
}
