"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { updateSettings, getSettings } from "@/lib/actions";

export const dynamic = 'force-dynamic';

interface Settings {
    siteName: string;
    email: string;
    phone: string;
    address: string;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
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
        facebook_url: "",
        instagram_url: "",
        twitter_url: "",
        cleaningFee: 0,
        taxRate: 0,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                console.log("Fetched Settings:", data);

                let loadedSettings: Partial<Settings> = {};

                // Legacy support: extract from 'general' JSON if it exists
                if (data.general) {
                    try {
                        const general = JSON.parse(data.general);
                        loadedSettings = {
                            siteName: general.siteName,
                            email: general.email,
                            phone: general.phone,
                            address: general.address,
                            facebook_url: general.facebook, // Map legacy key
                            instagram_url: general.instagram, // Map legacy key
                            cleaningFee: general.cleaningFee,
                            taxRate: general.taxRate
                        };
                    } catch (e) {
                        console.error("Error parsing legacy settings:", e);
                    }
                }

                // Override with new individual keys if they exist
                if (data.siteName) loadedSettings.siteName = data.siteName;
                if (data.email) loadedSettings.email = data.email;
                if (data.phone) loadedSettings.phone = data.phone;
                if (data.address) loadedSettings.address = data.address;
                if (data.facebook_url) loadedSettings.facebook_url = data.facebook_url;
                if (data.instagram_url) loadedSettings.instagram_url = data.instagram_url;
                if (data.twitter_url) loadedSettings.twitter_url = data.twitter_url;
                if (data.cleaningFee) loadedSettings.cleaningFee = Number(data.cleaningFee);
                if (data.taxRate) loadedSettings.taxRate = Number(data.taxRate);

                setSettings(prev => ({ ...prev, ...loadedSettings }));
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
            // We pass the settings object directly. The server action will handle upserting each key.
            await updateSettings(settings);

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
                            value={settings.cleaningFee === 0 ? "" : settings.cleaningFee}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSettings({ ...settings, cleaningFee: val === "" ? 0 : parseFloat(val) });
                            }}
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={settings.taxRate === 0 ? "" : settings.taxRate}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSettings({ ...settings, taxRate: val === "" ? 0 : parseFloat(val) });
                            }}
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                            placeholder="0"
                            title="Value must be less than or equal to 100"
                        />
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-6 mt-8">Social Media</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Facebook URL</label>
                        <input
                            type="url"
                            value={settings.facebook_url}
                            onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                            placeholder="https://facebook.com/yourpage"
                            pattern="https?://.*"
                            title="Must be a valid URL starting with http:// or https://"
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Instagram URL</label>
                        <input
                            type="url"
                            value={settings.instagram_url}
                            onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                            placeholder="https://instagram.com/yourpage"
                            pattern="https?://.*"
                            title="Must be a valid URL starting with http:// or https://"
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">X (Twitter) URL</label>
                        <input
                            type="url"
                            value={settings.twitter_url}
                            onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                            placeholder="https://x.com/yourpage"
                            pattern="https?://.*"
                            title="Must be a valid URL starting with http:// or https://"
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
