import { z } from "zod";
import { DocumentTypeEnum, DomainEnum } from "./constants";

const title = z.string();
const documentType = z.nativeEnum(DocumentTypeEnum);
const domain = z.nativeEnum(DomainEnum);
export const documentRequestSchema = z.object({ title, documentType, domain });

const name = z.nativeEnum(DomainEnum);
export const domainRequestSchema = z.object({ name });

const docType = z.nativeEnum(DocumentTypeEnum);
export const docTypeRequestSchema = z.object({ name: docType });
