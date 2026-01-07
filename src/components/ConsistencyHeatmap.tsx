"use client";


import { GroupedWorkout } from "@/lib/history";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { eachDayOfInterval, subDays, format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface ConsistencyHeatmapProps {
    workouts: GroupedWorkout[];
}

export function ConsistencyHeatmap({ workouts }: ConsistencyHeatmapProps) {
    const workoutDates = workouts.map(h => h.date);

    // Generate last 365 days
    const today = new Date();
    const startDate = subDays(today, 364); // 52 weeks
    const days = eachDayOfInterval({ start: startDate, end: today });

    const getIntensity = (date: Date) => {
        const count = workoutDates.filter(d => isSameDay(d, date)).length;
        if (count === 0) return "bg-gray-800";
        if (count === 1) return "bg-blue-900";
        return "bg-blue-500";
    };

    return (
        <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
                <CardTitle className="text-lg text-white">Consistency</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-1 justify-center">
                    {days.map((day, i) => (
                        <TooltipProvider key={i}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div
                                        className={cn(
                                            "w-3 h-3 rounded-sm transition-colors",
                                            getIntensity(day)
                                        )}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-800 text-white border-gray-700">
                                    <p>{format(day, "MMM d, yyyy")}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
