import { z } from "zod";

export const brandRegistrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).optional(),
  website: z.string().trim().url().max(200).optional().or(z.literal("")),
  category: z.string().trim().min(2).max(80),
  companyName: z.string().trim().min(2).max(120),
  businessAddress: z.string().trim().min(5).max(200),
  contactInformation: z.string().trim().min(5).max(120),
  authorizationNotes: z.string().trim().min(10).max(1000),
});