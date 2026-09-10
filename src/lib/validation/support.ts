import { z } from "zod";

export const ticketSchema = z.object({ subject: z.string().trim().min(3).max(160), body: z.string().trim().min(5).max(2000) });
export const supportMessageSchema = z.object({ body: z.string().trim().min(1).max(2000) });