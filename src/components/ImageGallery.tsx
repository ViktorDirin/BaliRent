"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ImageOff, Expand } from "lucide-react";

interface ImageGalleryProps {
    images: string[];
    title?: string;
}

// ─── No-Image Placeholder ───────────────────────────────────────────────────
function NoImagePlaceholder() {
    return (
        <div
            className="w-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed"
            style={{
                minHeight: 420,
                background: "linear-gradient(135deg, #1a1a1a 60%, #2a2218 100%)",
                borderColor: "rgba(197,160,89,0.3)",
            }}
        >
            <ImageOff
                style={{ color: "rgba(197,160,89,0.5)", width: 64, height: 64, marginBottom: 16 }}
            />
            <p
                style={{
                    color: "rgba(197,160,89,0.7)",
                    fontSize: "1.1rem",
                    fontFamily: "var(--font-serif, serif)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                }}
            >
                No photos available
            </p>
            <p
                style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "0.85rem",
                    marginTop: 6,
                }}
            >
                Photos will appear here once uploaded
            </p>
        </div>
    );
}

// ─── Lightbox Overlay ────────────────────────────────────────────────────────
function Lightbox({
    images,
    startIndex,
    onClose,
}: {
    images: string[];
    startIndex: number;
    onClose: () => void;
}) {
    const [current, setCurrent] = useState(startIndex);
    const [direction, setDirection] = useState(0);

    // Touch/swipe state
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const go = useCallback(
        (dir: number) => {
            setDirection(dir);
            setCurrent((prev) => (prev + dir + images.length) % images.length);
        },
        [images.length]
    );

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [go, onClose]);

    // Prevent body scroll while lightbox open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            go(dx < 0 ? 1 : -1);
        }
        touchStartX.current = null;
        touchStartY.current = null;
    };

    const variants = {
        enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d < 0 ? "100%" : "-100%", opacity: 0 }),
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(10,8,5,0.85)", backdropFilter: "blur(14px)" }}
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                aria-label="Close lightbox"
                className="absolute top-5 right-5 z-10 flex items-center justify-center rounded-full transition-all"
                style={{
                    width: 44,
                    height: 44,
                    background: "rgba(197,160,89,0.25)",
                    border: "2px solid rgba(197,160,89,0.8)",
                    color: "#C5A059",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.6)",
                }}
                onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(197,160,89,0.5)")
                }
                onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(197,160,89,0.25)")
                }
            >
                <X size={20} />
            </button>

            {/* Counter */}
            <div
                className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-sm tracking-widest uppercase"
                style={{
                    color: "rgba(197,160,89,0.8)",
                    fontFamily: "var(--font-sans, sans-serif)",
                }}
            >
                {current + 1} / {images.length}
            </div>

            {/* Prev/Next buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            go(-1);
                        }}
                        aria-label="Previous image"
                        className="absolute left-4 md:left-8 z-10 flex items-center justify-center rounded-full transition-all"
                        style={{
                            width: 52,
                            height: 52,
                            background: "rgba(197,160,89,0.22)",
                            border: "2px solid rgba(197,160,89,0.75)",
                            color: "#C5A059",
                            boxShadow: "0 2px 14px rgba(0,0,0,0.55)",
                        }}
                        onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.background =
                            "rgba(197,160,89,0.45)")
                        }
                        onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.background =
                            "rgba(197,160,89,0.22)")
                        }
                    >
                        <ChevronLeft size={26} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            go(1);
                        }}
                        aria-label="Next image"
                        className="absolute right-4 md:right-8 z-10 flex items-center justify-center rounded-full transition-all"
                        style={{
                            width: 52,
                            height: 52,
                            background: "rgba(197,160,89,0.22)",
                            border: "2px solid rgba(197,160,89,0.75)",
                            color: "#C5A059",
                            boxShadow: "0 2px 14px rgba(0,0,0,0.55)",
                        }}
                        onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.background =
                            "rgba(197,160,89,0.45)")
                        }
                        onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.background =
                            "rgba(197,160,89,0.22)")
                        }
                    >
                        <ChevronRight size={26} />
                    </button>
                </>
            )}

            {/* Image */}
            <div
                className="relative flex items-center justify-center w-full h-full px-20 py-16"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ overflow: "hidden" }}
            >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.img
                        key={current}
                        src={images[current]}
                        alt={`Photo ${current + 1}`}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
                        className="max-h-full max-w-full object-contain rounded-lg select-none"
                        style={{ userSelect: "none", maxHeight: "80vh" }}
                        draggable={false}
                    />
                </AnimatePresence>
            </div>

            {/* Dot indicators */}
            {images.length > 1 && images.length <= 12 && (
                <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10"
                >
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                setDirection(i > current ? 1 : -1);
                                setCurrent(i);
                            }}
                            aria-label={`Go to image ${i + 1}`}
                            className="rounded-full transition-all"
                            style={{
                                width: i === current ? 24 : 8,
                                height: 8,
                                background: i === current ? "#C5A059" : "rgba(197,160,89,0.35)",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                            }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}

