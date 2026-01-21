"use client";

import { useState, useEffect } from "react";
import { Calendar, Star, CheckCircle, Loader2 } from "lucide-react";
import { createBooking } from "@/lib/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale/en-US";
import { registerLocale } from "react-datepicker";

registerLocale("en-US", enUS);

interface BookingFormProps {
    apartmentId: string;
    pricePerNight: number;
    cleaningFee: number;
}

export default function BookingForm({ apartmentId, pricePerNight, cleaningFee }: BookingFormProps) {
    // Initialize dates
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Set default dates on mount to avoid hydration mismatch
    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const threeDaysLater = new Date(tomorrow);
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);

        setStartDate(tomorrow);
        setEndDate(threeDaysLater);
    }, []);

    const [guests, setGuests] = useState(2);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Guest details needed for the new booking implementation
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");

    // Calculate nights
    const nights = (startDate && endDate)
        ? Math.max(0, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)))
        : 0;

    const accommodationTotal = pricePerNight * nights;
    const total = accommodationTotal + cleaningFee;

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) return;

        setIsSubmitting(true);
        try {
            await createBooking({
                apartmentId,
                startDate: startDate,
                endDate: endDate,
                guestName,
                guestEmail,
                totalPrice: total
            });
            setBookingSuccess(true);
        } catch (error) {
            console.error(error);
            alert("Booking failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="bg-white border border-primary/20 rounded-xl p-8 shadow-xl text-center animate-fade-in-up">
                <div className="mx-auto bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Booking Confirmed!</h3>
                <p className="text-muted-foreground mb-6">
                    Thank you {guestName}! Your stay for {nights} nights has been reserved.
                </p>
                <div className="bg-muted p-4 rounded-lg mb-6 text-left border border-black/5">
                    <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                    <p className="text-xl font-bold text-foreground">${total}</p>
                </div>
                <button
                    onClick={() => setBookingSuccess(false)}
                    className="text-primary hover:text-primary/80 font-medium"
                >
                    Make another booking
                </button>
            </div>
        );
    }

    return (
        <div className="sticky top-24 bg-white border border-primary/30 rounded-xl p-6 shadow-xl shadow-black/5">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-black/5">
                <div>
                    <span className="text-2xl font-bold text-foreground">${pricePerNight}</span>
                    <span className="text-muted-foreground"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="font-medium text-foreground">5.0</span>
                    <span className="text-muted-foreground">(New)</span>
                </div>
            </div>

            <form onSubmit={handleBooking}>
                <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted border border-black/5 rounded-lg p-3 relative z-20">
                            <label className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Check-in</label>
                            <div className="relative w-full">
                                <Calendar className="w-4 h-4 absolute top-2.5 left-0 z-10 text-muted-foreground pointer-events-none" />
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date: Date | null) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={new Date()}
                                    placeholderText="Check-in"
                                    locale="en-US"
                                    className="bg-transparent w-full pl-6 text-sm focus:outline-none text-foreground cursor-pointer"
                                    dateFormat="MMM d, yyyy"
                                    required
                                />
                            </div>
                        </div>
                        <div className="bg-muted border border-black/5 rounded-lg p-3 relative z-10">
                            <label className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Check-out</label>
                            <div className="relative w-full">
                                <Calendar className="w-4 h-4 absolute top-2.5 left-0 z-10 text-muted-foreground pointer-events-none" />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date: Date | null) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate || new Date()}
                                    placeholderText="Check-out"
                                    locale="en-US"
                                    className="bg-transparent w-full pl-6 text-sm focus:outline-none text-foreground cursor-pointer"
                                    dateFormat="MMM d, yyyy"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted border border-black/5 rounded-lg p-3">
                        <label className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Guests</label>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                            className="bg-transparent w-full text-sm focus:outline-none text-foreground"
                        />
                    </div>

                    {/* Guest Contact Info */}
                    <div className="bg-muted border border-black/5 rounded-lg p-3">
                        <label className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Full Name</label>
                        <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="bg-transparent w-full text-sm focus:outline-none text-foreground placeholder-muted-foreground"
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div className="bg-muted border border-black/5 rounded-lg p-3">
                        <label className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Email</label>
                        <input
                            type="email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            className="bg-transparent w-full text-sm focus:outline-none text-foreground placeholder-muted-foreground"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                </div>

                <div className="mb-6 space-y-3 text-muted-foreground text-sm">
                    <div className="flex justify-between">
                        <span>${pricePerNight} x {nights} nights</span>
                        <span>${accommodationTotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Cleaning Fee</span>
                        <span>${cleaningFee}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-black/5 font-semibold text-foreground text-base">
                        <span>Total</span>
                        <span>${total}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || nights <= 0}
                    className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors mb-4 transform active:scale-[0.98] duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-md shadow-primary/20"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Confirm Booking"
                    )}
                </button>

                <p className="text-center text-muted-foreground text-sm">
                    You won&apos;t be charged yet
                </p>
            </form>
        </div>
    );
}
