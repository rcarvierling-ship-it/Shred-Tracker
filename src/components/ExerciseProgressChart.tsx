"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getExerciseHistory } from "@/lib/history";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExerciseProgressChartProps {
    exerciseId: string;
    exerciseName: string;
}

export function ExerciseProgressChart({ exerciseId, exerciseName }: ExerciseProgressChartProps) {
    const { user } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && exerciseId) {
            getExerciseHistory(user.uid, exerciseId).then((history) => {
                // Process history to find max weight per workout date or just all sets?
                // Visualizing every set might be noisy. Let's pick the max weight for each day.

                const dayMap: Record<string, number> = {};

                history.forEach(set => {
                    const dateKey = format(set.completedAt.toDate(), "MM/dd");
                    if (!dayMap[dateKey] || set.weight > dayMap[dateKey]) {
                        dayMap[dateKey] = set.weight;
                    }
                });

                const chartData = Object.entries(dayMap).map(([date, weight]) => ({
                    date,
                    weight
                }));

                setData(chartData);
                setLoading(false);
            });
        }
    }, [user, exerciseId]);

    if (loading) return <div className="text-white text-sm">Loading stats...</div>;
    if (data.length === 0) return <div className="text-gray-500 text-sm">No history yet.</div>;

    return (
        <Card className="bg-gray-900 border-none shadow-none">
            <CardHeader className="p-0 pb-4">
                <CardTitle className="text-sm font-medium text-gray-400">Progression ({exerciseName})</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis
                            dataKey="date"
                            stroke="#666"
                            fontSize={12}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#666"
                            fontSize={12}
                            tickLine={false}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                            itemStyle={{ color: '#60a5fa' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