// ─── Main ImageGallery Component ─────────────────────────────────────────────
export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Touch/swipe for mobile grid view
    const touchStartX = useRef<number | null>(null);
    const [mobileIndex, setMobileIndex] = useState(0);

    const openLightbox = (idx: number) => setLightboxIndex(idx);
    const closeLightbox = () => setLightboxIndex(null);

    const handleGridTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleGridTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 40) {
            setMobileIndex((prev) =>
                dx < 0
                    ? Math.min(prev + 1, images.length - 1)
                    : Math.max(prev - 1, 0)
            );
        }
        touchStartX.current = null;
    };

    // ── No images ──
    if (!images || images.length === 0) {
        return <NoImagePlaceholder />;
    }

    const mainImage = images[0];
    // Show up to 4 thumbnails (indices 1-4); "show all" tile on the last one
    const thumbs = images.slice(1, 5);
    const hiddenCount = images.length - 5; // images not shown (beyond first 5)

    return (
        <>
            {/* ── Desktop / Tablet Grid Layout ─────────────────────────────────── */}
            <div
                className="hidden md:grid gap-2 rounded-2xl overflow-hidden"
                style={{ gridTemplateColumns: "2fr 1fr", height: 520, maxHeight: 520 }}
            >
                {/* Large main image */}
                <div
                    className="relative group cursor-zoom-in overflow-hidden"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                    onClick={() => openLightbox(0)}
                >
                    <img
                        src={mainImage}
                        alt={title ?? "Main photo"}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Subtle gradient overlay */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.25)" }}
                    >
                        <div
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                            style={{
                                background: "rgba(197,160,89,0.9)",
                                color: "#1a1a1a",
                            }}
                        >
                            <ZoomIn size={16} />
                            View full screen
                        </div>
                    </div>
                </div>

                {/* Thumbnails column (right) */}
                <div
                    className="grid gap-2"
                    style={{
                        gridTemplateRows: thumbs.length > 2 ? "1fr 1fr 1fr 1fr" : `repeat(${thumbs.length}, 1fr)`,
                        borderRadius: "0 1rem 1rem 0",
                        overflow: "hidden",
                    }}
                >
                    {thumbs.map((img, i) => {
                        const realIdx = i + 1;
                        const isLast = i === thumbs.length - 1 && hiddenCount > 0;
                        return (
                            <div
                                key={i}
                                className="relative group cursor-zoom-in overflow-hidden"
                                style={{
                                    borderRadius:
                                        i === 0
                                            ? "0 1rem 0 0"
                                            : i === thumbs.length - 1
                                                ? "0 0 1rem 0"
                                                : "0",
                                    minHeight: 0,
                                }}
                                onClick={() => openLightbox(realIdx)}
                            >
                                <img
                                    src={img}
                                    alt={`Photo ${realIdx + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Hover overlay */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                                    style={{ background: "rgba(0,0,0,0.3)" }}
                                />
                                {/* "Show all" overlay on last thumb */}
                                {isLast && (
                                    <div
                                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                                        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openLightbox(realIdx);
                                        }}
                                    >
                                        <Expand size={24} style={{ color: "#C5A059", marginBottom: 6 }} />
                                        <span
                                            className="text-sm font-semibold tracking-wide"
                                            style={{ color: "#C5A059" }}
                                        >
                                            +{hiddenCount + 1} more
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* If only 1 image total, fill the right side with a stylistic placeholder */}
                    {thumbs.length === 0 && (
                        <div
                            className="flex items-center justify-center"
                            style={{
                                borderRadius: "0 1rem 1rem 0",
                                background: "linear-gradient(135deg, #1a1a1a 60%, #2a2218 100%)",
                                border: "1px dashed rgba(197,160,89,0.2)",
                            }}
                        >
                            <p
                                style={{
                                    color: "rgba(197,160,89,0.4)",
                                    fontSize: "0.8rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.12em",
                                }}
                            >
                                More photos coming soon
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Mobile Swipeable Carousel ─────────────────────────────────────── */}
            <div
                className="md:hidden relative rounded-2xl overflow-hidden"
                style={{ background: "#111" }}
                onTouchStart={handleGridTouchStart}
                onTouchEnd={handleGridTouchEnd}
            >
                <div
                    className="relative"
                    style={{ aspectRatio: "4/3" }}
                    onClick={() => openLightbox(mobileIndex)}
                >
                    <AnimatePresence initial={false} mode="wait">
                        <motion.img
                            key={mobileIndex}
                            src={images[mobileIndex]}
                            alt={`Photo ${mobileIndex + 1}`}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.25 }}
                            className="w-full h-full object-cover absolute inset-0"
                            style={{ width: "100%", height: "100%" }}
                            draggable={false}
                        />
                    </AnimatePresence>

                    {/* Gradient overlay with tap hint */}
                    <div
                        className="absolute inset-0 flex items-end justify-between p-4"
                        style={{
                            background:
                                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                            pointerEvents: "none",
                        }}
                    >
                        <span
                            className="text-xs uppercase tracking-widest"
                            style={{ color: "rgba(197,160,89,0.9)" }}
                        >
                            Tap to enlarge
                        </span>
                        <span
                            className="text-xs"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                        >
                            {mobileIndex + 1} / {images.length}
                        </span>
                    </div>
                </div>

                {/* Dot indicators */}
                {images.length > 1 && (
                    <div className="flex justify-center gap-1.5 py-3" style={{ background: "#111" }}>
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setMobileIndex(i)}
                                className="rounded-full transition-all"
                                aria-label={`Go to photo ${i + 1}`}
                                style={{
                                    width: i === mobileIndex ? 20 : 7,
                                    height: 7,
                                    background:
                                        i === mobileIndex
                                            ? "#C5A059"
                                            : "rgba(197,160,89,0.3)",
                                    border: "none",
                                    padding: 0,
                                    cursor: "pointer",
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Lightbox ───────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <Lightbox
                        images={images}
                        startIndex={lightboxIndex}
                        onClose={closeLightbox}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
