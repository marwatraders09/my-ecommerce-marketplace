import { z } from "zod";

export const addCartItemSchema = z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(99) });
export const updateCartItemSchema = z.object({ itemId: z.string().uuid(), quantity: z.number().int().min(0).max(99) });
export const removeCartItemSchema = z.object({ itemId: z.string().uuid() });