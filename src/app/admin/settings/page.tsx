"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        siteName: "BaliRent",
        email: "info@manggalabali.com",
        phone: "+62 812 3456 7890",
        address: "Kutuh kelod, Jl. Tirta Tawar No.23, Petulu, Kec. Ubud, Gianyar, Bali 80571",
        facebook: "",
        instagram: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement API call to save settings
        console.log("Saving settings:", settings);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your site configuration</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800">
                <h2 className="text-xl font-bold mb-6">General Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Site Name</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                            type="tel"
                            value={settings.phone}
                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Address</label>
                        <input
                            type="text"
                            value={settings.address}
                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                        />
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-6 mt-8">Social Media</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Facebook URL</label>
                        <input
                            type="url"
                            value={settings.facebook}
                            onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                            placeholder="https://facebook.com/yourpage"
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Instagram URL</label>
                        <input
                            type="url"
                            value={settings.instagram}
                            onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                            placeholder="https://instagram.com/yourpage"
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Save className="h-5 w-5" />
                    Save Settings
                </button>
            </form>
        </div>
    );
}
