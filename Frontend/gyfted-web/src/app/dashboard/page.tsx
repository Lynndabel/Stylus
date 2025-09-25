"use client";
import { useAccount } from "wagmi";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-extrabold mb-2">Creator Dashboard</h1>
      {!isConnected ? (
        <p className="text-gray-700">Connect your wallet to manage your creator profile.</p>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-pink-100 bg-white/70 p-5">
            <h2 className="font-semibold">Your address</h2>
            <p className="text-gray-700">{address}</p>
          </div>
          <div className="rounded-xl border border-pink-100 bg-white/70 p-5">
            <h2 className="font-semibold mb-2">Actions</h2>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Register / update profile (UI coming soon)</li>
              <li>Withdraw tips (UI coming soon)</li>
              <li>View analytics (UI coming soon)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
