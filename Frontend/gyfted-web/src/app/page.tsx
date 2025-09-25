import { Hero } from "@/sections/Hero";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured creators</h2>
          <Link href="/creators" className="text-pink-600 hover:underline">See all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="rounded-2xl border border-pink-100 bg-white/70 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-400" />
                <div>
                  <p className="font-semibold">Creator {i}</p>
                  <p className="text-sm text-gray-600">Bio goes here</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">Tips received: 0</span>
                <Link href={`/tip/0x000000000000000000000000000000000000000${i}`}
                  className="px-4 py-2 rounded-full bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700">
                  Tip now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
