import {
  ChatSession,
  CountTokensRequest,
  EnhancedGenerateContentResponse,
  GenerateContentResult,
  Part,
} from "@google/generative-ai";
import { oneLine, stripIndents } from "common-tags";
import { AiModels } from "../lib/constants";
import { GenerativeAIService } from "./ai.service";

export class ChatService extends GenerativeAIService {
  initialConvo: any;
  constructor(
    apiKey: string,
    private readonly conversation: { context: string; questions: string[] }
  ) {
    super(apiKey);
    this.initChat();
  }

  initChat = async (): Promise<ChatSession> => {
    const conversation = this.conversation;
    this.initialConvo = {
      history: [
        {
          role: "user",
          parts: [
            {
              text: stripIndents`${oneLine` 
      Using the information contained in the context,
      give a comprehensive answer to the question.
      Respond only to the question asked, response should be concise and relevant to the question.
      You should imply how the mybid project intend to solve issues relating to the question if you can find 
      any within the given context.
      If the answer cannot be deduced from the context, do not give an answer.
      context: ${conversation.context}     
      `}`,
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know about Mybid?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 200,
      },
    };
    const aiModel = AiModels.gemini;
    const model = await this.generativeModel(aiModel);
    return await model.startChat(this.initialConvo);
  };
  async run() {
    const msg = `${this.conversation.questions[0]}`;
    this.displayChatTokenCount(msg);
    const chat: ChatSession = await this.initChat();
    const result: GenerateContentResult = await chat.sendMessage(msg);
    const response: EnhancedGenerateContentResponse = await result.response;
    const text: string = response.text();
    console.log(text);
    // console.log(JSON.stringify(await chat.getHistory(), null, 2));
    return text;
  }

  displayTokenCount = async (request: string | (string | Part)[] | CountTokensRequest) => {
    const aiModel = AiModels.gemini;
    const model = this.generativeModel(aiModel);
    const { totalTokens } = await model.countTokens(request);
    console.log("Token count", totalTokens);
  };

  displayChatTokenCount = async (msg: string) => {
    const chat = await this.initChat();
    const history = await chat.getHistory();
    const msgContent = { role: "user", parts: [{ text: msg }] };
    await this.displayTokenCount({ contents: [...history, msgContent] });
  };

  streamToStdout = async (stream: AsyncGenerator<EnhancedGenerateContentResponse, any, unknown>) => {
    console.log("Streaming...\n");
    for await (const chunk of stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
    }
    console.log("\n");
  };
}
