"use client";
import { useState, useMemo } from "react";
import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";
import { COFFEE_FACTORY_ABI, COFFEE_FACTORY_ADDRESSES } from "@/lib/contract";
import { formatEther } from "viem";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const factory = useMemo(() => COFFEE_FACTORY_ADDRESSES[chainId], [chainId]);

  const { data: profile } = useReadContract({
    abi: COFFEE_FACTORY_ABI,
    address: factory,
    functionName: "get_creator_profile",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && factory) },
  });

  const { data: balance } = useReadContract({
    abi: COFFEE_FACTORY_ABI,
    address: factory,
    functionName: "get_creator_balance",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && factory) },
  });

  const { writeContractAsync, isPending } = useWriteContract();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const onRegister = async () => {
    if (!factory) return alert("Unsupported network. Please switch to Arbitrum.");
    try {
      await writeContractAsync({
        abi: COFFEE_FACTORY_ABI,
        address: factory,
        functionName: "register_creator",
        args: [name, bio, avatarUrl],
      });
      alert("Profile registered!");
    } catch (e: unknown) {
      const msg = (typeof e === "object" && e && (e as any).message) || "Failed to register";
      alert(msg);
    }
  };

  const onUpdate = async () => {
    if (!factory) return alert("Unsupported network. Please switch to Arbitrum.");
    try {
      await writeContractAsync({
        abi: COFFEE_FACTORY_ABI,
        address: factory,
        functionName: "update_profile",
        args: [name || profile?.[0] || "", bio || profile?.[1] || "", avatarUrl || profile?.[2] || ""],
      });
      alert("Profile updated!");
    } catch (e: unknown) {
      const msg = (typeof e === "object" && e && (e as any).message) || "Failed to update";
      alert(msg);
    }
  };

  const onWithdraw = async () => {
    if (!factory) return alert("Unsupported network. Please switch to Arbitrum.");
    try {
      await writeContractAsync({
        abi: COFFEE_FACTORY_ABI,
        address: factory,
        functionName: "withdraw_my_tips",
        args: [],
      });
      alert("Withdrawal transaction sent!");
    } catch (e: unknown) {
      const msg = (typeof e === "object" && e && (e as any).message) || "Failed to withdraw";
      alert(msg);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-extrabold mb-2">Creator Dashboard</h1>
      {!isConnected ? (
        <p className="text-gray-700">Connect your wallet to manage your creator profile.</p>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-pink-100 bg-white/70 p-5">
            <h2 className="font-semibold mb-3">Your address</h2>
            <p className="text-gray-700 break-all">{address}</p>
          </div>

          <div className="rounded-xl border border-pink-100 bg-white/70 p-5">
            <h2 className="font-semibold mb-3">Profile</h2>
            {profile && profile[3] ? (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input defaultValue={profile?.[0]} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-pink-200 px-3 py-2" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">Bio</label>
                    <input defaultValue={profile?.[1]} onChange={(e) => setBio(e.target.value)} className="mt-1 w-full rounded-xl border border-pink-200 px-3 py-2" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-sm font-medium">Avatar URL</label>
                    <input defaultValue={profile?.[2]} onChange={(e) => setAvatarUrl(e.target.value)} className="mt-1 w-full rounded-xl border border-pink-200 px-3 py-2" />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button onClick={onUpdate} disabled={isPending} className="rounded-full bg-pink-600 text-white font-semibold px-5 py-3 disabled:opacity-60">
                    {isPending ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-3">No profile found. Register to start receiving tips.</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-pink-200 px-3 py-2" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">Bio</label>
                    <input value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 w-full rounded-xl border border-pink-200 px-3 py-2" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-sm font-medium">Avatar URL</label>
                    <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="mt-1 w-full rounded-xl border border-pink-200 px-3 py-2" />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button onClick={onRegister} disabled={isPending} className="rounded-full bg-pink-600 text-white font-semibold px-5 py-3 disabled:opacity-60">
                    {isPending ? "Registering…" : "Register profile"}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="rounded-xl border border-pink-100 bg-white/70 p-5">
            <h2 className="font-semibold mb-3">Balance</h2>
            <div className="flex items-center justify-between">
              <p className="text-gray-700">{balance ? `${formatEther(balance as bigint)} ETH` : "0"}</p>
              <button onClick={onWithdraw} disabled={isPending} className="rounded-full bg-rose-600 text-white font-semibold px-5 py-3 disabled:opacity-60">
                {isPending ? "Withdrawing…" : "Withdraw"}
              </button>
            </div>
          </div>

          {profile && profile[3] && (
            <div className="rounded-xl border border-pink-100 bg-white/70 p-5">
              <h2 className="font-semibold mb-3">Stats</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-pink-100 bg-white p-4 text-center">
                  <p className="text-xs text-gray-500">Tips Received (gross)</p>
                  <p className="text-xl font-bold">{profile?.[4]?.toString?.() || "0"}</p>
                </div>
                <div className="rounded-xl border border-pink-100 bg-white p-4 text-center">
                  <p className="text-xs text-gray-500">Tip Count</p>
                  <p className="text-xl font-bold">{profile?.[5]?.toString?.() || "0"}</p>
                </div>
                <div className="rounded-xl border border-pink-100 bg-white p-4 text-center">
                  <p className="text-xs text-gray-500">Active</p>
                  <p className="text-xl font-bold">{profile?.[3] ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
