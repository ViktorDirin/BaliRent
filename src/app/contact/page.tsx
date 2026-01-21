import { CONTACT_INFO } from "@/lib/constants";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/actions";

export default async function ContactPage() {
    const settings = await getSettings();

    const address = settings.address || CONTACT_INFO.address;
    const phone = settings.phone || CONTACT_INFO.phone;
    const email = settings.email || CONTACT_INFO.email;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Side: Contact Information */}
                <div className="space-y-8 animate-fade-in-up">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                            Get in <span className="text-primary">Touch</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-md">
                            Experience the pinnacle of Bali living. Contact us to reserve your sanctuary or inquire about our premium properties.
                        </p>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-full bg-white border border-black/5 shadow-sm group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                                <Phone className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-foreground font-medium text-lg">Phone</h3>
                                <p className="text-muted-foreground">{phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-full bg-white border border-black/5 shadow-sm group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-foreground font-medium text-lg">Email</h3>
                                <p className="text-muted-foreground">{email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-full bg-white border border-black/5 shadow-sm group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                                <MapPin className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-foreground font-medium text-lg">Location</h3>
                                <p className="text-muted-foreground">{address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="bg-white p-8 md:p-10 rounded-2xl border border-black/5 shadow-xl animate-fade-in-up delay-100">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Send us a Message</h2>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-foreground placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-foreground placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-foreground placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 resize-none"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors duration-300 uppercase tracking-wide shadow-md"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
