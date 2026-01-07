"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAllowed: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAllowed: false,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        // Set persistence to local
        setPersistence(auth, browserLocalPersistence).catch((error) => {
            console.error("Auth persistence error:", error);
        });

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser && currentUser.email === process.env.NEXT_PUBLIC_ALLOWED_EMAIL) {
                setIsAllowed(true);
            } else {
                setIsAllowed(false);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAllowed, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
