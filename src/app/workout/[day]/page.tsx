"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Exercise, WorkoutSet } from "@/types";
import { getExercisesForDay, logSet, getNextWeightSuggestion, getPersonalRecord } from "@/lib/workout";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, TrendingUp, ChevronDown } from "lucide-react";
import { RestTimer } from "@/components/RestTimer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExerciseProgressChart } from "@/components/ExerciseProgressChart";
import { CoachingBadge } from "@/components/CoachingBadge";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WorkoutPage() {
    const params = useParams();
    const dayNumber = Number(params.day);
    const { user } = useAuth();
    const router = useRouter();

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [workoutId, setWorkoutId] = useState("");
    const [triggerTimer, setTriggerTimer] = useState(0);
    const [inputs, setInputs] = useState<Record<string, { weight: string, reps: string, rpe: string }>>({});
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
    const [loggedSets, setLoggedSets] = useState<Record<string, number>>({});
    const [suggestions, setSuggestions] = useState<Record<string, number | null>>({});

    useEffect(() => {
        if (dayNumber && user) {
            getExercisesForDay(dayNumber).then(async (data) => {
                setExercises(data);
                const initialInputs: any = {};
                const newSuggestions: any = {};

                for (const ex of data) {
                    initialInputs[ex.id as string] = {
                        weight: ex.startingWeight.toString(),
                        reps: "",
                        rpe: "8"
                    };
                    // Fetch suggestion
                    const suggestion = await getNextWeightSuggestion(user.uid, ex.id!, ex.targetSets, ex.repRange);
                    newSuggestions[ex.id!] = suggestion;
                    if (suggestion) {
                        initialInputs[ex.id!].weight = suggestion.toString();
                    }
                }

                setInputs(initialInputs);
                setSuggestions(newSuggestions);
                setLoading(false);
                setWorkoutId(`workout_${format(new Date(), "yyyyMMdd")}_${dayNumber}`);
                if (data.length > 0) setExpandedExercise(data[0].id!);
            });
        }
    }, [dayNumber, user]);

    const handleLogSet = async (exerciseId: string, exerciseName: string) => {
        if (!user) return;
        const input = inputs[exerciseId];
        if (!input.reps) return;

        const weight = Number(input.weight);
        const reps = Number(input.reps);

        const set: Partial<WorkoutSet> = {
            exerciseId,
            exerciseName,
            weight,
            reps,
            rpe: Number(input.rpe),
            setNumber: (loggedSets[exerciseId] || 0) + 1,
        };

        try {
            // Check for PR before logging
            const pr = await getPersonalRecord(user.uid, exerciseId);

            await logSet(user.uid, workoutId, set);
            setTriggerTimer(Date.now());

            // PR Logic
            if (!pr || weight > pr.weight) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                toast.success(`🏆 New PR: ${weight} lbs!`, {
                    description: "You're getting stronger! Keep it up!",
                    duration: 4000
                });
            } else {
                toast.success("Set logged", { duration: 1500 });
            }

            setLoggedSets(prev => ({ ...prev, [exerciseId]: (prev[exerciseId] || 0) + 1 }));
            updateInput(exerciseId, "reps", "");

        } catch (error) {
            console.error("Error logging set:", error);
            toast.error("Failed to log set");
        }
    };

    const updateInput = (exerciseId: string, field: string, value: string) => {
        setInputs(prev => ({
            ...prev,
            [exerciseId]: { ...prev[exerciseId], [field]: value }
        }));
    };

    const adjustWeight = (exerciseId: string, delta: number) => {
        const current = Number(inputs[exerciseId].weight);
        updateInput(exerciseId, "weight", (current + delta).toString());
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 w-32 bg-gray-800 rounded mb-4"></div>
                <div className="space-y-3 w-72">
                    <div className="h-12 bg-gray-800 rounded"></div>
                    <div className="h-12 bg-gray-800 rounded"></div>
                    <div className="h-12 bg-gray-800 rounded"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-950 min-h-screen text-white pb-32">
            <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800 p-4 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-800">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="font-bold text-lg tracking-wide">Day {dayNumber} Session</h1>
                <div className="w-9"></div>
            </header>

            <motion.main className="p-4 space-y-4">
                {exercises.map((exercise) => {
                    const isExpanded = expandedExercise === exercise.id;
                    const setsDone = loggedSets[exercise.id!] || 0;
                    const progress = Math.min((setsDone / exercise.targetSets) * 100, 100);

                    return (
                        <motion.div key={exercise.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card
                                className={cn(
                                    "bg-gray-900 border-gray-800 overflow-hidden transition-all duration-300",
                                    isExpanded ? "ring-1 ring-blue-500/50 shadow-lg shadow-blue-900/10" : "opacity-90"
                                )}
                            >
                                <div
                                    className="p-4 flex flex-col gap-2 cursor-pointer"
                                    onClick={() => setExpandedExercise(isExpanded ? null : exercise.id!)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-white leading-tight">{exercise.name}</h3>
                                                {setsDone >= exercise.targetSets && (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400 font-medium">
                                                {setsDone} / {exercise.targetSets} sets • {exercise.repRange[0]}-{exercise.repRange[1]} reps
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-400">
                                                            <TrendingUp className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-gray-900 border-gray-800 text-white w-[90%] rounded-xl">
                                                        <DialogHeader>
                                                            <DialogTitle>{exercise.name}</DialogTitle>
                                                        </DialogHeader>
                                                        <ExerciseProgressChart exerciseId={exercise.id!} exerciseName={exercise.name} />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <ChevronDown className={cn("w-5 h-5 text-gray-500 transition-transform", isExpanded && "rotate-180")} />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end mt-1">
                                        <CoachingBadge suggestion={suggestions[exercise.id!]} />
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-1 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-blue-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden bg-gray-900/50"
                                        >
                                            <CardContent className="pt-0 pb-4 px-4">
                                                <div className="flex flex-col gap-4">
                                                    <div className="grid grid-cols-12 gap-3 items-end">
                                                        <div className="col-span-4">
                                                            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1 block pl-1">Weight</label>
                                                            <Input
                                                                type="number"
                                                                value={inputs[exercise.id!]?.weight}
                                                                onChange={(e) => updateInput(exercise.id!, "weight", e.target.value)}
                                                                className="bg-gray-800 border-gray-700 text-white text-center text-lg h-12 rounded-xl focus:ring-blue-500/50"
                                                            />
                                                        </div>

                                                        <div className="col-span-4">
                                                            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1 block pl-1">Reps</label>
                                                            <Input
                                                                type="number"
                                                                placeholder="0"
                                                                value={inputs[exercise.id!]?.reps}
                                                                onChange={(e) => updateInput(exercise.id!, "reps", e.target.value)}
                                                                className="bg-gray-800 border-gray-700 text-white text-center text-lg h-12 rounded-xl focus:ring-blue-500/50"
                                                            />
                                                        </div>

                                                        <div className="col-span-4">
                                                            <Button
                                                                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all active:scale-95"
                                                                onClick={() => handleLogSet(exercise.id!, exercise.name)}
                                                            >
                                                                LOG
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between bg-gray-800/50 p-2 rounded-lg">
                                                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400 hover:text-white" onClick={() => adjustWeight(exercise.id!, -5)}>-5</Button>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm" className="h-7 text-xs px-3 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700" onClick={() => adjustWeight(exercise.id!, 2.5)}>+2.5</Button>
                                                            <Button variant="outline" size="sm" className="h-7 text-xs px-3 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700" onClick={() => adjustWeight(exercise.id!, 5)}>+5</Button>
                                                            <Button variant="outline" size="sm" className="h-7 text-xs px-3 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700" onClick={() => adjustWeight(exercise.id!, 10)}>+10</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.main>

            <AnimatePresence>
                {triggerTimer > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-20 left-0 right-0 z-40 px-4 pointer-events-none"
                    >
                        <div className="pointer-events-auto">
                            <RestTimer key={triggerTimer} autoStart={true} initialSeconds={75} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
