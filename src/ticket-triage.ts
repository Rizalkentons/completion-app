import { Pipeline } from "@anvia/core/pipeline";
import { generateCompletion } from "@anvia/core";
import { Studio } from "@anvia/studio";
import { model } from "./models.js";
import z from "zod";

// Input dari user
const TicketInputSchema = z.object({
  ticket: z.string().min(10),
});

// Output yang harus dihasilkan AI
const TicketSchema = z.object({
  category: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  summary: z.string(),
});

async function extractTicket(ticket: string) {
  const result = await generateCompletion({
    model,
    instructions: `
Extract ticket information.

Return:
- category
- priority (low, medium, high)
- summary
`,
    prompt: ticket,
    outputSchema: TicketSchema,
  });

  return result.output;
}

const ticketTriage = new Pipeline({
  id: "ticket-triage",
  inputSchema: TicketInputSchema,
})
  .step({
    id: "extract-ticket",
    run: async ({ input }) => {
      return extractTicket(input.ticket);
    },
  })

  .step({
    id: "route-ticket",
    run: async ({ input }) => {
      let route = "";

      switch (input.priority) {
        case "high":
          route = "urgent-support";
          break;

        case "medium":
          route = "customer-success";
          break;

        default:
          route = "backlog";
      }

      return {
        ...input,
        route,
      };
    },
  });

new Studio([ticketTriage]).start();
