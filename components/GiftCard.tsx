"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import type { Gift } from "../data/gifts";
import { EditableLinkModal } from "./EditableLinkModal";


interface GiftCardProps {
  gift: Gift;
  onUpdateLink: (id: number, newLink: string) => void;
  onKeepChange: (id: number, keep: boolean) => void;
}

export function GiftCard({ gift, onUpdateLink, onKeepChange }: GiftCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const safeHref = useMemo(() => {
    if (!gift.link) return null;
    return gift.link;
  }, [gift.link]);
  useEffect(() => {
    const card = cardRef.current;
    if (!card) 
      return;
    const tween = gsap.to(card, { y: -6, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1, });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div ref={cardRef} className={`group relative z-10 overflow-hidden rounded-2xl border shadow-lg 
          transition-transform duration-200 hover:scale-[1.03] hover:-rotate-1 ${
      gift.keepConfirmed
        ? " bg-rose-200 shadow-pink-300/60 ring-2 ring-rosePrimary/30"
        : " bg-white shadow-rose-200/40"
    }`}>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-roseSoft/50 blur-2xl" />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-heading text-xl text-accentRed">
              {gift.title}
            </div>
            <div className="mt-1 text-sm text-slate-600">{gift.description}</div>
          </div>

          {gift.keepConfirmed ? (
            <div className="absolute top-2 right-2 shrink-0 rounded-full bg-cream px-3 py-1 text-xs font-semibold text-accentRed">
              Kept
            </div>
          ) : null}
        </div>
        {gift.imageSrc && gift.status === "selected" && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-roseSoft/70 bg-linear-to-br from-rose-100 to-pink-50">
            <div className="relative aspect-square">
              <Image src={gift.imageSrc} alt={gift.title} fill className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={gift.id <= 3}
              />
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Current link
          </div>
          {safeHref ? (
            <a href={safeHref} target="_blank" rel="noreferrer" title={safeHref} className="mt-1 block truncate text-sm 
                  font-medium text-rosePrimary underline decoration-roseSoft underline-offset-4">
              {safeHref}
            </a>
          ) : (
            <div className="mt-1 text-sm text-slate-500">No link yet.</div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => setModalOpen(true)} className="w-full rounded-2xl border border-roseSoft/90 bg-white px-4 py-3 
                text-sm font-semibold text-slate-700 shadow-lg shadow-pink-200/20 transition-transform active:scale-[0.98]">
            {safeHref ? "Change this" : "Add link"}
          </button>
          <button
            type="button"
            onClick={() => onKeepChange(gift.id, !gift.keepConfirmed)}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg shadow-pink-200/40 transition-transform active:scale-[0.98] ${
              gift.keepConfirmed
                ? "bg-rose-300 text-black"
                : "border border-roseSoft/90 bg-white text-slate-700 shadow-pink-200/20"
            }`}
          >
            {gift.keepConfirmed ? "Keeping ✓" : "Not keeping"}
          </button>
        </div>
      </div>

      <EditableLinkModal
        open={modalOpen}
        initialLink={gift.link}
        onClose={() => setModalOpen(false)}
        onSave={(newLink) => {
          onUpdateLink(gift.id, newLink);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
