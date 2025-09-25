"use client";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-pink-100">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl tracking-tight">
          <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">GYFTED</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/how-it-works" className="hover:text-pink-600 transition-colors">How it works</Link>
          <Link href="/creators" className="hover:text-pink-600 transition-colors">Creators</Link>
          <Link href="/about" className="hover:text-pink-600 transition-colors">About</Link>
          <Link href="/dashboard" className="hover:text-pink-600 transition-colors">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </div>
    </header>
  );
}
