"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getWorkoutHistory } from "@/lib/history";

export default function SettingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [restTimer, setRestTimer] = useState(75);
    const [smithSquat, setSmithSquat] = useState(false);

    const handleExport = async () => {
        if (!user) return;
        const history = await getWorkoutHistory(user.uid);
        if (!history.length) return alert("No data to export.");

        const csvContent = "data:text/csv;charset=utf-8,"
            + "Date,WorkoutID,Sets,Volume\n"
            + history.map(h => `${h.date.toISOString()},${h.workoutId},${h.sets},${h.volume}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "shred_tracker_data.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="bg-gray-950 min-h-screen text-white p-4">
            <header className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold">Settings</h1>
            </header>

            <div className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-gray-400">Allowed Email</Label>
                            <Input disabled value={user?.email || ""} className="bg-gray-800 border-gray-700 mt-1" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="smith-squat" className="text-white">Smith Machine Squat</Label>
                            <Switch
                                id="smith-squat"
                                checked={smithSquat}
                                onCheckedChange={setSmithSquat}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Default Rest Timer (sec)</Label>
                            <Input
                                type="number"
                                value={restTimer}
                                onChange={(e) => setRestTimer(Number(e.target.value))}
                                className="bg-gray-800 border-gray-700"
                            />
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            <Save className="w-4 h-4 mr-2" /> Save Preferences
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" onClick={handleExport}>
                            Export Data to CSV
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
