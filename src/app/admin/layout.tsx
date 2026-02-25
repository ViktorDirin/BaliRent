"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import { Menu } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
            {/* Sidebar (handles its own fixed positioning + overlay) */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content — lg:pl-64 offsets for the fixed 256px sidebar */}
            <div className="min-w-0 max-w-full lg:pl-64">
                {/* Mobile top bar with burger button */}
                <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-neutral-900 text-white sticky top-0 z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Open sidebar"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <span className="text-lg font-serif font-bold text-primary">Admin Panel</span>
                </header>

                {/* Page content */}
                <main className="px-3 py-4 sm:px-6 lg:px-8 lg:py-8 min-w-0 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
