import { chatApi } from "./axios";

export const createDocumentDomain = async (name: string) => {
  return await chatApi.post("domain/create", name);
};
