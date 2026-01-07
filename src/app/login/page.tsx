"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { user, isAllowed } = useAuth();

    // If already logged in and allowed, redirect to home
    if (user && isAllowed) {
        router.push("/");
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            setError("Failed to login. Please check your credentials.");
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
            <Card className="w-full max-w-sm bg-gray-900 border-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-white">Shred Tracker</CardTitle>
                    <CardDescription className="text-center text-gray-400">
                        Enter your credentials to access the shred.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
