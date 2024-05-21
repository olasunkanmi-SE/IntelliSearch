import { z } from "zod";
import { DocumentTypeEnum, DomainEnum } from "./constants";

const title = z.string();
const documentTypeId = z.number();
const domainId = z.number();
export const documentRequestSchema = z.object({ title, documentTypeId, domainId });

const name = z.nativeEnum(DomainEnum);
export const domainRequestSchema = z.object({ name });

const docType = z.nativeEnum(DocumentTypeEnum);
export const docTypeRequestSchema = z.object({ name: docType });

export const createDocumentSchema = z.object({ title: z.string() });

export const chatRequestSchema = z.object({
  documentId: z.number(),
  question: z.string(),
  metaData: z.optional(
    z.object({
      documentId: z.number(),
      pageNumber: z.number(),
    })
  ),
  chatHistory: z.string(),
});

export const chatHistorySchema = z.array(
  z.object({
    role: z.string(),
    parts: z.array(
      z.object({
        text: z.string(),
      })
    ),
  })
);
