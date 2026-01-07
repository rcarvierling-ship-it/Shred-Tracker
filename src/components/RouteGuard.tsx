"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const { user, loading, isAllowed } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            // If not logged in and not on login page, redirect to login
            if (!user && pathname !== "/login") {
                router.push("/login");
            }

            // If logged in but not allowed (wrong email), show access denied or redirect
            // For now, let's just redirect to login if not allowed, or handle it in UI
            // But per requirements: "If logged in with any other email: show 'Access denied'"
        }
    }, [user, loading, isAllowed, pathname, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950 text-white">
                Loading...
            </div>
        );
    }

    // If logged in but not allowed
    if (user && !isAllowed && pathname !== "/login") {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-950 text-white gap-4">
                <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
                <p>You are logged in as {user.email}, but you are not authorized to use this app.</p>
                <button
                    onClick={() => import("@/context/AuthContext").then(mod => mod.useAuth().logout())}
                    className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
                >
                    Logout
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
