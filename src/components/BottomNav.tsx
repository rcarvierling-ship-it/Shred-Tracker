"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, History as HistoryIcon, User, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();

    // Don't show on login page
    if (pathname === "/login") return null;

    const navItems = [
        { label: "Home", icon: Home, path: "/" },
        { label: "History", icon: HistoryIcon, path: "/history" },
        { label: "Settings", icon: User, path: "/settings" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-lg border-t border-gray-800 pb-safe pt-2 z-40">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.path)}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                isActive ? "text-blue-500" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive && "fill-current/20")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
