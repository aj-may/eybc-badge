import { isAddress } from "@ethersproject/address";
import { z } from "zod";
import { uintToUuid } from "./utils";

export const addressSchema = z
  .string()
  .refine((val) => isAddress(val), "Invalid Ethereum address");

export const badgeSchema = z.object({
  id: z.coerce.number().transform((val) => uintToUuid(val)),
  handle: z.string().trim().min(2),
  email: z
    .string()
    .trim()
    .email()
    .endsWith("ey.com", "Must be a valid EY email address"),
  address: addressSchema,
  avatar: z.object({
    filename: z.string(),
    url: z.string().url(),
  }),
  status: z.enum(["UNVERIFIED", "PENDING", "ISSUED", "REVOKED"]),
});

export const uploadRequest = z.object({
  type: z.string(),
});

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{5}$/),
});
