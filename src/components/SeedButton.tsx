"use client";

import { useState } from "react";
import { seedApartments } from "@/lib/actions";
import { Loader2, Database } from "lucide-react";

export default function SeedButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSeed = async () => {
        if (!confirm("This will add 5 test apartments to the database. Continue?")) return;

        setIsLoading(true);
        try {
            await seedApartments();
            alert("Test data seeded successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to seed data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSeed}
            disabled={isLoading}
            className="flex items-center gap-2 bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-neutral-700 hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Seed Test Data
        </button>
    );
}
