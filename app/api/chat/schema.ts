import { z } from "zod";

export const slideSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    slideNumber: z.string(), // Format like "01", "02", etc.
    code: z.string(),
  });