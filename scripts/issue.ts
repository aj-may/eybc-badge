import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import dotenv from 'dotenv';
import { prompt } from 'enquirer';
import { BigNumber, ContractTransaction, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

dotenv.config({ path: './.env.local' });

type PromptResponse = {
  address: string,
  handle: string,
  email: string,
}

type BlocknativeFeeData = {
  confidence: number,
  price: number,
  maxPriorityFeePerGas: number,
  maxFeePerGas: number,
};

const { INFURA_KEY, BADGE_OWNER_KEY, BLOCKNATIVE_KEY } = process.env;
if (!INFURA_KEY || !BADGE_OWNER_KEY || !BLOCKNATIVE_KEY)
  throw new Error('INFURA_KEY, BADGE_OWNER_KEY, and BLOCKNATIVE_KEY must be set in the environment');

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

const getBlocknativeFeeData = async (): Promise<BlocknativeFeeData> => {
  const { data } = await axios.get('https://api.blocknative.com/gasprices/blockprices', {
    headers: { Authorization: BLOCKNATIVE_KEY },
    params: {
      chainid: '137',
      withBaseFees: 'false',
    },
  });

  return data.blockPrices[0].estimatedPrices.find((obj: BlocknativeFeeData) => obj.confidence == 90);
};

async function main() {
  const SYSTEM_ROLE = await contract.SYSTEM_ROLE() as string;
  const hasSystemRole = await contract.hasRole(SYSTEM_ROLE, signer.address);

  if (!hasSystemRole) throw new Error('Signer does not have SYSTEM_ROLE');
  
  const { address, handle, email } = await prompt<PromptResponse>([
    {
      type: 'input',
      name: 'address',
      message: 'Address',
      required: true,
    },
    {
      type: 'input',
      name: 'handle',
      message: 'Handle',
      required: true,
    },
    {
      type: 'input',
      name: 'email',
      message: 'E-Mail',
      required: true,
    }
  ]);
  const balance = await contract.balanceOf(address) as BigNumber;

  if (balance.gt(0)) throw new Error('Wallet already has a badge');

  const { maxFeePerGas, maxPriorityFeePerGas } = await getBlocknativeFeeData();
  if (!maxFeePerGas || !maxPriorityFeePerGas ) throw new Error('Unable to get fee data');

  const transaction = await contract.issue(address, {
    maxFeePerGas: parseUnits(maxFeePerGas.toString(), 'gwei'),
    maxPriorityFeePerGas: parseUnits(maxPriorityFeePerGas.toString(), 'gwei'),
  }) as ContractTransaction;

  await transaction.wait();

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
