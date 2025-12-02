"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function VillasPage() {
    const [villas, setVillas] = useState([]);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Villas</h1>
                    <p className="text-muted-foreground">Manage your property listings</p>
                </div>
                <Link
                    href="/admin/villas/new"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Villa
                </Link>
            </div>

            {villas.length === 0 ? (
                <div className="bg-white dark:bg-neutral-900 p-12 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 text-center">
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No villas yet</h3>
                    <p className="text-muted-foreground mb-6">Get started by adding your first villa</p>
                    <Link
                        href="/admin/villas/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add Villa
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {villas.map((villa: any) => (
                        <div key={villa.id} className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                            <div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-800" />
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2">{villa.title}</h3>
                                <p className="text-muted-foreground text-sm mb-4">{villa.location}</p>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/villas/${villa.id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </Link>
                                    <button className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Building2({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    );
}
