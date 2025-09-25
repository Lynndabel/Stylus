"use client";
import { http } from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// Expose a single wagmi config for the app
export const wagmiConfig = getDefaultConfig({
  appName: "Gyfted",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [arbitrum, arbitrumSepolia],
  transports: {
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC || arbitrum.rpcUrls.default.http[0]),
    [arbitrumSepolia.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC || arbitrumSepolia.rpcUrls.default.http[0]),
  },
  ssr: true,
});
