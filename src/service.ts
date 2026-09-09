import { generateCompletion } from "@anvia/core";
import { model } from "./models.js";
import z from "zod";
import { tavily } from "@tavily/core";
import "dotenv/config";

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! });

const QueriesSchema = z.object({
  query: z.array(z.string()),
});

const GENERATE_QUERIES_INSTRUCTIONS = `
You are an expert in company data research, your task is to generate queries to get following data:
- Company Profile
- Financial Statement (Invesment, Internal Statement)
- Company Employes
- Sectors
- Valuation`;

export async function generateQueries(companyName: string) {
  const result = await generateCompletion({
    model,
    instructions: GENERATE_QUERIES_INSTRUCTIONS,
    prompt: `Generate queries for company: ${companyName}`,
    outputSchema: QueriesSchema,
  });

  return result.output;
}

export async function searchWeb(query: string) {
  const result = await tavilyClient.search(query);
  return result;
}
