import { Building2, Calendar, DollarSign, Users } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        { label: "Total Villas", value: "0", icon: Building2, color: "text-blue-600" },
        { label: "Active Bookings", value: "0", icon: Calendar, color: "text-green-600" },
        { label: "Revenue (Month)", value: "$0", icon: DollarSign, color: "text-yellow-600" },
        { label: "Customers", value: "0", icon: Users, color: "text-purple-600" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to your admin panel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center justify-between mb-4">
                                <Icon className={`h-8 w-8 ${stat.color}`} />
                            </div>
                            <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <p className="text-muted-foreground">No recent activity to display.</p>
            </div>
        </div>
    );
}
