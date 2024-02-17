import { ChatSession, CountTokensRequest, EnhancedGenerateContentResponse, Part } from "@google/generative-ai";
import { GenerativeAIService } from "./ai.service";
import { oneLine, stripIndents } from "common-tags";

export class Chat extends GenerativeAIService {
  initialConvo: any;
  constructor(apiKey: string, AIModel: string) {
    super(apiKey, AIModel);
    this.initChat();
  }

  initChat = async (): Promise<ChatSession> => {
    this.initialConvo = {
      history: [
        {
          role: "user",
          parts: stripIndents`${oneLine` 
      Monday, January 2nd
      9:00 AM - 10:30 AM: Kick-off meeting with Product Development team
      11:00 AM - 12:30 PM: Architecture review for new project
      2:00 PM - 3:30 PM: Code review with junior engineers

      Tuesday, January 3rd
      9:00 AM - 11:00 AM: Technical planning session for upcoming sprint
      12:00 PM - 1:00 PM: Lunch with team lead
      2:00 PM - 4:00 PM: Work on feature implementation
      Wednesday, January 4th

      9:00 AM - 10:30 AM: Unit testing and debugging
      11:00 AM - 12:30 PM: Architecture discussion with Chief Architect
      2:00 PM - 3:30 PM: Code review and mentoring

      Thursday, January 5th

      9:00 AM - 11:00 AM: System integration and testing
      12:00 PM - 1:00 PM: Lunch with CTO
      2:00 PM - 4:00 PM: Work on bug fixes

      Friday, January 6th

      9:00 AM - 10:30 AM: Performance optimization and profiling
      11:00 AM - 12:30 PM: Documentation and handover preparation
      2:00 PM - 4:00 PM: Preparation for sprint review

      Monday, January 9th

      9:00 AM - 11:00 AM: Sprint review presentation and discussion
      12:00 PM - 1:00 PM: Lunch break
      2:00 PM - 4:00 PM: Retrospective and planning for next sprint

      Tuesday, January 10th

      9:00 AM - 11:00 AM: Technical exploration and research
      12:00 PM - 1:00 PM: Lunch with team
      2:00 PM - 4:00 PM: Work on new feature development

      Wednesday, January 11th

      9:00 AM - 10:30 AM: Unit testing and debugging
      11:00 AM - 12:30 PM: Architectural design review
      2:00 PM - 3:30 PM: Code review and mentoring

      Thursday, January 12th

      9:00 AM - 11:00 AM: System integration and testing
      12:00 PM - 1:00 PM: Lunch break
      2:00 PM - 4:00 PM: Work on performance optimization

      Friday, January 13th

      9:00 AM - 10:30 AM: Documentation and release preparation
      11:00 AM - 12:30 PM: Code merge and deployment
      2:00 PM - 4:00 PM: Post-release review and feedback gathering
`}`,
        },
        {
          role: "model",
          parts: "What is my schedule like on monday",
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    };
    return await this.genAIModel.startChat(this.initialConvo);
  };
  async run() {
    const msg1 = "What time is the kick-off meeting with the Product Development team on January 2nd?";
    this.displayChatTokenCount(msg1);
    const chat = await this.initChat();
    const result1 = await chat.sendMessageStream(msg1);
    this.streamToStdout(result1.stream);

    const msg2 = "What is the topic of the architecture review meeting on January 3rd?";
    this.displayChatTokenCount(msg2);
    const result2 = await chat.sendMessageStream(msg2);
    this.streamToStdout(result2.stream);

    const msg3 = "What is the focus of the retrospective and planning session on January 4th";
    this.displayChatTokenCount(msg3);
    const result3 = await chat.sendMessageStream(msg3);
    this.streamToStdout(result3.stream);

    const msg4 = "What technical area is Olasunkanmi exploring on January 9th";
    this.displayChatTokenCount(msg4);
    const result4 = await chat.sendMessageStream(msg4);
    this.streamToStdout(result4.stream);

    const msg5 = "Any chance I could go for tennis?";
    this.displayChatTokenCount(msg5);
    const result5 = await chat.sendMessageStream(msg5);
    this.streamToStdout(result5.stream);

    // Display history
    console.log(JSON.stringify(await chat.getHistory(), null, 2));

    // Display the last aggregated response
    const response = await result3.response;
    // console.log(JSON.stringify(response, null, 2));
  }

  displayTokenCount = async (request: string | (string | Part)[] | CountTokensRequest) => {
    const { totalTokens } = await this.genAIModel.countTokens(request);
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
