"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BodyMetric, getBodyWeightHistory, logBodyWeight } from "@/lib/body-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Scale } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { format } from "date-fns";

export function BodyMetricsSection() {
    const { user } = useAuth();
    const [weight, setWeight] = useState("");
    const [history, setHistory] = useState<BodyMetric[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (user) {
            const data = await getBodyWeightHistory(user.uid);
            setHistory(data);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleLog = async () => {
        if (!user || !weight) return;
        await logBodyWeight(user.uid, Number(weight));
        setWeight("");
        fetchData(); // Refresh chart
    };

    const latestWeight = history.length > 0 ? history[history.length - 1].weight : "--";

    return (
        <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 p-2 rounded-full">
                        <Scale className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <CardTitle className="text-lg text-white">Body Weight</CardTitle>
                        <p className="text-sm text-gray-400">Current: <span className="text-white font-bold">{latestWeight} lbs</span></p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Input Area */}
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="Enter weight (lbs)..."
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Button onClick={handleLog} className="bg-blue-600 hover:bg-blue-500">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Chart Area */}
                <div className="h-64 w-full">
                    {history.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    fontSize={12}
                                    tickFormatter={(d) => format(d, "MMM d")}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    fontSize={12}
                                    domain={['dataMin - 5', 'dataMax + 5']}
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                                    labelFormatter={(d) => format(d, "MMM d, yyyy")}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#3b82f6" }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                            No data yet. Log your first weigh-in!
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
