import {
  ChatSession,
  CountTokensRequest,
  EnhancedGenerateContentResponse,
  GenerativeModel,
  Part,
} from "@google/generative-ai";

export async function streamToStdout(stream: AsyncGenerator<EnhancedGenerateContentResponse, any, unknown>) {
  console.log("Streaming...\n");
  for await (const chunk of stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
  console.log("\n");
}

export async function displayTokenCount(
  model: GenerativeModel,
  request: string | (string | Part)[] | CountTokensRequest
) {
  const { totalTokens } = await model.countTokens(request);
  console.log("Token count: ", totalTokens);
}

export async function displayChatTokenCount(model: GenerativeModel, chat: ChatSession, msg: string) {
  const history = await chat.getHistory();
  const msgContent = { role: "user", parts: [{ text: msg }] };
  await displayTokenCount(model, { contents: [...history, msgContent] });
}
