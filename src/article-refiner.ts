import { Pipeline } from "@anvia/core/pipeline";
import { generateCompletion } from "@anvia/core";
import { Studio } from "@anvia/studio";
import { model } from "./models.js";
import z from "zod";

const ArticleInputSchema = z.object({
  topic: z.string().min(3),
});

async function createDraft(topic: string) {
  const result = await generateCompletion({
    model,
    instructions: `
You are an expert writer.
Write a first draft article about the given topic.
`,
    prompt: topic,
  });

  return {
    draft: result.text,
  };
}

async function critiqueDraft(article: string) {
  const result = await generateCompletion({
    model,
    instructions: `
You are a professional editor.

Review the article and provide:
1. Strengths
2. Weaknesses
3. Suggestions for improvement
`,
    prompt: article,
  });

  return {
    draft: article,
    critique: result.text,
  };
}

async function rewriteDraft(article: string, critique: string) {
  const result = await generateCompletion({
    model,
    instructions: `
Rewrite the article using the critique.
Improve clarity, examples, and structure.
`,
    prompt: `
ARTICLE:
${article}

CRITIQUE:
${critique}
`,
  });

  return {
    finalArticle: result.text,
  };
}

const articleRefiner = new Pipeline({
  id: "article-refiner",
  inputSchema: ArticleInputSchema,
})
  .step({
    id: "draft",
    run: async (context) => {
      return createDraft(context.input.topic);
    },
  })
  .step({
    id: "critique",
    run: async (context) => {
      return critiqueDraft(context.input.draft);
    },
  })
  .step({
    id: "rewrite",
    run: async (context) => {
      return rewriteDraft(context.input.draft, context.input.critique);
    },
  });

new Studio([articleRefiner]).start();

const result = await articleRefiner.run({
  input: {
    topic: "Artificial Intelligence",
  },
});

console.dir(result, { depth: null });
