"use client";

import { useState, useEffect, useMemo } from "react";
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
    bookedDates: string[];
}

export default function BookingForm({ apartmentId, pricePerNight, cleaningFee, bookedDates }: BookingFormProps) {
    // Initialize dates
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Filter booked dates to ensure they are valid Date objects
    const validBookedDates = useMemo(() => {
        return bookedDates.map(d => new Date(d));
    }, [bookedDates]);

    // Set default dates on mount to avoid hydration mismatch
    useEffect(() => {
        // Function to find the next available slot
        const findNextAvailableSlot = () => {
            let attemptStart = new Date();
            attemptStart.setDate(attemptStart.getDate() + 1); // Start from tomorrow

            // Loop to find a start date that isn't booked
            // simple check for next 30 days
            for (let i = 0; i < 30; i++) {
                const isBooked = validBookedDates.some(d =>
                    d.toDateString() === attemptStart.toDateString()
                );

                if (!isBooked) {
                    // Start date found, now check if +3 days is possible
                    const attemptEnd = new Date(attemptStart);
                    attemptEnd.setDate(attemptEnd.getDate() + 3);

                    // Check if any date between start and end is booked
                    let rangeValid = true;
                    let checkDate = new Date(attemptStart);
                    while (checkDate <= attemptEnd) {
                        if (validBookedDates.some(d => d.toDateString() === checkDate.toDateString())) {
                            rangeValid = false;
                            break;
                        }
                        checkDate.setDate(checkDate.getDate() + 1);
                    }

                    if (rangeValid) {
                        setStartDate(attemptStart);
                        setEndDate(attemptEnd);
                        return;
                    }
                }
                attemptStart.setDate(attemptStart.getDate() + 1);
            }

            // Fallback if no slot found easily (just use tomorrow/3 days later and let UI handle conflicts)
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const threeDaysLater = new Date(tomorrow);
            threeDaysLater.setDate(threeDaysLater.getDate() + 3);
            setStartDate(tomorrow);
            setEndDate(threeDaysLater);
        };

        findNextAvailableSlot();

    }, [validBookedDates]);

    const [guests, setGuests] = useState(2);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Guest details needed for the new booking implementation
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");

    // Calculate max date for checkout based on start date and next booking
    const maxDate = useMemo(() => {
        if (!startDate) return null;

        // Find the closest booked date AFTER the start date
        const sortedBookedDates = [...validBookedDates].sort((a, b) => a.getTime() - b.getTime());
        const nextBookedDate = sortedBookedDates.find(date => date > startDate);

        if (nextBookedDate) {
            // The max date should be the day before the next booking
            const max = new Date(nextBookedDate);
            max.setDate(max.getDate() - 1);
            return max;
        }

        return null;
    }, [startDate, validBookedDates]);

    // Calculate nights
    const nights = (startDate && endDate)
        ? Math.max(0, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)))
        : 0;

    const accommodationTotal = pricePerNight * nights;
    const total = accommodationTotal + cleaningFee;

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) return;

        // Validation: Check if selected range overlaps with any booked dates
        // This is a double check in case UI constraints were bypassed
        let checkDate = new Date(startDate);
        while (checkDate <= endDate) {
            if (validBookedDates.some(d => d.toDateString() === checkDate.toDateString())) {
                alert("The selected dates include a booked date. Please select a different range.");
                return;
            }
            checkDate.setDate(checkDate.getDate() + 1);
        }

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
                                    onChange={(date: Date | null) => {
                                        setStartDate(date);
                                        // Reset end date if it becomes invalid (e.g. before start date or inside a booked range)
                                        if (endDate && date && date > endDate) {
                                            setEndDate(null);
                                        }
                                    }}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={new Date()}
                                    excludeDates={validBookedDates}
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
                                    maxDate={maxDate || undefined}
                                    excludeDates={validBookedDates}
                                    placeholderText="Check-out"
                                    locale="en-US"
                                    className="bg-transparent w-full pl-6 text-sm focus:outline-none text-foreground cursor-pointer"
                                    dateFormat="MMM d, yyyy"
                                    required
                                    disabled={!startDate}
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
