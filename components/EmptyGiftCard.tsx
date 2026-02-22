"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import type { Gift } from "../data/gifts";

interface EmptyGiftCardProps {
  gift: Gift;
  onSaveSuggestion: (id: number, link: string) => void;
}

export function EmptyGiftCard({ gift, onSaveSuggestion }: EmptyGiftCardProps) {
  const [value, setValue] = useState("");

  const canSave = useMemo(() => value.trim().length > 0, [value]);

  return (
    <div className="relative z-10 overflow-hidden rounded-2xl border-2 border-dashed border-rosePrimary/40 bg-white/70 p-5 shadow-lg shadow-pink-200/20">
      <div className="font-heading text-xl text-accentRed">{gift.title}</div>
      <div className="mt-1 text-sm text-slate-600">{gift.description}</div>

      {gift.imageSrc ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-roseSoft/70 bg-white">
          <div className="relative aspect-16/10">
            <Image
              src={gift.imageSrc}
              alt={gift.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl bg-linear-to-br from-rose-100 to-pink-50 p-4">
        <div className="text-sm font-semibold text-slate-700">
          Add your dream version ✨
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste a product link"
          className="mt-3 w-full rounded-2xl border border-roseSoft/90 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-rosePrimary"
        />
        <button
          type="button"
          onClick={() => {
            if (!canSave) return;
            onSaveSuggestion(gift.id, value.trim());
            setValue("");
          }}
          disabled={!canSave}
          className="mt-3 w-full bg-roseSoft rounded-2xl px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-pink-200/40 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save suggestion
        </button>
      </div>
    </div>
  );
}
