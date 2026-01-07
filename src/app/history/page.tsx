"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWorkoutHistory, GroupedWorkout } from "@/lib/history";
import { BodyMetricsSection } from "@/components/BodyMetricsSection";
import { ConsistencyHeatmap } from "@/components/ConsistencyHeatmap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState<GroupedWorkout[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            getWorkoutHistory(user.uid).then((data) => {
                setWorkouts(data);
                setLoading(false);
            });
        }
    }, [user]);

    if (loading) return <div className="p-4 text-white">Loading history...</div>;

    return (
        <div className="bg-gray-950 min-h-screen text-white p-4">
            <header className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold">Workout History</h1>
            </header>

            <div className="space-y-6">
                <BodyMetricsSection />
                <ConsistencyHeatmap workouts={workouts} />

                <div className="space-y-4">
                    {workouts.length === 0 && (
                        <div className="text-center text-gray-500 py-10">
                            No workouts logged yet. Go lift some iron!
                        </div>
                    )}

                    {workouts.map((workout) => (
                        <Card key={workout.workoutId} className="bg-gray-900 border-gray-800">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg text-blue-400">
                                        {format(workout.date, "MMM d, yyyy")}
                                    </CardTitle>
                                    {workout.dayNumber > 0 && (
                                        <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">
                                            Day {workout.dayNumber}
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between text-sm text-gray-300">
                                    <div>Total Sets: {workout.sets}</div>
                                    <div>Volume: {workout.volume.toLocaleString()} lb</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
