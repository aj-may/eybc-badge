import { Contract, providers } from "ethers";
import badge from "artifacts/contracts/Badge.sol/Badge.json";

if (!process.env.NEXT_PUBLIC_NETWORK)
  throw new Error("NEXT_PUBLIC_NETWORK must be set");

if (!process.env.NEXT_PUBLIC_IFRURA_KEY)
  throw new Error("NEXT_PUBLIC_IFRURA_KEY must be set");

if (!process.env.NEXT_PUBLIC_BADGE_ADDRESS)
  throw new Error("NEXT_PUBLIC_BADGE_ADDRESS must be set");

const provider = new providers.InfuraProvider(
  process.env.NEXT_PUBLIC_NETWORK,
  process.env.NEXT_PUBLIC_IFRURA_KEY
);

export const address = process.env.NEXT_PUBLIC_BADGE_ADDRESS;
export const abi = badge.abi;
export const badgeContract = new Contract(address, abi, provider);
