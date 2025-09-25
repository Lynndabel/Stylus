"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-8 -left-8 h-64 w-64 rounded-full bg-pink-200 blur-3xl opacity-40" />
        <div className="absolute -bottom-8 -right-8 h-64 w-64 rounded-full bg-rose-200 blur-3xl opacity-40" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900"
        >
          Fuel creators with
          <span className="block bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">crypto tips</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 text-lg text-gray-700 max-w-2xl"
        >
          Gyfted makes it easy to support your favorite creators. Built on Arbitrum Stylus for fast, low-cost tipping.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-10 flex gap-4"
        >
          <Link href="/creators" className="px-6 py-3 rounded-full bg-pink-600 text-white font-semibold hover:bg-pink-700 transition-colors">
            Explore creators
          </Link>
          <Link href="/how-it-works" className="px-6 py-3 rounded-full bg-white text-pink-600 font-semibold border border-pink-200 hover:bg-pink-50 transition-colors">
            How it works
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
