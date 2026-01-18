"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-serif font-bold text-white tracking-wide">
                            BaliRent
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="text-white hover:text-[#D4AF37] transition-colors px-3 py-2 text-sm font-medium uppercase tracking-wide">
                                HOME
                            </Link>
                            <Link href="/our-apartments" className="text-white hover:text-[#D4AF37] transition-colors px-3 py-2 text-sm font-medium uppercase tracking-wide">
                                OUR APARTMENTS
                            </Link>
                            <Link href="/contact" className="text-white hover:text-[#D4AF37] transition-colors px-3 py-2 text-sm font-medium uppercase tracking-wide">
                                CONTACT
                            </Link>
                            <Link href="/reserve" className="bg-[#D4AF37] hover:bg-[#B8960C] text-black px-6 py-2 rounded-sm uppercase text-sm font-bold transition-colors tracking-wide">
                                RESERVE APARTMENT
                            </Link>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#D4AF37] focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-black/95 border-b border-white/10 absolute w-full backdrop-blur-md">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block text-white hover:text-[#D4AF37] px-3 py-2 rounded-md text-base font-medium uppercase tracking-wide">
                            HOME
                        </Link>
                        <Link href="/our-apartments" className="block text-white hover:text-[#D4AF37] px-3 py-2 rounded-md text-base font-medium uppercase tracking-wide">
                            OUR APARTMENTS
                        </Link>
                        <Link href="/contact" className="block text-white hover:text-[#D4AF37] px-3 py-2 rounded-md text-base font-medium uppercase tracking-wide">
                            CONTACT
                        </Link>
                        <Link href="/reserve" className="block w-full text-center bg-[#D4AF37] text-black hover:bg-[#B8960C] px-4 py-2 rounded-sm text-base font-bold mt-4 uppercase tracking-wide">
                            RESERVE APARTMENT
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
