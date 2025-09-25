import { Address } from "viem";

// Placeholder addresses per network; replace after deployment
export const COFFEE_FACTORY_ADDRESSES: Record<number, Address> = {
  // arbitrum one
  42161: "0x0000000000000000000000000000000000000000",
  // arbitrum sepolia
  421614: "0x0000000000000000000000000000000000000000",
};

// Minimal ABI surface to integrate gradually; replace with full exported ABI
export const COFFEE_FACTORY_ABI = [
  {
    type: "function",
    name: "tip_creator",
    stateMutability: "payable",
    inputs: [
      { name: "creator", type: "address" },
      { name: "message", type: "string" },
    ],
    outputs: [],
  },
  { type: "function", name: "register_creator", stateMutability: "nonpayable", inputs: [
      { name: "name", type: "string" },
      { name: "bio", type: "string" },
      { name: "avatar_url", type: "string" },
    ], outputs: [] },
  { type: "function", name: "update_profile", stateMutability: "nonpayable", inputs: [
      { name: "name", type: "string" },
      { name: "bio", type: "string" },
      { name: "avatar_url", type: "string" },
    ], outputs: [] },
  { type: "function", name: "withdraw_my_tips", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "get_creator_profile", stateMutability: "view", inputs: [ { name: "creator", type: "address" } ], outputs: [ { name: "name", type: "string" }, { name: "bio", type: "string" }, { name: "avatar_url", type: "string" }, { name: "is_active", type: "bool" }, { name: "total_tips_received", type: "uint256" }, { name: "tip_count", type: "uint256" } ] },
  { type: "function", name: "get_creator_balance", stateMutability: "view", inputs: [ { name: "creator", type: "address" } ], outputs: [ { name: "", type: "uint256" } ] },
  { type: "function", name: "get_platform_fee", stateMutability: "view", inputs: [], outputs: [ { name: "", type: "uint256" } ] },
  { type: "function", name: "get_registered_creators", stateMutability: "view", inputs: [], outputs: [ { name: "", type: "address[]" } ] },
  { type: "event", name: "TipSent", inputs: [ { name: "supporter", type: "address", indexed: true }, { name: "creator", type: "address", indexed: true }, { name: "amount", type: "uint256" }, { name: "message", type: "string" } ], anonymous: false },
] as const;
