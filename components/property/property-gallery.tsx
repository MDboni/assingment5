"use client";

import { ImageIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="grid aspect-[16/10] place-items-center border border-border bg-muted">
        <div className="text-center">
          <ImageIcon className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            No images
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Large image ── */}
      <div className="relative aspect-[16/10] overflow-hidden border border-border bg-muted">
        <Image
          key={images[activeIndex]}
          src={images[activeIndex]}
          alt={`${title} — photo ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="animate-in fade-in object-cover duration-500"
        />

        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 border border-border/50 bg-background/90 px-2 py-1 text-[10px] backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* ── Thumbnails ── */}
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative aspect-[4/3] overflow-hidden border transition-all",
                index === activeIndex
                  ? "border-primary opacity-100"
                  : "border-border opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
