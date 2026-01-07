import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, addDoc, Timestamp, limit } from "firebase/firestore";
import { Exercise, WorkoutSet } from "@/types";


export async function getExercisesForDay(dayNumber: number): Promise<Exercise[]> {
    const q = query(
        collection(db, "exercises"),
        where("dayNumber", "==", dayNumber),
        orderBy("order", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));
}

export async function logSet(uid: string, workoutId: string, set: Partial<WorkoutSet>) {
    const setRef = await addDoc(collection(db, "workout_sets"), {
        uid,
        workoutId,
        ...set,
        completedAt: Timestamp.now()
    });
    return setRef.id;
}

export async function getPersonalRecord(uid: string, exerciseId: string) {
    const q = query(
        collection(db, "workout_sets"),
        where("uid", "==", uid),
        where("exerciseId", "==", exerciseId),
        orderBy("weight", "desc"),
        limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as WorkoutSet;
}

export async function getLastSessionStats(uid: string, exerciseId: string) {
    const q = query(
        collection(db, "workout_sets"),
        where("uid", "==", uid),
        where("exerciseId", "==", exerciseId),
        orderBy("completedAt", "desc"),
        limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as WorkoutSet;
}

export async function getNextWeightSuggestion(uid: string, exerciseId: string, targetSets: number, repRange: [number, number]): Promise<number | null> {
    const lastSet = await getLastSessionStats(uid, exerciseId);
    if (!lastSet) return null;

    if (lastSet.reps >= repRange[1] && (lastSet.rpe || 10) < 9) {
        return lastSet.weight + 5;
    }

    return lastSet.weight;
}
