"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Gift } from "../../data/gifts";
import { initialGifts } from "../../data/gifts";
import { EmptyGiftCard } from "../../components/EmptyGiftCard";
import { GiftCard } from "../../components/GiftCard";
import { CART_EVENT } from "../../components/KeptCartBadge";

const STORAGE_KEY = "bday-mithi:wishlist:v1";

type StoredGift = {
  id: number;
  status: Gift["status"];
  link?: string | null;
  keepConfirmed?: boolean;
  // Used to detect whether a stored link was user-edited or just the old default.
  baseLink?: string | null;
  // Used to detect whether a stored status was user-edited or just the old default.
  baseStatus?: Gift["status"];
};

const INITIAL_LINK_BY_ID = new Map<number, string | null>(
  initialGifts.map((g) => [g.id, g.link])
);

const INITIAL_STATUS_BY_ID = new Map<number, Gift["status"]>(
  initialGifts.map((g) => [g.id, g.status])
);

function mergeGifts(base: Gift[], saved: StoredGift[]) {
  const byId = new Map<number, StoredGift>();
  for (const gift of saved) byId.set(gift.id, gift);

  return base.map((gift) => {
    const fromStorage = byId.get(gift.id);
    if (!fromStorage) return gift;

    const baseLink = gift.link ?? null;
    const storedLink = (fromStorage.link ?? null) as string | null;

    let mergedLink = storedLink;
    if (!mergedLink) {
      mergedLink = baseLink;
    } else if (Object.prototype.hasOwnProperty.call(fromStorage, "baseLink")) {
      const storedBaseLink = fromStorage.baseLink ?? null;
      if (storedBaseLink !== baseLink && storedLink === storedBaseLink) {
        mergedLink = baseLink;
      }
    } else {
      // Legacy payload: if a stored Google link is overriding a non-Google default, prefer the new default.
      if (
        baseLink &&
        typeof storedLink === "string" &&
        storedLink !== baseLink &&
        /google\./i.test(storedLink) &&
        !/google\./i.test(baseLink)
      ) {
        mergedLink = baseLink;
      }
    }

    let mergedStatus: Gift["status"] = fromStorage.status;
    if (Object.prototype.hasOwnProperty.call(fromStorage, "baseStatus")) {
      const storedBaseStatus = fromStorage.baseStatus;
      if (storedBaseStatus && storedBaseStatus !== gift.status) {
        if (mergedStatus === storedBaseStatus) {
          mergedStatus = gift.status;
        }
      }
    } else {
      // Legacy payload: we never had a UI to turn a selected item back to empty.
      // So if storage says "empty" but the current default is "selected", prefer the new default.
      if (gift.status === "selected" && fromStorage.status === "empty") {
        mergedStatus = "selected";
      }
    }

    return {
      ...gift,
      status: mergedStatus,
      link: mergedLink,
      keepConfirmed:
        typeof fromStorage.keepConfirmed === "boolean"
          ? fromStorage.keepConfirmed
          : gift.keepConfirmed,
    };
  });
}

function isValidStoredGiftArray(value: unknown): value is StoredGift[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (g) =>
      g &&
      typeof g === "object" &&
      typeof (g as StoredGift).id === "number" &&
      (g as StoredGift).status &&
      ((g as StoredGift).status === "selected" ||
        (g as StoredGift).status === "empty") &&
      (typeof (g as StoredGift).link === "undefined" ||
        typeof (g as StoredGift).link === "string" ||
        (g as StoredGift).link === null) &&
      (typeof (g as StoredGift).keepConfirmed === "undefined" ||
        typeof (g as StoredGift).keepConfirmed === "boolean") &&
      (typeof (g as StoredGift).baseLink === "undefined" ||
        typeof (g as StoredGift).baseLink === "string" ||
        (g as StoredGift).baseLink === null) &&
      (typeof (g as StoredGift).baseStatus === "undefined" ||
        (g as StoredGift).baseStatus === "selected" ||
        (g as StoredGift).baseStatus === "empty")
  );
}

function fireConfetti(root: HTMLDivElement) {
  const colors = ["#F472B6", "#FBCFE8", "#FFF7ED", "#BE123C"];
  const pieces = 26;
  const now = Date.now();

  for (let i = 0; i < pieces; i++) {
    const el = document.createElement("span");
    el.setAttribute("data-confetti", `${now}-${i}`);
    el.style.position = "absolute";
    el.style.left = `${50 + (Math.random() * 18 - 9)}%`;
    el.style.top = `${18 + Math.random() * 4}%`;
    el.style.width = `${6 + Math.random() * 8}px`;
    el.style.height = `${6 + Math.random() * 10}px`;
    el.style.borderRadius = "9999px";
    el.style.background = colors[Math.floor(Math.random() * colors.length)]!;
    el.style.opacity = "0";
    root.appendChild(el);

    gsap
      .timeline({
        onComplete: () => {
          el.remove();
        },
      })
      .to(el, { opacity: 1, duration: 0.08, ease: "power1.out" })
      .to(el, {
        x: (Math.random() * 2 - 1) * 140,
        y: 260 + Math.random() * 160,
        rotation: (Math.random() * 2 - 1) * 720,
        duration: 0.9 + Math.random() * 0.4,
        ease: "power3.out",
      })
      .to(el, { opacity: 0, duration: 0.18, ease: "power1.in" }, "-=0.2");
  }
}

