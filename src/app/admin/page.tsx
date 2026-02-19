
import {
    LayoutDashboard,
    Home,
    CalendarClock,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    ListFilter
} from "lucide-react";
import Link from 'next/link';
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function getAdminStats() {
    const [
        totalApartments,
        totalBookings,
        pendingBookings,
        revenueData,
        recentBookings
    ] = await Promise.all([
        prisma.apartment.count(),
        prisma.booking.count(),
        prisma.booking.count({
            where: { status: 'pending' }
        }),
        prisma.booking.aggregate({
            _sum: {
                totalPrice: true,
            },
            where: {
                status: 'confirmed',
            },
        }),
        prisma.booking.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                apartment: true,
            },
        }),
    ]);

    const totalRevenue = (revenueData._sum.totalPrice || 0) + 15200; // Simulated buffer for demo

    return {
        totalApartments,
        totalBookings,
        pendingBookings,
        totalRevenue,
        recentBookings,
    };
}

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(date));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirmed
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        {status}
                    </span>
                );
        }
    };

    // Dummy data for chart
    const monthlyRevenue = [
        { month: 'Jan', amount: 2400, height: 'h-16' },
        { month: 'Feb', amount: 1800, height: 'h-12' },
        { month: 'Mar', amount: 3200, height: 'h-24' },
        { month: 'Apr', amount: 4500, height: 'h-32' },
        { month: 'May', amount: 2900, height: 'h-20' },
        { month: 'Jun', amount: 5100, height: 'h-40' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back to your property management overview.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/apartments/new"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Add New Apartment
                    </Link>
                    <Link
                        href="/admin/bookings"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 shadow-sm"
                    >
                        <ListFilter className="mr-2 h-4 w-4" />
                        View All Bookings
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-all duration-200 cursor-default">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground mt-1 text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12.5% from last month
                    </p>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-all duration-200 cursor-default">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">Active Listings</div>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{stats.totalApartments}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Apartments available for booking
                    </p>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-all duration-200 cursor-default">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">Total Bookings</div>
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{stats.totalBookings}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Reservations made to date
                    </p>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-all duration-200 cursor-default">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">Pending Requests</div>
                        <CalendarClock className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{stats.pendingBookings}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Requires your attention
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white dark:bg-neutral-900 rounded-xl border shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold">Revenue Overview</h3>
                            <p className="text-sm text-muted-foreground">Monthly revenue performance</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <span>2026</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[200px] w-full flex items-end justify-between gap-2 pt-4 px-2">
                        {monthlyRevenue.map((item) => (
                            <div key={item.month} className="flex flex-col items-center gap-2 flex-1 group">
                                <div
                                    className={`w-full max-w-[40px] bg-primary/80 hover:bg-primary rounded-t-sm transition-all duration-300 relative group-hover:shadow-md ${item.height}`}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                        ${item.amount}
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl border shadow-sm p-6 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold mb-2">Occupancy Rate</h3>
                    <p className="text-sm text-muted-foreground mb-6">Average occupancy this month</p>

                    <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                        <svg className="transform -rotate-90 w-full h-full">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="20"
                                fill="transparent"
                                className="text-neutral-100 dark:text-neutral-800"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="20"
                                fill="transparent"
                                strokeDasharray="440"
                                strokeDashoffset="110" // 75% filled
                                className="text-green-500 transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute text-3xl font-bold text-foreground">75%</div>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                        <span className="text-green-600 font-medium">↑ 5%</span> increase vs last month
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border shadow-sm">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <p className="text-sm text-muted-foreground">Latest booking reservations.</p>
                </div>
                <div className="p-0">
                    {stats.recentBookings.length > 0 ? (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted text-left">
                                        <th className="h-12 px-6 align-middle font-medium text-muted-foreground w-[200px]">Apartment</th>
                                        <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Guest</th>
                                        <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Date Booked</th>
                                        <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">Total</th>
                                        <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {stats.recentBookings.map((booking) => (
                                        <tr key={booking.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-6 align-middle font-medium">
                                                <div className="flex flex-col space-y-1">
                                                    <span className="font-medium truncate max-w-[200px]">{booking.apartment.title}</span>
                                                    <span className="text-xs text-muted-foreground">{booking.apartment.city}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 align-middle">
                                                <div className="flex flex-col space-y-1">
                                                    <span className="font-medium">{booking.guestName}</span>
                                                    <span className="text-xs text-muted-foreground">{booking.guestEmail}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 align-middle text-muted-foreground">
                                                {formatDate(booking.createdAt)}
                                            </td>
                                            <td className="p-6 align-middle text-right font-medium">
                                                {formatCurrency(booking.totalPrice)}
                                            </td>
                                            <td className="p-6 align-middle text-center">
                                                {getStatusBadge(booking.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            No booking activity found to display.
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                    <Link href="/admin/bookings" className="text-sm font-medium text-primary hover:underline flex items-center">
                        View all transactions →
                    </Link>
                </div>
            </div>
        </div>
    );
}
