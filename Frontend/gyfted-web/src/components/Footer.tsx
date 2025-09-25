export function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} Gyfted. Empowering creators in the decentralized future.
        </p>
        <div className="flex gap-5">
          <a className="hover:text-pink-600" href="/how-it-works">How it works</a>
          <a className="hover:text-pink-600" href="/about">About</a>
        </div>
      </div>
    </footer>
  );
}
