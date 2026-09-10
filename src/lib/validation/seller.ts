import { z } from "zod";

export const sellerRegistrationSchema = z.object({
  storeName: z.string().trim().min(2).max(80),
  businessName: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional(),
  businessAddress: z.string().trim().min(5).max(200),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  taxId: z.string().trim().max(80).optional(),
});