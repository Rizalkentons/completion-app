import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { Studio } from "@anvia/studio";
import { generateQueries } from "./service.js";

const CompanyInputSchema = z.object({
  companyName: z.string().min(3),
  //   industry: z.string().min(3),
  //   location: z.string().min(3),
});

// pseudocode
// 1.generate query
// 2.search web each query
// 3.clean up data
// 4.extract

const getCompanyData = new Pipeline({
  id: "get-company-data",
  inputSchema: CompanyInputSchema,
}).step({
  id: "generate-queries",
  run: async (context) => {
    const companyName = context.input.companyName;
    const queries = await generateQueries(companyName);
    return queries;
  },
});
  .step({
    id: "search-web",
    run: async (context) => {
      const queries = context.input.queries;
      const firstQuery = queries[0];
})

// encriching data from exa/tavily
//   });

//   .step({
//     id: "Summarize",
//     run: async (context) => {
//       return `Summary of ${context.input}!`;
//     },
//   });

new Studio([getCompanyData]).start();

// await getCompanyData.run({
//   input: {
//     companyName: "OpenAI",
//   },
// });
