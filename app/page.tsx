"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

//  Birthday wish text (fill this in) 
const WISH = ``;

//  Photos (place bdaypic1.jpg – bdaypic4.jpg in /public/assets/)
// Rotation rules: left col tilts left (neg), right col tilts right (pos)
//                 top row leans outward more, bottom row less
const photos = [
  {
    src: "/assets/bdaypic1.jpg",
    rotate: -8,   // top-left
    alt: "Birthday photo 1",
    col: 1, row: 1,
    caption: "So sassy back then 🥹",
  },
  {
    src: "/assets/bdaypic2.jpg",
    rotate: 8,    // top-right (mirror of top-left)
    alt: "Birthday photo 2",
    col: 3, row: 1,
    caption: "Cutie in Mohunbagan colors",
  },
  {
    src: "/assets/bdaypic3.jpg",
    rotate: 9,    // bottom-left (opposite direction to top-left)
    alt: "Birthday photo 3",
    col: 1, row: 3,
    caption: "In her element ",
  },
  {
    src: "/assets/bdaypic4.jpg",
    rotate: -9,   // bottom-right (mirror of bottom-left)
    alt: "Birthday photo 4",
    col: 3, row: 3,
    caption: "One of many Baddie moments ",
  },
];



// Fixed sparkle positions (static to avoid hydration mismatch)
const SPARKLES = [
  { id: 0,  x: "8%",  y: "12%", size: 9,  delay: 0.0, dur: 2.1 },
  { id: 1,  x: "20%", y: "6%",  size: 7,  delay: 0.4, dur: 1.7 },
  { id: 2,  x: "37%", y: "9%",  size: 11, delay: 0.7, dur: 2.4 },
  { id: 3,  x: "55%", y: "4%",  size: 8,  delay: 0.2, dur: 1.9 },
  { id: 4,  x: "72%", y: "11%", size: 10, delay: 1.1, dur: 2.2 },
  { id: 5,  x: "88%", y: "7%",  size: 7,  delay: 0.6, dur: 1.6 },
  { id: 6,  x: "5%",  y: "35%", size: 8,  delay: 1.3, dur: 2.0 },
  { id: 7,  x: "92%", y: "40%", size: 9,  delay: 0.9, dur: 1.8 },
  { id: 8,  x: "15%", y: "60%", size: 7,  delay: 0.3, dur: 2.3 },
  { id: 9,  x: "80%", y: "65%", size: 10, delay: 1.5, dur: 2.0 },
  { id: 10, x: "30%", y: "75%", size: 8,  delay: 0.8, dur: 1.7 },
  { id: 11, x: "65%", y: "80%", size: 7,  delay: 1.2, dur: 2.1 },
  { id: 12, x: "48%", y: "88%", size: 9,  delay: 0.5, dur: 1.9 },
  { id: 13, x: "10%", y: "85%", size: 6,  delay: 1.7, dur: 2.3 },
  { id: 14, x: "90%", y: "82%", size: 8,  delay: 0.1, dur: 1.6 },
  { id: 15, x: "43%", y: "48%", size: 7,  delay: 2.0, dur: 2.5 },
  { id: 16, x: "70%", y: "52%", size: 6,  delay: 1.4, dur: 1.8 },
  { id: 17, x: "58%", y: "30%", size: 9,  delay: 0.6, dur: 2.2 },
];

const EMOJI_ROW = ["", "", "", "", ""];

