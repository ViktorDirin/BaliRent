"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

interface Settings {
    siteName: string;
    email: string;
    phone: string;
    address: string;
    facebook: string;
    instagram: string;
    cleaningFee: number;
    taxRate: number;
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [settings, setSettings] = useState<Settings>({
        siteName: "BaliRent",
        email: "",
        phone: "",
        address: "",
        facebook: "",
        instagram: "",
        cleaningFee: 0,
        taxRate: 0,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.value) {
                        const parsedSettings = JSON.parse(data.value);
                        // Merge parsed settings with default state to ensure all fields exist
                        setSettings(prev => ({ ...prev, ...parsedSettings }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                throw new Error('Failed to save settings');
            }

            setMessage({ type: 'success', text: 'Settings saved successfully' });
        } catch (error) {
            console.error("Error saving settings:", error);
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your site configuration</p>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                    {message.text}
                </div>
            )}

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

                <h2 className="text-xl font-bold mb-6 mt-8">Financial Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Cleaning Fee (USD)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={settings.cleaningFee}
                            onChange={(e) => setSettings({ ...settings, cleaningFee: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={settings.taxRate}
                            onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
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
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            Save Settings
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
