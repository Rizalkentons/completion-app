import {
  generateCompletion,
  streamCompletion,
  type Message,
} from "@anvia/core";
import { getModel, model } from "./models.js";
import { input, select } from "@inquirer/prompts";
// import z, { date } from "zod";

// const EventSchema = z.object({
//   title: z.string(),
//   location: z.string(),
//   datetime: z.string(),
// });

// caller / core
// untuk melakukan streaming ubah generate menjadi stream(dan tidak perlu menggunakan await)
// streaming kita gunakan untuk menginform bahwa kita masih dalam proses develop atau ux feedback

// memory
const messages: Message[] = [
  { role: "system", content: "you are a helpful assistant" },
];

const selectedModel = await select({
  message: "choose model: ",
  choices: [
    { name: "gpt-5.6-luna", value: "gpt-5.6-luna" },
    { name: "glm-5.3-flash", value: "glm-5.3-flash" },
  ],
});

while (true) {
  const userInput = await input({ message: "you: " });
  if (userInput === "exit") {
    console.log(messages);
    break;
  }

  messages.push({ role: "user", content: userInput });

  const response = streamCompletion({
    model: getModel(selectedModel),
    messages: messages,
    //   method 1 (single shot,request -> got the request -> done)
    // prompt: userInput,
    // instructions: "you are helpfull assistant",
    //   outputSchema: EventSchema,
    //   -----------------------------------------------
    //   method 2 (di gunakan untuk completion yang punya memory)
    //   messages: [
    //     { role: "system", content: "only answer in emojis,no text" },
    //     { role: "user", content: "what is most favorite dish in japan" },
    //   ],
  });
  console.log("assistant: ");
  let assistantMessage = "";
  for await (const chunk of response) {
    if (chunk.type === "reasoning_delta") {
      process.stdout.write(chunk.delta);
    }
    if (chunk.type === "text_delta") {
      process.stdout.write(chunk.delta);
      assistantMessage += chunk.delta;
    }
    //   if (chunk.type === "final") {
    //     console.log(chunk.result.usage);
    //   }
  }
  messages.push({ role: "assistant", content: assistantMessage });
  console.log("\n");
}

// console.log(response.output);
// console.log(response.usage);

// stateless adalah contoh ketika ai tidak bisa mensummerize percakapan yang sedari tadi sudah di mulai
