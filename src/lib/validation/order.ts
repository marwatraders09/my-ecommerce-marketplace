import { z } from "zod";

export const checkoutSchema = z.object({
  label: z.string().trim().min(2).max(40),
  line1: z.string().trim().min(5).max(160),
  line2: z.string().trim().max(160).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  couponCode: z.string().trim().max(40).transform((value) => value.toUpperCase()).optional(),
});