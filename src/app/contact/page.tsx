"use client";

import { useState } from "react";
import {
    Mail,
    MapPin,
    Phone,
    User,
    MessageSquare,
    CheckCircle2,
    Loader2,
    Send,
    ChevronDown,
} from "lucide-react";
import { sendMessage } from "@/lib/actions";
import { CONTACT_INFO } from "@/lib/constants";

// ─── Gold design token ─────────────────────────────────────────────────────────
const GOLD = "#C5A059";

// ─── Phone country codes ───────────────────────────────────────────────────────
const COUNTRY_CODES = [
    { code: "+7", flag: "🇷🇺", label: "Russia" },
    { code: "+62", flag: "🇮🇩", label: "Indonesia" },
    { code: "+1", flag: "🇺🇸", label: "USA / Canada" },
    { code: "+44", flag: "🇬🇧", label: "United Kingdom" },
    { code: "+61", flag: "🇦🇺", label: "Australia" },
    { code: "+65", flag: "🇸🇬", label: "Singapore" },
    { code: "+81", flag: "🇯🇵", label: "Japan" },
    { code: "+86", flag: "🇨🇳", label: "China" },
    { code: "+49", flag: "🇩🇪", label: "Germany" },
    { code: "+33", flag: "🇫🇷", label: "France" },
    { code: "+39", flag: "🇮🇹", label: "Italy" },
    { code: "+971", flag: "🇦🇪", label: "UAE" },
];

// ─── Field styles ──────────────────────────────────────────────────────────────
const fieldCls =
    "w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 " +
    "placeholder-neutral-400 text-sm focus:outline-none transition-all duration-200 " +
    "focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20";

// ─── Input row wrapper ─────────────────────────────────────────────────────────
function Field({ label, icon, error, children }: {
    label: string;
    icon: React.ReactNode;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <span style={{ color: GOLD }}>{icon}</span>
                {label}
            </label>
            {children}
            {error && (
                <p className="text-xs text-red-500 mt-0.5">{error}</p>
            )}
        </div>
    );
}

