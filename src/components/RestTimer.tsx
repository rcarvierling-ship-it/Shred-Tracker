"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, X } from "lucide-react";

interface RestTimerProps {
    initialSeconds?: number;
    autoStart?: boolean;
}

export function RestTimer({ initialSeconds = 75, autoStart = false }: RestTimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(autoStart);
    const [duration, setDuration] = useState(initialSeconds);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Could play a sound here
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    useEffect(() => {
        if (autoStart) {
            setTimeLeft(initialSeconds);
            setIsActive(true);
        }
    }, [autoStart, initialSeconds]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(duration);
    };

    const handleDurationChange = (value: number[]) => {
        setDuration(value[0]);
        if (!isActive) {
            setTimeLeft(value[0]);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // If timer is not active and reset, maybe hide it or show minimal?
    // User req: "Rest timer that starts automatically when a set is logged"
    // We'll keep it always visible but minimal when incomplete? Or just floating bottom right.

    if (isMinimized) {
        return (
            <Button
                className="fixed bottom-20 right-4 rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 z-50 shadow-lg"
                onClick={() => setIsMinimized(false)}
            >
                {formatTime(timeLeft)}
            </Button>
        )
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800 z-50 shadow-xl">
            <div className="flex flex-col gap-2 max-w-md mx-auto">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-400">Rest Timer</h3>
                    <div className="text-3xl font-bold font-mono text-blue-400">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => setIsMinimized(true)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <Slider
                            value={[duration]}
                            min={30}
                            max={180}
                            step={15}
                            onValueChange={handleDurationChange}
                            className="cursor-pointer"
                        />
                        <div className="text-xs text-center text-gray-500 mt-1">{duration}s target</div>
                    </div>
                </div>

                <div className="flex gap-2 justify-center">
                    <Button
                        variant={isActive ? "secondary" : "default"}
                        size="lg"
                        className="w-full"
                        onClick={toggleTimer}
                    >
                        {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                        {isActive ? "Pause" : "Start"}
                    </Button>
                    <Button variant="outline" size="lg" onClick={resetTimer}>
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
