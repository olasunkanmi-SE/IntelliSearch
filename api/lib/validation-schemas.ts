import { z } from "zod";

const title = z.string();
export const documentRequestSchema = z.object({ title });