export default function WelcomePage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wishRef = useRef<HTMLDivElement>(null);
  const desktopWishRef = useRef<HTMLDivElement>(null);
  const sparkleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9 }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      )
      .fromTo(
        photoRefs.current.filter(Boolean),
        { opacity: 0, y: 50, scale: 0.88 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.14,
          ease: "back.out(1.2)",
        },
        "-=0.2"
      )
      .fromTo(
        [wishRef.current, desktopWishRef.current].filter(Boolean),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.3"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.85, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" },
        "-=0.35"
      );

    // Sparkle twinkle loop
    sparkleRefs.current.forEach((el, i) => {
      if (!el) return;
      const s = SPARKLES[i];
      if (!s) return;
      gsap.to(el, {
        opacity: 0.85,
        scale: 1.4,
        duration: s.dur,
        delay: s.delay,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    // Subtle parallax hero
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const handlePhotoEnter = (i: number) => {
    setHoveredPhoto(i);
    const el = photoRefs.current[i];
    if (!el) return;
    gsap.to(el, { y: -14, scale: 1.07, duration: 0.35, ease: "power2.out" });
  };

  const handlePhotoLeave = (i: number) => {
    setHoveredPhoto(null);
    const el = photoRefs.current[i];
    if (!el) return;
    gsap.to(el, { y: 0, scale: 1, duration: 0.4, ease: "power2.inOut" });
  };

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden bg-linear-to-br from-rose-50 via-pink-50 to-rose-100">
      {/* Background sparkles */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {SPARKLES.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => { sparkleRefs.current[i] = el; }}
            className="absolute opacity-0"
            style={{ left: s.x, top: s.y }}
          >
            <svg width={s.size} height={s.size} viewBox="0 0 16 16" fill="none">
              <path
                d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z"
                fill="#F472B6"
                fillOpacity="0.65"
              />
            </svg>
          </div>
        ))}
      </div>

      <div
        ref={heroRef}
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pt-6 pb-16 sm:pt-12 sm:pb-20"
      >
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-center font-heading text-4xl leading-tight text-accentRed opacity-0 sm:text-6xl lg:text-7xl"
        >
          Happy Birthday,
          <br />
          <span className="text-rosePrimary">Mithi </span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-2 max-w-lg text-center text-sm text-slate-600 opacity-0 sm:text-2xl"
        >
          25 years young
        </p>

        {/* ── Mobile layout: 2×2 photo grid + wish card stacked ── */}
        <div ref={wishRef} className="mt-8 w-full max-w-5xl opacity-0 sm:hidden">
          {/* 2×2 photo grid */}
          <div className="grid grid-cols-2 gap-3 px-2">
            {photos.map((photo, i) => (
              <div
                key={i}
                ref={(el) => { photoRefs.current[i] = el; }}
                onTouchStart={() => handlePhotoEnter(i)}
                onTouchEnd={() => handlePhotoLeave(i)}
                className="relative cursor-pointer overflow-hidden rounded-2xl opacity-0"
                style={{
                  rotate: `${photo.rotate * 0.5}deg`,
                  boxShadow: "0 6px 20px rgba(190,18,60,0.14)",
                  aspectRatio: "4/5",
                  willChange: "transform",
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500"
                  style={{ transform: hoveredPhoto === i ? "scale(1.09)" : "scale(1)" }}
                  sizes="45vw"
                />
                <div
                  className="absolute inset-0 flex items-end justify-center pb-2"
                  style={{ backgroundColor: hoveredPhoto === i ? "rgba(20,5,15,0.48)" : "rgba(0,0,0,0)", transition: "background-color 0.3s" }}
                >
                  <span
                    className="px-2 text-center text-xs font-semibold leading-snug text-white"
                    style={{
                      opacity: hoveredPhoto === i ? 1 : 0,
                      transform: hoveredPhoto === i ? "translateY(0px)" : "translateY(8px)",
                      transition: "opacity 0.25s, transform 0.25s",
                    }}
                  >
                    {photo.caption || "✨"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Wish card below photos on mobile */}
          <div className="mx-2 mt-4 rounded-3xl border border-roseSoft/80 bg-white/80 p-4 text-center shadow-lg shadow-pink-200/40 backdrop-blur">
            <div className="mb-2 font-heading text-lg text-accentRed">
              A little something from me…
            </div>
            <p className="max-h-36 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-slate-700 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-pink-300">
              {WISH || (
                <span className="italic text-slate-400">
                  All of your wishes may come true.
                  I know this year has a rough start but I know it will turn around for the better soon.
                  I&apos;m gonna be there through all the ups and downs, cheering you on and supporting you.
                  Giving you a shoulder to cry on whenever the going gets tough.
                  Just know that you&apos;re not alone in this. I&apos;m right there beside you, every step of the way.
                  I know the birthday trip is missing as well, couldn&apos;t make it happen this time,
                  but I promise we&apos;ll make up for it with many more adventures together in the future... and very soon!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* ── Desktop layout: 3×3 grid with photos in corners ── */}
        <div
          ref={desktopWishRef}
          className="mt-14 w-full max-w-5xl opacity-0 max-sm:hidden"
          style={{
            display: "grid",
            gridTemplateColumns: "clamp(110px,15vw,180px) 1fr clamp(110px,15vw,180px)",
            gridTemplateRows: "clamp(110px,15vw,180px) 1fr clamp(110px,15vw,180px)",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          {/* Corner photos */}
          {photos.map((photo, i) => (
            <div
              key={i}
              ref={(el) => { photoRefs.current[4 + i] = el; }}
              onMouseEnter={() => handlePhotoEnter(4 + i)}
              onMouseLeave={() => handlePhotoLeave(4 + i)}
              className="relative cursor-pointer overflow-hidden rounded-2xl opacity-0"
              style={{
                gridColumn: photo.col,
                gridRow: photo.row,
                rotate: `${photo.rotate}deg`,
                boxShadow: "0 10px 32px rgba(190,18,60,0.16)",
                width: "clamp(100px, 13vw, 165px)",
                aspectRatio: "4/5",
                willChange: "transform",
                zIndex: hoveredPhoto === 4 + i ? 20 : photo.row === 1 ? 10 : 5,
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500"
                style={{ transform: hoveredPhoto === 4 + i ? "scale(1.09)" : "scale(1)" }}
                sizes="165px"
              />
              <div
                className="absolute inset-0 flex items-end justify-center pb-3 transition-colors duration-300"
                style={{
                  backgroundColor: hoveredPhoto === 4 + i ? "rgba(20,5,15,0.48)" : "rgba(0,0,0,0)",
                }}
              >
                <span
                  className="px-2 text-center text-xs font-semibold leading-snug text-white"
                  style={{
                    opacity: hoveredPhoto === 4 + i ? 1 : 0,
                    transform: hoveredPhoto === 4 + i ? "translateY(0px)" : "translateY(8px)",
                    transition: "opacity 0.25s, transform 0.25s",
                  }}
                >
                  {photo.caption || "✨"}
                </span>
              </div>
            </div>
          ))}

          {/* Wish card — spans center column, rows 1–3 */}
          <div
            className="rounded-3xl border border-roseSoft/80 bg-white/80 p-5 text-center shadow-lg shadow-pink-200/40 backdrop-blur sm:p-8"
            style={{ gridColumn: 2, gridRow: "1 / 4", width: "100%" }}
          >
            <div className="mb-3 font-heading text-xl text-accentRed sm:text-2xl">
              A little something from me…
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 sm:text-base">
              {WISH || (
                <span className="italic text-slate-400">
                  All of your wishes may come true.
                  I know this year has a rough start but I know it will turn around for the better soon.
                  I&apos;m gonna be there through all the ups and downs, cheering you on and supporting you.
                  Giving you a shoulder to cry on whenever the going gets tough.
                  Just know that you&apos;re not alone in this. I&apos;m right there beside you, every step of the way.
                  I know the birthday trip is missing as well, couldn&apos;t make it happen this time,
                  but I promise we&apos;ll make up for it with many more adventures together in the future... and very soon!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* CTA button */}
        <Link
          href="/gifts"
          ref={ctaRef}
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-rose-300 px-6 py-3 font-heading text-base font-semibold text-white opacity-0 shadow-lg shadow-rose-300/50 transition-all duration-200 hover:-translate-y-1 hover:bg-rose-700 hover:shadow-rose-400/60 active:scale-95 sm:mt-12 sm:px-8 sm:py-4 sm:text-lg"
        >
          Open your gifts
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
            
          </span>
        </Link>

        {/* Emoji row */}
        <div className="mt-8 flex select-none gap-3 text-2xl">
          {EMOJI_ROW.map((emoji, i) => (
            <span
              key={i}
              className="inline-block cursor-default transition-transform duration-200 hover:scale-125"
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
