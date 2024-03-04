import {
  GenerationConfig,
  GenerativeModel,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { modelConfig } from "../lib/constants";

export class GenerativeAIService {
  private config: GenerationConfig = modelConfig;
  protected generativeAi: GoogleGenerativeAI;
  constructor(
    private apiKey: string,
    private AIModel: string
  ) {
    this.generativeAi = new GoogleGenerativeAI(this.apiKey);
  }

  generativeModel(): GenerativeModel {
    const model = this.generativeAi.getGenerativeModel({
      model: this.AIModel,
      generationConfig: this.config,
    });
    return model;
  }
}