// ─── Contact Form (client) ────────────────────────────────────────────────────
export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCC] = useState("+7");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [serverError, setServerError] = useState("");

    function validate() {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = "Please enter your full name.";
        if (!email.trim()) e.email = "Please enter your email.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            e.email = "Enter a valid email address.";
        if (!phone.trim()) e.phone = "Please enter your phone number.";
        else if (!/^\d{4,15}$/.test(phone.replace(/[\s\-()]/g, "")))
            e.phone = "Enter a valid phone number.";
        if (!message.trim()) e.message = "Please write a message.";
        else if (message.trim().length < 10) e.message = "Message must be at least 10 characters.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setServerError("");
        try {
            const result = await sendMessage({
                name,
                email,
                phone: `${countryCode} ${phone}`.trim(),
                message,
            });
            if (result.success) {
                setSent(true);
            } else {
                setServerError(result.error ?? "Something went wrong. Please try again.");
            }
        } catch {
            setServerError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Page heading */}
                <div className="text-center mb-14">
                    <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: GOLD }}>
                        Bali · Luxury Rentals
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
                        Get in <span style={{ color: GOLD }}>Touch</span>
                    </h1>
                    <p className="text-neutral-500 text-lg max-w-xl mx-auto font-light">
                        Experience the pinnacle of Bali living. Reach out to reserve
                        your sanctuary or ask anything about our collection.
                    </p>
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

                    {/* ── Left: info cards ───────────────────────────── */}
                    <aside className="lg:col-span-2 space-y-5">
                        {[
                            {
                                icon: <Phone className="w-5 h-5" />,
                                title: "Phone",
                                value: CONTACT_INFO.phone,
                                href: `tel:${CONTACT_INFO.phone}`,
                            },
                            {
                                icon: <Mail className="w-5 h-5" />,
                                title: "Email",
                                value: CONTACT_INFO.email,
                                href: `mailto:${CONTACT_INFO.email}`,
                            },
                            {
                                icon: <MapPin className="w-5 h-5" />,
                                title: "Location",
                                value: CONTACT_INFO.address,
                                href: undefined,
                            },
                        ].map(({ icon, title, value, href }) => (
                            <div
                                key={title}
                                className="flex items-start gap-4 bg-white rounded-2xl p-5 border"
                                style={{ borderColor: "rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                            >
                                <div
                                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: "rgba(197,160,89,0.10)", color: GOLD }}
                                >
                                    {icon}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-0.5">{title}</p>
                                    {href ? (
                                        <a href={href} className="text-neutral-800 font-medium text-sm break-all hover:underline" style={{ textDecorationColor: GOLD }}>
                                            {value}
                                        </a>
                                    ) : (
                                        <p className="text-neutral-800 font-medium text-sm">{value}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Decorative quote */}
                        <div
                            className="rounded-2xl p-6 mt-2"
                            style={{
                                background: `linear-gradient(135deg, ${GOLD}18 0%, ${GOLD}08 100%)`,
                                border: `1px solid ${GOLD}30`,
                            }}
                        >
                            <p className="text-sm text-neutral-600 italic leading-relaxed">
                                &ldquo;Our team responds within a few hours. We&apos;re here to
                                make your Bali experience truly unforgettable.&rdquo;
                            </p>
                            <p className="text-xs font-semibold mt-3" style={{ color: GOLD }}>— BaliRent Concierge Team</p>
                        </div>
                    </aside>

                    {/* ── Right: form / success ────────────────────────── */}
                    <div
                        className="lg:col-span-3 bg-white rounded-2xl p-8 md:p-10"
                        style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}
                    >
                        {sent ? (
                            /* ── Success screen ── */
                            <div className="flex flex-col items-center justify-center py-12 text-center gap-5">
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center"
                                    style={{ background: "rgba(197,160,89,0.12)" }}
                                >
                                    <CheckCircle2 className="w-10 h-10" style={{ color: GOLD }} />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-serif font-semibold text-neutral-900">
                                        Message Sent!
                                    </h2>
                                    <p className="text-neutral-500 text-sm max-w-xs mx-auto leading-relaxed">
                                        Thank you, <strong>{name}</strong>. We&apos;ve received your
                                        message and will get back to you at{" "}
                                        <strong>{email}</strong> shortly.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSent(false);
                                        setName(""); setEmail(""); setPhone(""); setMessage("");
                                        setCC("+7"); setErrors({}); setServerError("");
                                    }}
                                    className="mt-2 text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
                                    style={{ color: GOLD }}
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            /* ── Form ── */
                            <>
                                <div className="mb-7">
                                    <h2 className="text-2xl font-serif font-semibold text-neutral-900">Send a Message</h2>
                                    <p className="text-neutral-400 text-sm mt-1">Fill in your details and we&apos;ll be in touch.</p>
                                </div>

                                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                                    {/* Full Name */}
                                    <Field label="Full Name" icon={<User className="w-3.5 h-3.5" />} error={errors.name}>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            value={name}
                                            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                                            placeholder="Jane Smith"
                                            className={fieldCls}
                                            style={errors.name ? { borderColor: "#ef4444" } : undefined}
                                            autoComplete="name"
                                        />
                                    </Field>

                                    {/* Email */}
                                    <Field label="Email Address" icon={<Mail className="w-3.5 h-3.5" />} error={errors.email}>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            value={email}
                                            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                                            placeholder="jane@example.com"
                                            className={fieldCls}
                                            style={errors.email ? { borderColor: "#ef4444" } : undefined}
                                            autoComplete="email"
                                        />
                                    </Field>

                                    {/* Phone with country code */}
                                    <Field label="Phone Number" icon={<Phone className="w-3.5 h-3.5" />} error={errors.phone}>
                                        <div className="flex gap-2">
                                            {/* Country code selector */}
                                            <div className="relative flex-shrink-0">
                                                <select
                                                    value={countryCode}
                                                    onChange={e => setCC(e.target.value)}
                                                    className="appearance-none bg-white border border-neutral-200 rounded-xl pl-3 pr-7 py-3 text-sm text-neutral-900 focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 cursor-pointer transition-all"
                                                    style={{ minWidth: 90 }}
                                                    aria-label="Country code"
                                                >
                                                    {COUNTRY_CODES.map(c => (
                                                        <option key={c.code} value={c.code}>
                                                            {c.flag} {c.code}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-neutral-400" />
                                            </div>
                                            {/* Number */}
                                            <input
                                                id="contact-phone"
                                                type="tel"
                                                value={phone}
                                                onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: "" })); }}
                                                placeholder="912 345 6789"
                                                className={`${fieldCls} flex-1`}
                                                style={errors.phone ? { borderColor: "#ef4444" } : undefined}
                                                autoComplete="tel"
                                            />
                                        </div>
                                    </Field>

                                    {/* Message */}
                                    <Field label="Message" icon={<MessageSquare className="w-3.5 h-3.5" />} error={errors.message}>
                                        <textarea
                                            id="contact-message"
                                            rows={5}
                                            value={message}
                                            onChange={e => { setMessage(e.target.value); setErrors(p => ({ ...p, message: "" })); }}
                                            placeholder="Tell us about your ideal stay — dates, preferences, any questions…"
                                            className={`${fieldCls} resize-none`}
                                            style={errors.message ? { borderColor: "#ef4444" } : undefined}
                                        />
                                        <p className="text-right text-xs text-neutral-300 -mt-1">{message.length} chars</p>
                                    </Field>

                                    {/* Server error */}
                                    {serverError && (
                                        <div className="rounded-xl px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-100">
                                            {serverError}
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm tracking-wide uppercase transition-all duration-200 disabled:opacity-60"
                                        style={{
                                            background: GOLD,
                                            color: "#fff",
                                            boxShadow: "0 4px 18px rgba(197,160,89,0.35)",
                                        }}
                                        onMouseEnter={e => !loading && ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")}
                                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
