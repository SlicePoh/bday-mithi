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
  const [touched, setTouched] = useState(false);

  const isValidUrl = useMemo(() => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    try {
      const url = new URL(trimmed);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, [value]);

  const canSave = isValidUrl;
  const showError = touched && value.trim().length > 0 && !isValidUrl;

  return (
    <div className="relative z-10 overflow-hidden rounded-2xl border-2 border-dashed border-rosePrimary/40 bg-white/70 p-5 shadow-lg shadow-pink-200/20">
      <div className="font-heading text-xl text-accentRed">{gift.title}</div>
      <div className="mt-1 text-sm text-slate-600">{gift.description}</div>

      <div className="mt-4 rounded-2xl bg-linear-to-br from-rose-100 to-pink-50 p-4">
        <div className="text-sm font-semibold text-slate-700">
          Add your link, I'm not knowledgable enough to pick for this one
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Paste a product link"
          className={`mt-3 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors ${
            showError
              ? "border-red-400 focus:border-red-500"
              : "border-roseSoft/90 focus:border-rosePrimary"
          }`}
        />
        {showError && (
          <p className="mt-1.5 text-xs text-red-500">Please enter a valid URL (must start with https:// or http://).</p>
        )}
        <button type="button" onClick={() => {
            if (!canSave) return;
            onSaveSuggestion(gift.id, value.trim());
            setValue("");
          }}
          disabled={!canSave}
          className="mt-3 w-full bg-rose-300 rounded-2xl px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-pink-200/40 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save suggestion
        </button>
      </div>
    </div>
  );
}
