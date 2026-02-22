import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b h-16 border-roseSoft/70 bg-roseLight/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1 h-full">
        <div className="font-heading text-lg text-accentRed sm:text-xl">
          Birthday Surprise
        </div>
        <div className="text-sm text-slate-600">
          <Image src="/assets/tulip.png" alt="Tulip" width={24} height={32} className="object-contain " />
        </div>
      </div>
    </header>
  );
}
