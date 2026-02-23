"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

interface EditableLinkModalProps {
  open: boolean;
  title?: string;
  initialLink?: string | null;
  onSave: (newLink: string) => void;
  onClose: () => void;
}

export function EditableLinkModal({
  open,
  title = "Change product link",
  initialLink,
  onSave,
  onClose,
}: EditableLinkModalProps) {
  const [visible, setVisible] = useState(open);
  const [value, setValue] = useState(initialLink ?? "");
  const [touched, setTouched] = useState(false);

  const backdropRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (open) {
      setVisible(true);
      setValue(initialLink ?? "");
      setTouched(false);
    } else if (visible) {
      const backdrop = backdropRef.current;
      const panel = panelRef.current;
      if (!backdrop || !panel) {
        setVisible(false);
        return;
      }

      gsap
        .timeline({
          onComplete: () => setVisible(false),
        })
        .to(panel, { scale: 0.96, opacity: 0, duration: 0.18, ease: "power2.in" })
        .to(backdrop, { opacity: 0, duration: 0.18, ease: "power2.in" }, 0);
    }
  }, [open, initialLink, visible]);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, onClose]);

  useEffect(() => {
    if (!visible || !open) return;

    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    gsap.set(backdrop, { opacity: 0 });
    gsap.set(panel, { opacity: 0, scale: 0.8, y: 8 });

    gsap
      .timeline()
      .to(backdrop, { opacity: 1, duration: 0.18, ease: "power2.out" })
      .to(
        panel,
        { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: "power3.out" },
        0
      );
  }, [visible, open]);

  if (!visible) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 backdrop-blur"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden={!open}
    >
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={title}
        className="w-full max-w-md rounded-2xl border border-roseSoft/80 bg-white p-5 shadow-lg shadow-pink-200/40" >
        <div className="font-heading text-xl text-accentRed">{title}</div>
        <p className="mt-1 text-sm text-slate-600">
          Paste a new link and save it.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          New link
        </label>
        <input value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="https://..."
          className={`mt-2 w-full rounded-2xl border bg-roseLight/40 px-4 py-3 text-slate-800 outline-none transition-colors ${
            showError
              ? "border-red-400 focus:border-red-500"
              : "border-roseSoft/90 focus:border-rosePrimary"
          }`}
          autoFocus />
        {showError && (
          <p className="mt-1.5 text-xs text-red-500">Please enter a valid URL (must start with https:// or http://).</p>
        )}
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => {
              if (!canSave) return;
              onSave(value.trim());
            }}
            disabled={!canSave}
            className="w-full rounded-2xl bg-rosePrimary px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-pink-200/40 
              transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save
          </button>
          <button type="button" onClick={onClose}
            className="w-full rounded-2xl border border-roseSoft/90 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg 
              shadow-pink-200/20 transition-transform active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
