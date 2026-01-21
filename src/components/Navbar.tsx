"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-white/20 transition-all duration-300 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-serif font-bold text-neutral-900 tracking-wide">
                            BaliRent
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="text-neutral-900 hover:text-primary transition-colors px-3 py-2 text-sm font-medium uppercase tracking-wide">
                                HOME
                            </Link>
                            <Link href="/our-apartments" className="text-neutral-900 hover:text-primary transition-colors px-3 py-2 text-sm font-medium uppercase tracking-wide">
                                OUR APARTMENTS
                            </Link>
                            <Link href="/contact" className="text-neutral-900 hover:text-primary transition-colors px-3 py-2 text-sm font-medium uppercase tracking-wide">
                                CONTACT
                            </Link>
                            <Link href="/our-apartments" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full uppercase text-xs font-bold transition-all tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
                                Reserve Apartment
                            </Link>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-neutral-900 hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white/95 border-b border-black/5 absolute w-full backdrop-blur-md shadow-xl">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block text-neutral-900 hover:text-primary px-3 py-2 rounded-md text-base font-medium uppercase tracking-wide">
                            HOME
                        </Link>
                        <Link href="/our-apartments" className="block text-neutral-900 hover:text-primary px-3 py-2 rounded-md text-base font-medium uppercase tracking-wide">
                            OUR APARTMENTS
                        </Link>
                        <Link href="/contact" className="block text-neutral-900 hover:text-primary px-3 py-2 rounded-md text-base font-medium uppercase tracking-wide">
                            CONTACT
                        </Link>
                        <Link href="/our-apartments" className="block w-full text-center bg-primary text-white hover:bg-primary/90 px-4 py-3 rounded-full text-sm font-bold mt-4 uppercase tracking-widest shadow-md">
                            Reserve Apartment
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
