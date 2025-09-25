import Link from "next/link";

type Props = {
  address: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
};

export function CreatorCard({ address, name, bio, avatarUrl }: Props) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-white/70 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 overflow-hidden">
          {avatarUrl ? <img alt={name} src={avatarUrl} className="h-full w-full object-cover" /> : null}
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          {bio ? <p className="text-sm text-gray-600 line-clamp-2">{bio}</p> : null}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">{address.slice(0, 6)}…{address.slice(-4)}</span>
        <Link href={`/tip/${address}`} className="px-4 py-2 rounded-full bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700">
          Tip now
        </Link>
      </div>
    </div>
  );
}
