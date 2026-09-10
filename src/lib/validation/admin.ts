import { z } from "zod";

export const approvalActionSchema = z.object({ status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "SUSPENDED"]) });
export const productActionSchema = z.object({ status: z.enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED", "ACTIVE", "INACTIVE", "OUT_OF_STOCK", "ARCHIVED"]) });