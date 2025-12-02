import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-neutral-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand & Contact */}
                    <div>
                        <Link href="/" className="text-2xl font-serif font-bold text-primary block mb-6">
                            BaliRent
                        </Link>
                        <div className="space-y-4 text-gray-400">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                <p>Kutuh kelod, Jl. Tirta Tawar No.23, Petulu, Kec. Ubud, Gianyar, Bali 80571</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                                <p>+62 812 3456 7890</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                                <p>info@manggalabali.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-primary uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/apartments" className="text-gray-400 hover:text-primary transition-colors">Our Apartments</Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-400 hover:text-primary transition-colors">Blog</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social & Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-primary uppercase tracking-wider">Follow Us</h3>
                        <div className="flex gap-4 mb-8">
                            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-primary hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-primary hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to our newsletter for exclusive offers.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="bg-white/10 border border-white/20 px-4 py-2 rounded-none focus:outline-none focus:border-primary text-sm w-full"
                            />
                            <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors uppercase">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-16 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} BaliRent. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
