"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroScrollArrow() {
    return (
        <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 cursor-pointer select-none"
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
            aria-label="Scroll down"
        >
            <span
                className="text-xs uppercase tracking-[0.2em] font-medium"
                style={{ color: "rgba(255,255,255,0.65)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
            >
                Scroll
            </span>
            <ChevronDown
                className="w-6 h-6"
                style={{ color: "rgba(197,160,89,0.85)", filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.5))" }}
            />
        </motion.div>
    );
}
