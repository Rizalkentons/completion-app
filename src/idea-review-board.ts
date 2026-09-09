import { Pipeline } from "@anvia/core/pipeline";
import { generateCompletion } from "@anvia/core";
import { Studio } from "@anvia/studio";
import { model } from "./models.js";
import z from "zod";

const PitchInputSchema = z.object({
  pitch: z.string().min(10),
});

// CEO
const ceoPipeline = new Pipeline({
  id: "ceo-review",
  inputSchema: PitchInputSchema,
}).step({
  id: "ceo-step",
  run: async ({ input }) => {
    return {
      review: "CEO review placeholder",
    };
  },
});

// Analyst
const analystPipeline = new Pipeline({
  id: "analyst-review",
  inputSchema: PitchInputSchema,
}).step({
  id: "analyst-step",
  run: async ({ input }) => {
    return {
      review: "Analyst review placeholder",
    };
  },
});

// CTO
const ctoPipeline = new Pipeline({
  id: "cto-review",
  inputSchema: PitchInputSchema,
}).step({
  id: "cto-step",
  run: async ({ input }) => {
    return {
      review: "CTO review placeholder",
    };
  },
});

const ideaReviewBoard = new Pipeline({
  id: "idea-review-board",
  inputSchema: PitchInputSchema,
})
  .parallel({
    id: "parallel-reviews",
    name: "Collect reviews",
    branches: {
      ceo: ceoPipeline,
      analyst: analystPipeline,
      cto: ctoPipeline,
    },
  })
  .step({
    id: "merge",
    run: async ({ input }) => {
      console.log(input);

      return {
        finalVerdict: "Merge successful",
      };
    },
  });

new Studio([ideaReviewBoard]).start();
