"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-serif font-bold text-primary tracking-wide">
                            BaliRent
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider">
                                Home
                            </Link>
                            <Link href="/apartments" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider">
                                Our Apartments
                            </Link>
                            <Link href="/contact" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider">
                                Contact
                            </Link>
                            <Link href="/reserve" className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-none text-sm font-medium transition-colors uppercase tracking-wider">
                                Reserve Apartment
                            </Link>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-background border-b border-white/10 absolute w-full">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block hover:text-primary px-3 py-2 rounded-md text-base font-medium">
                            Home
                        </Link>
                        <Link href="/apartments" className="block hover:text-primary px-3 py-2 rounded-md text-base font-medium">
                            Our Apartments
                        </Link>
                        <Link href="/contact" className="block hover:text-primary px-3 py-2 rounded-md text-base font-medium">
                            Contact
                        </Link>
                        <Link href="/reserve" className="block w-full text-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-none text-base font-medium mt-4">
                            RESERVE APARTMENT
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
