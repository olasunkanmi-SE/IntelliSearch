import { z } from "zod";
import { DocumentTypeEnum, DomainEnum } from "./constants";

const title = z.string();
const documentType = z.nativeEnum(DocumentTypeEnum);
const domain = z.nativeEnum(DomainEnum);
export const documentRequestSchema = z.object({ title, documentType, domain });
