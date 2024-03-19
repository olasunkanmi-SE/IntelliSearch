export const AiModels = {
  embedding: "embedding-001",
  gemini: "gemini-pro",
};

// export const modelConfig = {
//   maxOutputTokens: 200,
//   temperature: 0.9,
//   topP: 0.1,
//   topK: 16,
// };

export const HTTP_RESPONSE_CODE = {
  NOT_FOUND: 404,
  CREATED: 201,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
};

export const enum HttpStatusCode {
  NOT_FOUND = 404,
  CREATED = 201,
  CONFLICT = 409,
  BAD_REQUEST = 400,
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  SERVER_ERROR = 500,
}

export const APP_ERROR_MESSAGE = {
  serverError: "Something went wrong, try again later",
};

export enum DocumentTypeEnum {
  ARTICLE = "ARTICLE",
  BLOG = "BLOG",
  RESEARCH_PAPER = "RESEARCH_PAPER",
  NEWS = "NEWS",
  TWEET = "TWEET",
  BOOK = "BOOK",
}

export enum DomainEnum {
  FINANCE = "FINANCE",
  HEALTHCARE = "HEALTHCARE",
  TECHNOLOGY = "TECHNOLOGY",
  SPORTS = "SPORTS",
  COMPUTER_SCIENCE = "COMPUTER_SCIENCE",
}
