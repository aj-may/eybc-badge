import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import dotenv from 'dotenv';
import { prompt } from 'enquirer';
import { BigNumber, ContractTransaction, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

dotenv.config({ path: './.env.local' });

type PromptResponse = {
  address: string,
  email: string,
}

type FeeData = {
  maxPriorityFee: number,
  maxFee: number,
};

const { INFURA_KEY, BADGE_OWNER_KEY } = process.env;
if (!INFURA_KEY || !BADGE_OWNER_KEY)
  throw new Error('INFURA_KEY and BADGE_OWNER_KEY must be set in the environment');

const contractAddress = '0x95e6603e219e6D08A9AE46f29201fA1610FA76B4';
const abi = [
  'function SYSTEM_ROLE() view returns (bytes32)',
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function issue(address to)',
  'function revoke(uint256 tokenId)',
];
const provider = new ethers.providers.InfuraProvider('matic', INFURA_KEY);
const signer = new ethers.Wallet(BADGE_OWNER_KEY, provider);
const contract = new ethers.Contract(contractAddress, abi, signer);
const prismaClient = new PrismaClient();

const getFeeData = async (): Promise<FeeData> => {
  const { data } = await axios.get('https://gasstation-mainnet.matic.network/v2');
  return data.fast;
}

async function main() {
  const SYSTEM_ROLE = await contract.SYSTEM_ROLE() as string;
  const hasSystemRole = await contract.hasRole(SYSTEM_ROLE, signer.address);

  if (!hasSystemRole) throw new Error('Signer does not have SYSTEM_ROLE');
  
  const { address, email } = await prompt<PromptResponse>([
    {
      type: 'input',
      name: 'address',
      message: 'Address',
      required: true,
    },
    {
      type: 'input',
      name: 'email',
      message: 'E-Mail',
      required: true,
    }
  ]);
  const handle = email.split('@')[0];
  const balance = await contract.balanceOf(address) as BigNumber;

  if (balance.gt(0)) throw new Error('Wallet already has a badge');

  const { maxFee, maxPriorityFee } = await getFeeData();
  if (!maxFee || !maxPriorityFee ) throw new Error('Unable to get fee data');

  const transaction = await contract.issue(address, {
    maxFeePerGas: parseUnits(maxFee.toFixed(4).toString(), 'gwei'),
    maxPriorityFeePerGas: parseUnits(maxPriorityFee.toFixed(4).toString(), 'gwei'),
  }) as ContractTransaction;

  await transaction.wait(2);

  const tokenId = await contract.tokenOfOwnerByIndex(address, 0) as BigNumber;

  await prismaClient.badge.create({
    data: {
      tokenId: tokenId.toNumber(),
      handle,
      email,
    }
  });

  console.log('Success! 🎉');
}

main().catch(err => {
  console.error(`Error: ${err}`);
  process.exit(1);
});
