"use client";
import { useState } from "react";
import { useAccount, useWriteContract, useChainId } from "wagmi";
import { parseEther } from "viem";
import { COFFEE_FACTORY_ABI, COFFEE_FACTORY_ADDRESSES } from "@/lib/contract";

type Props = { creator: `0x${string}` };

export function TipForm({ creator }: Props) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [amount, setAmount] = useState("0.001");
  const [message, setMessage] = useState("");
  const { writeContractAsync, isPending } = useWriteContract();

  const onTip = async () => {
    const factory = COFFEE_FACTORY_ADDRESSES[chainId];
    if (!factory) {
      alert("Unsupported network. Please switch to Arbitrum.");
      return;
    }
    try {
      await writeContractAsync({
        abi: COFFEE_FACTORY_ABI,
        address: factory,
        functionName: "tip_creator",
        args: [creator, message],
        value: parseEther(amount),
      });
      alert("Tip sent! Thank you for supporting creators.");
      setMessage("");
    } catch (e: unknown) {
      let msg = "Failed to send tip";
      if (typeof e === "object" && e !== null) {
        const err = e as { shortMessage?: string; message?: string };
        msg = err.shortMessage || err.message || msg;
      }
      alert(msg);
    }
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white/70 p-5">
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Amount (ETH)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            step="0.001"
            className="mt-1 w-full rounded-xl border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Say something nice…"
            className="mt-1 w-full rounded-xl border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
          />
        </div>
        <button onClick={onTip} disabled={!isConnected || isPending}
          className="rounded-full bg-pink-600 text-white font-semibold px-5 py-3 disabled:opacity-60">
          {isPending ? "Sending…" : !isConnected ? "Connect wallet" : "Send Tip"}
        </button>
      </div>
    </div>
  );
}
