"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeptCartBadge } from "./KeptCartBadge";

const navLinks = [
  { href: "/", label: "Welcome", border: true },
  { href: "/gifts", label: "Little somethin", border: true },
  { href: "/big-gift", label: "Main Gift", border: true },
  { href: "/song", label: "Song", border: false },
];

export function Header() {
  const pathname = usePathname();
  const isWelcome = pathname === "/";

  if (isWelcome) return null;

  return (
    <header className="sticky top-0 z-40 border-b h-14 border-roseSoft/70 bg-roseLight/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-2 y-1 h-full">
        <nav className="flex items-center gap-4 text-sm">
          {navLinks.map(({ href, label, border }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "font-semibold transition-colors text-xs md:text-md",
                  border ? "pr-2 md:pr-4 border-r-2" : "",
                  isActive
                    ? "text-rose-400 hover:text-rose-500 decoration-2"
                    : "text-slate-500 hover:text-slate-700",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1 md:gap-3">
          {pathname === "/gifts" && <KeptCartBadge />}
          <Image src="/assets/tulip.png" alt="Tulip" width={24} height={32} className="object-contain mx-2 md:mx-5" />
        </div>
      </div>
    </header>
  );
}
