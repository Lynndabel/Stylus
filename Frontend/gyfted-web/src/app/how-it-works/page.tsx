export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-extrabold mb-6">How Gyfted Works</h1>
      <ol className="space-y-6">
        <li className="rounded-xl border border-pink-100 bg-white/70 p-6">
          <h3 className="font-semibold">1. Creators register</h3>
          <p className="text-gray-700">Creators create an on-chain profile (name, bio, avatar). No deployment needed.</p>
        </li>
        <li className="rounded-xl border border-pink-100 bg-white/70 p-6">
          <h3 className="font-semibold">2. Supporters tip</h3>
          <p className="text-gray-700">Send ETH with a message. Tips are processed on Arbitrum via a Stylus contract for low fees.</p>
        </li>
        <li className="rounded-xl border border-pink-100 bg-white/70 p-6">
          <h3 className="font-semibold">3. Withdraw anytime</h3>
          <p className="text-gray-700">Creators withdraw their accumulated tips. The platform fee is handled automatically.</p>
        </li>
      </ol>
    </div>
  );
}
