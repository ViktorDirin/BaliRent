"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    MapPin,
    Bed,
    Bath,
    Waves,
    ArrowRight,
    SlidersHorizontal,
    X,
    ChevronDown,
    Plus,
    Minus,
    SearchX,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ApartmentItem {
    id: string;
    slug: string;
    title: string;
    city: string | null;
    pricePerNight: number;
    bedrooms: number;
    bathrooms: number;
    hasPool: boolean;
    images: string | null;
}

interface ApartmentFiltersProps {
    apartments: ApartmentItem[];
    cities: string[];
}

// ─── Parse first image from JSON string ───────────────────────────────────────
function getFirstImage(images: string | null): string | null {
    if (!images) return null;
    try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {
        if (images.startsWith("http")) return images;
    }
    return null;
}

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop";

// ─── Apartment Card ───────────────────────────────────────────────────────────
function ApartmentCard({ apt }: { apt: ApartmentItem }) {
    const image = getFirstImage(apt.images);
    const hasImage = !!image;
    const src = image || FALLBACK_IMAGE;

    return (
        <Link
            href={`/apartments/${apt.slug}`}
            className="group block bg-white rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
            style={{
                borderColor: "rgba(0,0,0,0.06)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 12px 32px rgba(0,0,0,0.10)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(197,160,89,0.25)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 1px 6px rgba(0,0,0,0.04)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(0,0,0,0.06)";
            }}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={apt.title}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!hasImage ? "opacity-40 grayscale" : ""
                        }`}
                />
                {!hasImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="px-4 py-2 rounded-lg backdrop-blur-sm"
                            style={{
                                background: "rgba(255,255,255,0.4)",
                                border: "1px solid rgba(255,255,255,0.2)",
                            }}
                        >
                            <span className="text-foreground/80 font-serif tracking-wide text-sm">
                                Photo Coming Soon
                            </span>
                        </div>
                    </div>
                )}
                {/* Price badge */}
                <div
                    className="absolute bottom-4 right-4 px-4 py-2 rounded-full backdrop-blur-md"
                    style={{
                        background: "rgba(255,255,255,0.92)",
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <span className="text-foreground font-semibold">
                        ${apt.pricePerNight}
                        <span className="text-muted-foreground text-sm font-normal">
                            {" "}
                            / night
                        </span>
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-center gap-2 text-sm mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="uppercase tracking-wider font-medium text-primary">
                        {apt.city || "Bali"}
                    </span>
                </div>
                <h3 className="text-xl font-serif text-foreground mb-4 line-clamp-1 group-hover:text-primary transition-colors">
                    {apt.title}
                </h3>

                <div
                    className="grid grid-cols-3 gap-4 border-t pt-4 mb-6"
                    style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                    <div className="flex flex-col items-center p-2 rounded bg-muted/50">
                        <Bed className="w-5 h-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">
                            {apt.bedrooms} Beds
                        </span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded bg-muted/50">
                        <Bath className="w-5 h-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">
                            {apt.bathrooms} Baths
                        </span>
                    </div>
                    {apt.hasPool ? (
                        <div className="flex flex-col items-center p-2 rounded bg-muted/50">
                            <Waves className="w-5 h-5 text-cyan-600 mb-1" />
                            <span className="text-xs text-muted-foreground">Pool</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center p-2 rounded bg-muted/50">
                            <span className="text-muted-foreground text-lg leading-none mt-1">
                                —
                            </span>
                        </div>
                    )}
                </div>

                <div className="inline-flex items-center text-sm font-medium text-foreground group-hover:underline decoration-primary underline-offset-4">
                    View Property <ArrowRight className="ml-2 w-4 h-4 text-primary" />
                </div>
            </div>
        </Link>
    );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
const GOLD = "#C5A059";
const inputBase: React.CSSProperties = {
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 10,
    color: "#1a1a1a",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s",
};

export default function ApartmentFilters({
    apartments,
    cities,
}: ApartmentFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ── Seed initial state from URL params ────────────────────────────────────
    // `location` → city filter; `guests` → min bedrooms (1 guest ≈ 1 bedroom)
    const [search, setSearch] = useState("");
    const [city, setCity] = useState(() => searchParams.get("location") ?? "");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [bedrooms, setBedrooms] = useState(() => {
        const g = searchParams.get("guests");
        return g ? Math.max(0, Math.floor(parseInt(g) / 2)) : 0;
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    // ── Write filter changes back to URL (only on explicit user interaction) ───
    // We do NOT use useEffect for this — it fires on mount in React Strict Mode
    // (twice in dev), which triggers router.replace() and a fresh server render
    // that can wipe the date-filtered apartment list.
    function pushFilter(overrides: {
        city?: string;
        bedrooms?: number;
        minPrice?: string;
        maxPrice?: string;
        search?: string;
    }) {
        const params = new URLSearchParams(searchParams.toString());
        const nextCity = overrides.city ?? city;
        const nextBedrooms = overrides.bedrooms ?? bedrooms;
        const nextMinPrice = overrides.minPrice ?? minPrice;
        const nextMaxPrice = overrides.maxPrice ?? maxPrice;
        const nextSearch = overrides.search ?? search;

        if (nextCity) params.set("location", nextCity);
        else params.delete("location");

        if (nextSearch) params.set("q", nextSearch);
        else params.delete("q");

        if (nextMinPrice) params.set("minPrice", nextMinPrice);
        else params.delete("minPrice");

        if (nextMaxPrice) params.set("maxPrice", nextMaxPrice);
        else params.delete("maxPrice");

        if (nextBedrooms > 0) params.set("minBeds", String(nextBedrooms));
        else params.delete("minBeds");

        router.replace(`/our-apartments?${params.toString()}`, { scroll: false });
    }

    // ── Derived prices for range hints ────────────────────────────────────────
    const allPrices = apartments.map((a) => a.pricePerNight);
    const globalMin = allPrices.length ? Math.min(...allPrices) : 0;
    const globalMax = allPrices.length ? Math.max(...allPrices) : 9999;

    // ── Filtered list ─────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        const min = minPrice ? parseInt(minPrice) : null;
        const max = maxPrice ? parseInt(maxPrice) : null;

        return apartments.filter((apt) => {
            if (q && !apt.title.toLowerCase().includes(q) && !(apt.city ?? "").toLowerCase().includes(q))
                return false;
            if (city && apt.city !== city) return false;
            if (min !== null && apt.pricePerNight < min) return false;
            if (max !== null && apt.pricePerNight > max) return false;
            if (bedrooms > 0 && apt.bedrooms < bedrooms) return false;
            return true;
        });
    }, [apartments, search, city, minPrice, maxPrice, bedrooms]);

    const activeFilters =
        (search ? 1 : 0) +
        (city ? 1 : 0) +
        (minPrice || maxPrice ? 1 : 0) +
        (bedrooms > 0 ? 1 : 0);

    function clearAll() {
        setSearch("");
        setCity("");
        setMinPrice("");
        setMaxPrice("");
        setBedrooms(0);
    }

    // ── Shared focus ring handler ─────────────────────────────────────────────
    function focusBorder(e: React.FocusEvent<HTMLElement>) {
        (e.currentTarget as HTMLElement).style.borderColor = GOLD;
    }
    function blurBorder(e: React.FocusEvent<HTMLElement>) {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.12)";
    }

    return (
        <div>
            {/* ── Filter Bar ──────────────────────────────────────────────────── */}
            <div
                className="rounded-2xl mb-10"
                style={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                }}
            >
                {/* Top row: search + mobile toggle */}
                <div className="flex items-center gap-3 p-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: GOLD }}
                        />
                        <input
                            type="text"
                            placeholder="Search by name or location…"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                pushFilter({ search: e.target.value });
                            }}
                            onFocus={focusBorder}
                            onBlur={blurBorder}
                            className="w-full pl-9 pr-4 py-2.5"
                            style={{ ...inputBase }}
                            aria-label="Search apartments"
                        />
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                        style={{
                            background: mobileOpen
                                ? "rgba(197,160,89,0.12)"
                                : "rgba(0,0,0,0.04)",
                            border: `1px solid ${mobileOpen ? "rgba(197,160,89,0.4)" : "rgba(0,0,0,0.1)"}`,
                            color: mobileOpen ? GOLD : "#1a1a1a",
                        }}
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Toggle filters"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filters</span>
                        {activeFilters > 0 && (
                            <span
                                className="ml-1 rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center"
                                style={{ background: GOLD, color: "#fff" }}
                            >
                                {activeFilters}
                            </span>
                        )}
                        <ChevronDown
                            className="w-4 h-4 transition-transform"
                            style={{ transform: mobileOpen ? "rotate(180deg)" : "none" }}
                        />
                    </button>
                </div>

                {/* Filter controls — always visible on md+, collapsible on mobile */}
                <div
                    className={`${mobileOpen ? "block" : "hidden"} md:block border-t`}
                    style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 pt-3">

                        {/* Location */}
                        <div className="flex flex-col gap-1">
                            <label
                                className="text-xs font-semibold uppercase tracking-wider"
                                style={{ color: "#666" }}
                            >
                                Location
                            </label>
                            <div className="relative">
                                <MapPin
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                                    style={{ color: GOLD }}
                                />
                                <select
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value);
                                        pushFilter({ city: e.target.value });
                                    }}
                                    onFocus={focusBorder}
                                    onBlur={blurBorder}
                                    className="w-full pl-9 pr-8 py-2.5 appearance-none cursor-pointer"
                                    style={{ ...inputBase }}
                                    aria-label="Filter by location"
                                >
                                    <option value="">All Locations</option>
                                    {cities.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                                    style={{ color: "#999" }}
                                />
                            </div>
                        </div>

                        {/* Min Price */}
                        <div className="flex flex-col gap-1">
                            <label
                                className="text-xs font-semibold uppercase tracking-wider"
                                style={{ color: "#666" }}
                            >
                                Min Price / night
                            </label>
                            <input
                                type="number"
                                min={0}
                                placeholder={`$${globalMin}`}
                                value={minPrice}
                                onChange={(e) => {
                                    setMinPrice(e.target.value);
                                    pushFilter({ minPrice: e.target.value });
                                }}
                                onFocus={focusBorder}
                                onBlur={blurBorder}
                                className="w-full px-4 py-2.5"
                                style={{ ...inputBase }}
                                aria-label="Minimum price per night"
                            />
                        </div>

                        {/* Max Price */}
                        <div className="flex flex-col gap-1">
                            <label
                                className="text-xs font-semibold uppercase tracking-wider"
                                style={{ color: "#666" }}
                            >
                                Max Price / night
                            </label>
                            <input
                                type="number"
                                min={0}
                                placeholder={`$${globalMax}`}
                                value={maxPrice}
                                onChange={(e) => {
                                    setMaxPrice(e.target.value);
                                    pushFilter({ maxPrice: e.target.value });
                                }}
                                onFocus={focusBorder}
                                onBlur={blurBorder}
                                className="w-full px-4 py-2.5"
                                style={{ ...inputBase }}
                                aria-label="Maximum price per night"
                            />
                        </div>

                        {/* Bedrooms counter — also receives guests÷2 from home search */}
                        <div className="flex flex-col gap-1">
                            <label
                                className="text-xs font-semibold uppercase tracking-wider"
                                style={{ color: "#666" }}
                            >
                                Min Bedrooms
                            </label>
                            <div
                                className="flex items-center rounded-lg overflow-hidden"
                                style={{
                                    border: "1px solid rgba(0,0,0,0.12)",
                                    background: "#fff",
                                }}
                            >
                                <button
                                    onClick={() => {
                                        const next = Math.max(0, bedrooms - 1);
                                        setBedrooms(next);
                                        pushFilter({ bedrooms: next });
                                    }}
                                    className="flex items-center justify-center transition-colors"
                                    style={{
                                        width: 40,
                                        height: 42,
                                        background:
                                            bedrooms === 0 ? "rgba(0,0,0,0.03)" : "rgba(197,160,89,0.08)",
                                        borderRight: "1px solid rgba(0,0,0,0.08)",
                                        color: bedrooms === 0 ? "#bbb" : GOLD,
                                        cursor: bedrooms === 0 ? "not-allowed" : "pointer",
                                    }}
                                    aria-label="Decrease bedrooms"
                                    disabled={bedrooms === 0}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span
                                    className="flex-1 text-center text-sm font-semibold"
                                    style={{ color: bedrooms === 0 ? "#999" : "#1a1a1a" }}
                                >
                                    {bedrooms === 0 ? "Any" : `${bedrooms}+`}
                                </span>
                                <button
                                    onClick={() => {
                                        const next = Math.min(10, bedrooms + 1);
                                        setBedrooms(next);
                                        pushFilter({ bedrooms: next });
                                    }}
                                    className="flex items-center justify-center transition-colors"
                                    style={{
                                        width: 40,
                                        height: 42,
                                        background: "rgba(197,160,89,0.08)",
                                        borderLeft: "1px solid rgba(0,0,0,0.08)",
                                        color: GOLD,
                                        cursor: "pointer",
                                    }}
                                    aria-label="Increase bedrooms"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active filter chips + clear */}
                    {activeFilters > 0 && (
                        <div
                            className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-0"
                        >
                            <span className="text-xs text-muted-foreground">Active:</span>
                            {search && (
                                <Chip label={`"${search}"`} onRemove={() => setSearch("")} />
                            )}
                            {city && <Chip label={city} onRemove={() => setCity("")} />}
                            {(minPrice || maxPrice) && (
                                <Chip
                                    label={`$${minPrice || "0"} – $${maxPrice || "∞"}`}
                                    onRemove={() => {
                                        setMinPrice("");
                                        setMaxPrice("");
                                    }}
                                />
                            )}
                            {bedrooms > 0 && (
                                <Chip
                                    label={`${bedrooms}+ beds`}
                                    onRemove={() => setBedrooms(0)}
                                />
                            )}
                            <button
                                onClick={clearAll}
                                className="ml-auto text-xs font-medium underline underline-offset-2"
                                style={{ color: GOLD }}
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Results summary ──────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                    {filtered.length === 1 ? "property" : "properties"} found
                </p>
                {activeFilters > 0 && (
                    <button
                        onClick={clearAll}
                        className="text-sm font-medium"
                        style={{ color: GOLD }}
                    >
                        Reset filters
                    </button>
                )}
            </div>

            {/* ── Grid / Empty state ────────────────────────────────────────────── */}
            {filtered.length === 0 ? (
                <div
                    className="text-center py-24 rounded-2xl border-2 border-dashed flex flex-col items-center gap-6"
                    style={{ borderColor: "rgba(197,160,89,0.25)", background: "rgba(197,160,89,0.03)" }}
                >
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(197,160,89,0.10)" }}
                    >
                        <SearchX className="w-8 h-8" style={{ color: GOLD }} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-foreground font-semibold text-lg">
                            No villas found matching your criteria.
                        </p>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                            Try adjusting your filters or dates — our collection is updated regularly.
                        </p>
                    </div>
                    <button
                        onClick={clearAll}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                        style={{
                            background: GOLD,
                            color: "#fff",
                            boxShadow: "0 4px 14px rgba(197,160,89,0.35)",
                        }}
                    >
                        <X className="w-4 h-4" />
                        Reset all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {filtered.map((apt) => (
                        <ApartmentCard key={apt.id} apt={apt} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Filter chip ──────────────────────────────────────────────────────────────
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
            style={{
                background: "rgba(197,160,89,0.12)",
                border: "1px solid rgba(197,160,89,0.3)",
                color: "#8a6a2a",
            }}
        >
            {label}
            <button
                onClick={onRemove}
                className="ml-0.5 rounded-full flex items-center justify-center"
                style={{ color: "#C5A059", lineHeight: 1 }}
                aria-label={`Remove filter ${label}`}
            >
                <X className="w-3 h-3" />
            </button>
        </span>
    );
}
