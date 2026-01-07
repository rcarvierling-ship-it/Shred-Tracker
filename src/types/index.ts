export type MachineType = string;
export type DayName = "PUSH" | "PULL" | "LEGS" | "UPPER" | "FULL BODY";

// Exercise Template (what's in the DB)
export interface Exercise {
    id?: string;
    name: string;
    dayNumber: number; // 1-5
    machineType: MachineType;
    startingWeight: number; // in lbs
    targetSets: number;
    repRange: [number, number]; // [min, max]
    order: number;
    notes?: string;
}

// User Profile
export interface UserProfile {
    uid: string;
    email: string;
    preferences: {
        defaultRestTimer: number;
        smithSquat: boolean;
    };
}

// Active Workout & History
export interface Workout {
    id?: string;
    uid: string;
    date: Date | any; // Firestore Timestamp
    dayNumber: number;
    dayName: string;
    status: "in-progress" | "completed";
    durationSeconds?: number;
    notes?: string;
}

// Logged Set
export interface WorkoutSet {
    id?: string;
    workoutId: string;
    exerciseId: string;
    exerciseName: string;
    setNumber: number;
    weight: number;
    reps: number;
    rpe?: number; // Rate of Perceived Exertion (1-10)
    completedAt: Date | any;
}
