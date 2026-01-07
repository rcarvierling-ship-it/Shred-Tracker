import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { WorkoutSet } from "@/types";

export interface GroupedWorkout {
    workoutId: string;
    date: Date;
    dayNumber: number; // We might need to encode this in ID or fetch it
    sets: number;
    volume: number;
}

export async function getWorkoutHistory(uid: string): Promise<GroupedWorkout[]> {
    const q = query(
        collection(db, "workout_sets"),
        where("uid", "==", uid),
        orderBy("completedAt", "desc"),
        limit(500) // Safety limit
    );

    const snapshot = await getDocs(q);
    const sets = snapshot.docs.map(doc => doc.data() as WorkoutSet);

    // Group by workoutId
    const groups: Record<string, GroupedWorkout> = {};

    sets.forEach(set => {
        if (!groups[set.workoutId]) {
            groups[set.workoutId] = {
                workoutId: set.workoutId,
                date: set.completedAt.toDate(),
                dayNumber: 0, // Pending...
                sets: 0,
                volume: 0
            };

            // Try to extract day number from ID if we used the convention workout_YYYYMMDD_DAY
            try {
                const parts = set.workoutId.split('_');
                if (parts.length >= 3) {
                    groups[set.workoutId].dayNumber = parseInt(parts[2]);
                }
            } catch (e) {
                // Ignore
            }
        }

        groups[set.workoutId].sets += 1;
        groups[set.workoutId].volume += (set.weight * set.reps);
    });

    return Object.values(groups).sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getExerciseHistory(uid: string, exerciseId: string) {
    const q = query(
        collection(db, "workout_sets"),
        where("uid", "==", uid),
        where("exerciseId", "==", exerciseId),
        orderBy("completedAt", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as WorkoutSet));
}
