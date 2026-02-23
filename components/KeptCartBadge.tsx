"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bday-mithi:wishlist:v1";
const CART_EVENT = "bday-mithi:kept-changed";

function readKeptCount(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { gifts?: { keepConfirmed?: boolean }[] };
    if (!Array.isArray(parsed.gifts)) return 0;
    return parsed.gifts.filter((g) => !!g.keepConfirmed).length;
  } catch {
    return 0;
  }
}

export function KeptCartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(readKeptCount());

    const refresh = () => setCount(readKeptCount());

    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <div className="relative flex items-center" aria-label={`${count} items kept`}>
      {/* Cart icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-accentRed"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {count > 0 && (
        <span className="z-10 absolute bg-rose-300 -right-3 -top-3 flex w-6 h-6 items-center justify-center text-center rounded-full text-sm font-bold leading-none text-black">
          {count}
        </span>
      )}
    </div>
  );
}

export { CART_EVENT };
