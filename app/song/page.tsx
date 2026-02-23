import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "A Song For You",
  description: "An audio gift.",
};

export default function SongPage() {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-roseLight to-cream">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="font-heading text-3xl text-accentRed sm:text-4xl">
          For my winter bear
        </h1>
        <p className="mt-2 text-slate-600">
          Play it in times when you need a little pick-me-up, or when you just want to feel a little closer to me. I hope it brings a smile to your face and warmth to your heart, just like you do for me every day.
        </p>

        <div className="mt-8 rounded-2xl border border-roseSoft/80 bg-white/70 p-6 shadow-lg shadow-pink-200/30 backdrop-blur">

          <div className="mt-4">
            <audio controls preload="none" className="w-full">
              <source src="/assets/winter.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="text-sm font-semibold text-rosePrimary underline decoration-roseSoft underline-offset-4"
          >
            Back to the wishlist
          </Link>
        </div>
      </div>
    </div>
  );
}