export default function Page() {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [hydrated, setHydrated] = useState(false);

  const [wishesDraft, setWishesDraft] = useState("");
  const [wishesSaved, setWishesSaved] = useState("");
  const [wishesSavedPulse, setWishesSavedPulse] = useState(false);

  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroSubRef = useRef<HTMLParagraphElement | null>(null);
  const loveCardRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const confettiRootRef = useRef<HTMLDivElement | null>(null);

  const petals = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, idx) => ({
        id: idx,
        left: `${6 + Math.random() * 88}%`,
        top: `${10 + Math.random() * 40}%`,
        size: 10 + Math.floor(Math.random() * 18),
        opacity: 0.25 + Math.random() * 0.35,
        rotate: -25 + Math.random() * 50,
      })),
    []
  );

  // Hydrate from localStorage (optional enhancement)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as {
        gifts?: unknown;
        wishesSaved?: unknown;
      };

      if (isValidStoredGiftArray(parsed.gifts)) {
        setGifts(mergeGifts(initialGifts, parsed.gifts));
      }

      if (typeof parsed.wishesSaved === "string") {
        setWishesSaved(parsed.wishesSaved);
        setWishesDraft(parsed.wishesSaved);
      }
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const giftsToStore: StoredGift[] = gifts.map((g) => ({
        id: g.id,
        status: g.status,
        link: g.link,
        keepConfirmed: g.keepConfirmed,
        baseLink: INITIAL_LINK_BY_ID.get(g.id) ?? null,
        baseStatus: INITIAL_STATUS_BY_ID.get(g.id) ?? g.status,
      }));

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ gifts: giftsToStore, wishesSaved })
      );
      window.dispatchEvent(new Event(CART_EVENT));
    } catch {
      // ignore
    }
  }, [gifts, wishesSaved, hydrated]);

  // GSAP animations
  useEffect(() => {
    if (!hydrated) return;

    gsap.registerPlugin(ScrollTrigger);

    const heroTitle = heroTitleRef.current;
    const heroSub = heroSubRef.current;
    if (heroTitle && heroSub) {
      gsap
        .timeline()
        .from(heroTitle, {
          opacity: 0,
          y: 18,
          duration: 0.7,
          ease: "power3.out",
        })
        .from(
          heroSub,
          { opacity: 0, y: 14, duration: 0.6, ease: "power3.out" },
          "-=0.35"
        );
    }

    const loveCard = loveCardRef.current;
    if (loveCard) {
      gsap.to(loveCard, {
        y: -10,
        ease: "none",
        scrollTrigger: {
          trigger: loveCard,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    const grid = gridRef.current;
    if (grid) {
      const cards = Array.from(grid.querySelectorAll("[data-gift-card]"));
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 80%",
          once: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [hydrated]);

  // Floating petals
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-petal]");
    nodes.forEach((node, idx) => {
      gsap.to(node, {
        y: 18 + Math.random() * 18,
        x: (Math.random() * 2 - 1) * 10,
        rotation: (Math.random() * 2 - 1) * 18,
        duration: 2.8 + idx * 0.15,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }, [petals]);

  // Love note typewriter
  const loveNote =
    "Happy birthday, my love. You send wishlists as jokes… so I made one real. Pick what you want, swap links, and make it perfectly you.";
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (!hydrated) return;

    const counter = { p: 0 };
    setTyped("");

    const tween = gsap.to(counter, {
      p: loveNote.length,
      duration: 4.5,
      ease: "none",
      onUpdate: () => {
        const n = Math.floor(counter.p);
        setTyped(loveNote.slice(0, n));
      },
    });

    return () => {
      tween.kill();
    };
  }, [hydrated]);

  const updateLink = (id: number, newLink: string) => {
    setGifts((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, link: newLink } : g
      )
    );
    const root = confettiRootRef.current;
    if (root) fireConfetti(root);
  };

  const saveSuggestion = (id: number, link: string) => {
    setGifts((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, link, status: "selected", keepConfirmed: true }
          : g
      )
    );
    const root = confettiRootRef.current;
    if (root) fireConfetti(root);
  };

  const saveWishes = () => {
    setWishesSaved(wishesDraft);
    setWishesSavedPulse(true);
    const root = confettiRootRef.current;
    if (root) fireConfetti(root);
    window.setTimeout(() => setWishesSavedPulse(false), 500);
  };

  const setKeepGift = (id: number, keep: boolean) => {
    setGifts((prev) =>
      prev.map((g) => (g.id === id ? { ...g, keepConfirmed: keep } : g))
    );
    const root = confettiRootRef.current;
    if (root) fireConfetti(root);
  };

  const selectedGifts = useMemo(() => gifts.filter((g) => g.status === "selected"), [gifts]);

  const keptGifts = useMemo(
    () => selectedGifts.filter((g) => !!g.keepConfirmed),
    [selectedGifts]
  );

  const canSubmit = useMemo(() => {
    if (!hydrated) return false;
    return keptGifts.length > 0;
  }, [hydrated, keptGifts]);

  return (
    <div className="relative">
      <div
        ref={confettiRootRef}
        className="pointer-events-none fixed inset-0 z-50"
      />

      {/* Tiny floating hearts */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-20 select-none opacity-60">
        <div className="floaty text-rosePrimary">♥</div>
        <div className="floaty -mt-1 ml-3 text-rosePrimary/80">♥</div>
        <div className="floaty -mt-1 ml-1 text-rosePrimary/70">♥</div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-roseSoft/70 bg-white/70 p-8 shadow-lg shadow-pink-200/40 sm:p-12">
          <div className="pointer-events-none absolute inset-0">
            {petals.map((p) => (
              <div key={p.id} data-petal className="absolute rounded-[999px] bg-roseSoft"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: Math.max(10, Math.floor(p.size * 1.35)),
                  opacity: p.opacity,
                  transform: `rotate(${p.rotate}deg)`,
                  filter: "blur(0.2px)",
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <h1 ref={heroTitleRef} className="font-heading text-3xl leading-tight text-accentRed sm:text-5xl" >
              For the Girl Who Sends Wishlists as Jokes
            </h1>
            <p ref={heroSubRef} className="mt-4 max-w-xl text-base text-slate-700 sm:text-lg" >
              This year, I took notes.
            </p>
          </div>
        </section>

        {/* Love Note */}
        <section className="mt-10">
          <div
            ref={loveCardRef}
            className="mx-auto max-w-3xl rounded-2xl border border-roseSoft/80 bg-white p-6 text-center shadow-lg shadow-pink-200/40 sm:p-8"
          >
            <div className="font-heading text-2xl text-accentRed">
              A Little birthday shopping if you will...
            </div>
            <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              {typed}
              <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 bg-rosePrimary/70" />
            </p>
          </div>
        </section>

        {/* Gift Grid */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl text-accentRed sm:text-3xl">
                Your gifts (editable)
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Keep what you want Mithi, links are optional.
              </p>
            </div>
          </div>

          <div ref={gridRef} className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" >
            {gifts.map((gift) => (
              <div key={gift.id} data-gift-card>
                {gift.status === "selected" ? (
                  <GiftCard gift={gift} onUpdateLink={updateLink} onKeepChange={setKeepGift} />
                ) : (
                  <EmptyGiftCard gift={gift} onSaveSuggestion={saveSuggestion} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Add More Wishes */}
        <section className="mt-12">
          <div className="rounded-2xl border border-roseSoft/80 bg-linear-to-br from-rose-100 to-pink-50 p-6 shadow-lg shadow-pink-200/30 sm:p-8">
            <h3 className="font-heading text-2xl text-accentRed">
              Anything else you secretly want?
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Add it here... I’m listening. Maybe for next year, or just to know for fun.
            </p>

            <textarea
              value={wishesDraft}
              onChange={(e) => setWishesDraft(e.target.value)}
              placeholder="Tell me your secret wishlist thoughts..."
              className="mt-4 min-h-28 w-full resize-none rounded-2xl border border-roseSoft/90 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-rosePrimary"
            />

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={saveWishes}
                className="w-full rounded-2xl bg-rose-300 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-pink-200/40 transition-transform active:scale-[0.98] sm:w-auto"
              >
                Save
              </button>
              <div
                className={`text-sm text-slate-600 transition-opacity ${
                  wishesSavedPulse ? "opacity-100" : "opacity-70"
                }`}
              >
                {wishesSaved ? "Saved." : "Not saved yet."}
              </div>
            </div>
          </div>
        </section>

        {/* Submit */}
        <section className="mt-10">
          <div className="rounded-2xl border border-roseSoft/80 bg-white p-6 shadow-lg shadow-pink-200/30 sm:p-8">
            <h3 className="font-heading text-2xl text-accentRed">
              When you’re done…
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Keep as many gifts as you like... links are optional.. then hit submit!!   
              <span className="mt-1 text-lg font-semibold text-rose-500">
                &nbsp;&nbsp;They will be sent
              </span>
            </p>

            <button type="button" disabled={!canSubmit} onClick={async () => {
                if (!canSubmit) return;
                const res = await fetch("/api/submit", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    gifts: keptGifts,
                    wishes: wishesSaved,
                  }),
                });

                if (!res.ok) {
                  const txt = await res.text();
                  alert(
                    txt ||
                      "Submit failed. If this is your first time, you may need to set email env vars."
                  );
                  return;
                }

                alert("Submitted! 💌");
              }}
              className="mt-4 w-full rounded-2xl bg-rose-300 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-pink-200/40 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Submit
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
