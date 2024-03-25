import {
  ChatSession,
  CountTokensRequest,
  EnhancedGenerateContentResponse,
  GenerativeModel,
  Part,
} from "@google/generative-ai";
import * as express from "express";
import { Result } from "../lib/result";
import { ZodError } from "zod";

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

export function generatorValidationError(issue: any) {
  switch (issue.code) {
    case "invalid_type":
      return `Invalid type for field "${issue.path.join(".")}". Expected ${issue.expected}, but received ${issue.received}.`;
    case "unrecognized_keys":
      return `Unrecognized field(s): ${issue.keys.join(", ")}.`;
    case "invalid_enum_value":
      return `Invalid value for field "${issue.path.join(".")}". Expected one of ${Object.values(issue.options)}, but received ${issue.received}.`;
    default:
      return issue.message;
  }
}

export function generateErrorResponse(error: any, res: express.Response, next: express.NextFunction) {
  try {
    let response;
    response = "";
    if (error instanceof ZodError) {
      const errorMessage = error.issues.map((issue) => generatorValidationError(issue)).join(" ");
      response = res.status(400).json(Result.fail(errorMessage, 400));
    }
    return response;
  } catch (error) {
    console.error("validation error", error);
    next(error);
  }
}
