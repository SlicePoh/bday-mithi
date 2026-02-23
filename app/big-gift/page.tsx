import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Big Gift (Coming Soon)",
  description: "A little teaser for the big gift.",
};

export default function BigGiftPage() {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-rose-200 to-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <h1 className="font-heading text-3xl text-accentRed sm:text-4xl">
          The big gift isn’t available yet
        </h1>
        <p className="mt-2 text-slate-600">
          The size I want to get you is out of stock right now… so this one is
          still loading.
        </p>

        <div className="mt-8 rounded-2xl border border-roseSoft/80 bg-white/70 p-5 shadow-lg shadow-pink-200/30 backdrop-blur sm:p-6">
          <div className="text-3xl text-center font-semibold uppercase tracking-wide text-rose-300">
            Can you guess which shoe ?
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-roseSoft/70 bg-white">
            <div className="relative aspect-4/3">
              <Image
                src="/assets/Samba.jpg"
                alt="A blurred mystery shoe"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover blur-xl"
                style={{
                  maskImage:
                    "radial-gradient(circle at 50% 45%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.08) 78%, rgba(0,0,0,0) 100%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at 50% 45%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.08) 78%, rgba(0,0,0,0) 100%)",
                }}
                priority
              />

              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/35" />
              <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-cream/80 px-3 py-1 text-xs font-semibold text-accentRed shadow-lg shadow-pink-200/20">
                Out of stock (for now)
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            Hint: it’s a classic.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-rosePrimary underline decoration-roseSoft underline-offset-4"
          >
            Back to the wishlist
          </Link>
          <Link
            href="/song"
            className="text-sm font-semibold text-rosePrimary underline decoration-roseSoft underline-offset-4"
          >
            Listen to the song
          </Link>
        </div>
      </div>
    </div>
  );
}
