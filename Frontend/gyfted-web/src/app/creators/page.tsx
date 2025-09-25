import { CreatorCard } from "@/components/CreatorCard";

export default function CreatorsPage() {
  // Placeholder list; later fetch from subgraph/indexer or on-chain scan
  const creators = [
    { address: "0x0000000000000000000000000000000000000001", name: "Alice" },
    { address: "0x0000000000000000000000000000000000000002", name: "Bob" },
    { address: "0x0000000000000000000000000000000000000003", name: "Carol" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-extrabold mb-6">Discover Creators</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((c) => (
          <CreatorCard key={c.address} address={c.address} name={c.name} />
        ))}
      </div>
    </div>
  );
}
