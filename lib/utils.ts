import { randomInt as randomIntCallback } from "crypto";
import { add } from "date-fns";
import { parse, stringify } from "uuid";
import { badgeContract } from "./badgeContract";
import { addressSchema } from "./models";

// console.log(BigNumber.from("30838147621552441296097537203").toHexString());

export const uuidToUint = (uuid: string) => {
  const bytes = parse(uuid);
  const buffer = Buffer.from(bytes as Uint8Array);
  return buffer.readUint16BE();
};

export const uintToUuid = (n: number) => {
  const buffer = Buffer.alloc(16);
  buffer.writeUint16BE(n);
  return stringify(buffer);
};

export const hasBadge = async (address?: string) => {
  const parsedAddress = addressSchema.safeParse(address);
  if (!parsedAddress.success) return false;

  const balance = await badgeContract.balanceOf(parsedAddress.data);
  return balance > 0;
};

export const isIssuer = async (address?: string): Promise<boolean> => {
  const ISSUER_ROLE =
    "0x114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa122";
  const parsedAddress = addressSchema.safeParse(address);
  if (!parsedAddress.success) return false;

  return badgeContract.hasRole(ISSUER_ROLE, parsedAddress.data);
};

export const hasBadgeOrIssuer = async (address?: string) => {
  const [a, b] = await Promise.all([hasBadge(address), isIssuer(address)]);
  return a || b;
};

export const randomInt = (min: number, max: number) =>
  new Promise<number>((resolve, reject) =>
    randomIntCallback(min, max, (err, n) => {
      if (err) return reject(err);
      resolve(n);
    })
  );

export const generateOTP = async () => {
  const digits = await Promise.all([
    randomInt(0, 9),
    randomInt(0, 9),
    randomInt(0, 9),
    randomInt(0, 9),
    randomInt(0, 9),
  ]);

  const code = digits.join("");
  const expires = add(new Date(), { hours: 24 });

  return { code, expires };
};
