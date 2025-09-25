import { TipForm } from "@/components/TipForm";

type Props = { params: { address: string } };

export default function TipPage({ params }: Props) {
  const { address } = params;
  const checksumLike = (address?.startsWith("0x") ? address : `0x${address}`) as `0x${string}`;
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-extrabold mb-6">Send a Tip</h1>
      <TipForm creator={checksumLike} />
    </div>
  );
}
