import { ChatSession, CountTokensRequest, EnhancedGenerateContentResponse, Part } from "@google/generative-ai";
import { oneLine, stripIndents } from "common-tags";
import { GenerativeAIService } from "./ai.service";
import { AiModels } from "../lib/constants";

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
    const msg1 = `${this.conversation.questions[0]}`;
    this.displayChatTokenCount(msg1);
    const chat = await this.initChat();
    const result1 = await chat.sendMessageStream(msg1);
    this.streamToStdout(result1.stream);

    const msg2 = `${this.conversation.questions[1]}`;
    this.displayChatTokenCount(msg2);
    const result2 = await chat.sendMessageStream(msg2);
    this.streamToStdout(result2.stream);

    const msg3 = `${this.conversation.questions[2]}`;
    this.displayChatTokenCount(msg3);
    const result3 = await chat.sendMessageStream(msg3);
    this.streamToStdout(result3.stream);

    // const msg4 = "What technical area is Olasunkanmi exploring on January 9th";
    // this.displayChatTokenCount(msg4);
    // const result4 = await chat.sendMessageStream(msg4);
    // this.streamToStdout(result4.stream);

    // const msg5 = "Any chance I could go for tennis?";
    // this.displayChatTokenCount(msg5);
    // const result5 = await chat.sendMessageStream(msg5);
    // this.streamToStdout(result5.stream);

    // Display history
    console.log(JSON.stringify(await chat.getHistory(), null, 2));

    // Display the last aggregated response
    // const response = await result3.response;
    // console.log(JSON.stringify(response, null, 2));
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
