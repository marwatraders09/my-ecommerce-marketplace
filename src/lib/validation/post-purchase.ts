import { z } from "zod";

export const returnSchema = z.object({ reason: z.string().trim().min(3).max(120), description: z.string().trim().max(500).optional() });
export const orderStatusSchema = z.object({ status: z.enum(["CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"]) });
export const refundSchema = z.object({ amount: z.number().positive(), reason: z.string().trim().min(3).max(200) });