import { z } from "zod";

export const reviewSchema = z.object({ productId: z.string().uuid(), rating: z.number().int().min(1).max(5), title: z.string().trim().max(120).optional(), body: z.string().trim().min(5).max(1000) });
export const notificationReadSchema = z.object({ notificationId: z.string().uuid() });