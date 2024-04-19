import { ChatSession, CountTokensRequest, EnhancedGenerateContentResponse, Part } from "@google/generative-ai";
import { oneLine, stripIndents } from "common-tags";
import { AiModels } from "../lib/constants";
import { GenerativeAIService } from "./generative-ai-service";
import { IChatResponseDTO, IHistory } from "../repositories/dtos/dtos";

export class ChatService extends GenerativeAIService {
  initialConvo: any;
  constructor(
    apiKey: string,
    private readonly conversation: {
      context: string;
      questions: string[];
      chatHistory: IHistory[];
    }
  ) {
    super(apiKey);
    this.initChat();
  }

  initChat = async (): Promise<ChatSession> => {
    const conversation = this.conversation;
    console.log("hi", conversation.context);
    this.initialConvo = {
      history: [
        {
          role: "user",
          parts: [
            {
              text: stripIndents`${oneLine` 
              Give a coincise answer
              Examine and comprehend the given context.
              Avoid External Sources: Do not search for information outside of the given context to formulate your response.
              If you cannot find any relevent information in relating to the Question, just answer I am sorry I dont know.
              Here is the context: ${conversation.context}
              Remember: Avoid External Sources: Do not search for information outside of the given context to formulate your response, 
              do not search the web.
              If you cannot find any relevent information in relating to the Question, just answer I am sorry I dont know.
              if ${conversation.context} does not contain any information just answer I am sorry I dont know.
      `}`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: conversation.questions[0],
            },
          ],
        },
        ...this.conversation.chatHistory,
      ],
      // generationConfig: {
      //   maxOutputTokens: 200,
      // },
    };
    const aiModel = AiModels.gemini;
    const model = this.generativeModel(aiModel);
    return model.startChat(this.initialConvo);
  };

  async run(): Promise<Partial<IChatResponseDTO>> {
    const question = `${this.conversation.questions[0]}`;
    this.displayChatTokenCount(question);
    const chat: ChatSession = await this.initChat();
    const result = await chat.sendMessageStream(question);
    let text = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      text += chunkText;
    }
    return {
      answer: text,
    };
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
