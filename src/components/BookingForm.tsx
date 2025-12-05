"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, User, ChevronDown } from 'lucide-react';

interface BookingFormProps {
    pricePerNight: number;
    serviceFee: number;
}

export default function BookingForm({ pricePerNight, serviceFee }: BookingFormProps) {
    const [checkInDate, setCheckInDate] = useState<string>('');
    const [checkOutDate, setCheckOutDate] = useState<string>('');
    const [guests, setGuests] = useState<number>(1);
    const [settings, setSettings] = useState({ cleaningFee: 0, taxRate: 0 });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.value) {
                        const parsedSettings = JSON.parse(data.value);
                        setSettings({
                            cleaningFee: parsedSettings.cleaningFee || 0,
                            taxRate: parsedSettings.taxRate || 0
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            }
        };

        fetchSettings();
    }, []);

    // Calculate number of nights between two dates
    const calculateNights = (start: string, end: string): number => {
        if (!start || !end) return 0;

        const startDate = new Date(start);
        const endDate = new Date(end);

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;

        // Calculate difference in milliseconds
        const diffTime = endDate.getTime() - startDate.getTime();

        // Convert to days (1000ms * 60s * 60m * 24h)
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 0;
    };

    const numberOfNights = calculateNights(checkInDate, checkOutDate);
    const subtotal = pricePerNight * numberOfNights;
    const taxAmount = (subtotal * settings.taxRate) / 100;
    const totalPrice = numberOfNights > 0 ? subtotal + serviceFee + settings.cleaningFee + taxAmount : 0;

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Check Availability Clicked", {
            checkInDate,
            checkOutDate,
            guests,
            totalPrice,
            numberOfNights,
            breakdown: {
                subtotal,
                serviceFee,
                cleaningFee: settings.cleaningFee,
                taxAmount
            }
        });
    };

    return (
        <form
            onSubmit={handleBookingSubmit}
            className="bg-background border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-6 sticky top-24"
        >
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-serif font-bold text-foreground">${pricePerNight}</span>
                    <span className="text-muted-foreground">/ night</span>
                </div>
            </div>

            {/* Booking Inputs */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg mb-4 overflow-hidden">
                {/* Dates Section */}
                <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                    <div className="w-1/2 p-3 border-r border-neutral-200 dark:border-neutral-800 hover:bg-muted/50 transition-colors cursor-pointer relative">
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                            Check-In
                        </label>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 absolute left-3 bottom-3.5 pointer-events-none" />
                            <input
                                type="date"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                                className="w-full bg-transparent text-sm pl-6 focus:outline-none cursor-pointer"
                                placeholder="Add date"
                            />
                        </div>
                    </div>
                    <div className="w-1/2 p-3 hover:bg-muted/50 transition-colors cursor-pointer relative">
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                            Check-Out
                        </label>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 absolute left-3 bottom-3.5 pointer-events-none" />
                            <input
                                type="date"
                                value={checkOutDate}
                                min={checkInDate}
                                onChange={(e) => setCheckOutDate(e.target.value)}
                                className="w-full bg-transparent text-sm pl-6 focus:outline-none cursor-pointer"
                                placeholder="Add date"
                            />
                        </div>
                    </div>
                </div>

                {/* Guests Section */}
                <div className="p-3 hover:bg-muted/50 transition-colors cursor-pointer relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                        Guests
                    </label>
                    <div className="flex items-center justify-between text-foreground">
                        <div className="flex items-center gap-2 w-full">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <input
                                type="number"
                                min="1"
                                value={guests}
                                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                                className="w-full bg-transparent text-sm focus:outline-none"
                            />
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-medium hover:opacity-90 transition-opacity mb-6"
            >
                Check Availability
            </button>

            {/* Price Breakdown */}
            {numberOfNights > 0 && totalPrice > 0 && (
                <div className="space-y-3 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between">
                        <span className="underline decoration-dotted underline-offset-2">
                            ${pricePerNight} x {numberOfNights} nights
                        </span>
                        <span className="text-foreground">${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="underline decoration-dotted underline-offset-2">
                            Service fee
                        </span>
                        <span className="text-foreground">${serviceFee}</span>
                    </div>
                    {settings.cleaningFee > 0 && (
                        <div className="flex justify-between">
                            <span className="underline decoration-dotted underline-offset-2">
                                Cleaning fee
                            </span>
                            <span className="text-foreground">${settings.cleaningFee}</span>
                        </div>
                    )}
                    {settings.taxRate > 0 && (
                        <div className="flex justify-between">
                            <span className="underline decoration-dotted underline-offset-2">
                                Tax ({settings.taxRate}%)
                            </span>
                            <span className="text-foreground">${taxAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-4 flex justify-between font-bold text-foreground text-base">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </form>
    );
}
