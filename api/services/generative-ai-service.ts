import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

export class GenerativeAIService {
  // private config: GenerationConfig = modelConfig;
  protected generativeAi: GoogleGenerativeAI;
  constructor(private apiKey: string) {
    this.generativeAi = new GoogleGenerativeAI(this.apiKey);
  }

  generativeModel(aiModel: string): GenerativeModel {
    const model = this.generativeAi.getGenerativeModel({
      model: aiModel,
    });
    return model;
  }
}
