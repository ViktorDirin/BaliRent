"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale/en-US";
import { registerLocale } from "react-datepicker";

registerLocale("en-US", enUS);

export default function HomeSearch() {
    const router = useRouter();
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [guests, setGuests] = useState("2");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (checkIn) params.set("from", checkIn.toISOString().split('T')[0]);
        if (checkOut) params.set("to", checkOut.toISOString().split('T')[0]);
        if (guests) params.set("guests", guests);

        router.push(`/our-apartments?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-8">
            <form
                onSubmit={handleSearch}
                className="bg-[#F9F8F3] p-4 rounded-xl shadow-xl shadow-black/10 border border-white/20 flex flex-col md:flex-row gap-4 items-center"
            >
                {/* Check-in */}
                <div className="relative w-full md:w-1/3 group z-20">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 ml-10">Check-in</label>
                        <div className="w-full">
                            <DatePicker
                                selected={checkIn}
                                onChange={(date: Date | null) => setCheckIn(date)}
                                selectsStart
                                startDate={checkIn}
                                endDate={checkOut}
                                minDate={new Date()}
                                placeholderText="Add dates"
                                locale="en-US"
                                className="pl-10 pr-4 py-3 bg-white border border-black/5 rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full transition-all shadow-sm cursor-pointer"
                                dateFormat="MMM d, yyyy"
                            />
                        </div>
                    </div>
                </div>

                {/* Check-out */}
                <div className="relative w-full md:w-1/3 group z-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 ml-10">Check-out</label>
                        <div className="w-full">
                            <DatePicker
                                selected={checkOut}
                                onChange={(date: Date | null) => setCheckOut(date)}
                                selectsEnd
                                startDate={checkIn}
                                endDate={checkOut}
                                minDate={checkIn || new Date()}
                                placeholderText="Add dates"
                                locale="en-US"
                                className="pl-10 pr-4 py-3 bg-white border border-black/5 rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full transition-all shadow-sm cursor-pointer"
                                dateFormat="MMM d, yyyy"
                            />
                        </div>
                    </div>
                </div>

                {/* Guests */}
                <div className="relative w-full md:w-1/4 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="guests" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 ml-10">Guests</label>
                        <input
                            type="number"
                            id="guests"
                            min="1"
                            max="10"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="pl-10 pr-4 py-3 bg-white border border-black/5 rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full transition-all shadow-sm"
                            placeholder="Guests"
                        />
                    </div>
                </div>

                {/* Search Button */}
                <div className="w-full md:w-auto flex items-end h-full pt-6">
                    <button
                        type="submit"
                        className="w-full md:w-auto h-[50px] px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                        <Search className="w-5 h-5" />
                        <span className="md:hidden">Search</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
