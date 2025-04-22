import { createPublicClient, createWalletClient, http } from 'viem'
import { holesky } from 'viem/chains'
import abi from "../../app/contract/abi.json"
export const contractAddress = '0x37380a976cD64dDc46Bc4E270bD889C5ce55E17C'

export const publicClient = createPublicClient({
  chain: holesky,
  transport: http(),
})

export const getContractConfig = {
  address: contractAddress as `0x${string}`,
  abi,
} as const
