import { db } from "./firebase";
import { collection, doc, writeBatch, getDocs, query } from "firebase/firestore";
import { Exercise } from "@/types";

const EXERCISES: Omit<Exercise, "id">[] = [
    // Day 1 - PUSH
    { dayNumber: 1, order: 1, name: "Chest Press Machine", machineType: "Machine", startingWeight: 130, targetSets: 4, repRange: [8, 12] },
    { dayNumber: 1, order: 2, name: "Incline Chest Press", machineType: "Machine", startingWeight: 110, targetSets: 3, repRange: [10, 12] },
    { dayNumber: 1, order: 3, name: "Pec Deck (Chest)", machineType: "Machine", startingWeight: 120, targetSets: 3, repRange: [12, 15] },
    { dayNumber: 1, order: 4, name: "Shoulder Press Machine", machineType: "Machine", startingWeight: 80, targetSets: 3, repRange: [8, 12] },
    { dayNumber: 1, order: 5, name: "Lateral Raise Machine", machineType: "Machine", startingWeight: 80, targetSets: 4, repRange: [12, 20] },
    { dayNumber: 1, order: 6, name: "Triceps Pushdown (Cable)", machineType: "Cable", startingWeight: 70, targetSets: 3, repRange: [10, 15] },
    { dayNumber: 1, order: 7, name: "Overhead Triceps Extension (Cable)", machineType: "Cable", startingWeight: 55, targetSets: 2, repRange: [12, 15] },

    // Day 2 - PULL
    { dayNumber: 2, order: 1, name: "Assisted Pull-Up", machineType: "Machine", startingWeight: 80, targetSets: 4, repRange: [6, 10] }, // Note: Weight is assistance
    { dayNumber: 2, order: 2, name: "Seated Row Machine", machineType: "Machine", startingWeight: 140, targetSets: 3, repRange: [10, 12] },
    { dayNumber: 2, order: 3, name: "Wide-Grip Lat Pulldown", machineType: "Machine", startingWeight: 130, targetSets: 3, repRange: [10, 12] },
    { dayNumber: 2, order: 4, name: "Rear Delt Fly (reverse pec deck)", machineType: "Machine", startingWeight: 80, targetSets: 3, repRange: [12, 15] },
    { dayNumber: 2, order: 5, name: "Preacher Curl Machine", machineType: "Machine", startingWeight: 70, targetSets: 3, repRange: [10, 12] },
    { dayNumber: 2, order: 6, name: "Cable Hammer Curl", machineType: "Cable", startingWeight: 50, targetSets: 2, repRange: [12, 15] },

    // Day 3 - LEGS
    { dayNumber: 3, order: 1, name: "45° Leg Press", machineType: "Plate Loaded", startingWeight: 360, targetSets: 4, repRange: [10, 15] },
    { dayNumber: 3, order: 2, name: "Seated Leg Curl", machineType: "Machine", startingWeight: 100, targetSets: 3, repRange: [12, 15] },
    { dayNumber: 3, order: 3, name: "Leg Extension", machineType: "Machine", startingWeight: 110, targetSets: 3, repRange: [12, 15] },
    { dayNumber: 3, order: 4, name: "Smith Machine Squat", machineType: "Smith Machine", startingWeight: 105, targetSets: 3, repRange: [8, 12] },
    { dayNumber: 3, order: 5, name: "Hip Abductor/Adductor", machineType: "Machine", startingWeight: 150, targetSets: 2, repRange: [15, 20] },
    { dayNumber: 3, order: 6, name: "Standing Calf Raise", machineType: "Machine", startingWeight: 190, targetSets: 4, repRange: [15, 20] },

    // Day 4 - UPPER (Aesthetics)
    { dayNumber: 4, order: 1, name: "Incline Chest Press", machineType: "Machine", startingWeight: 110, targetSets: 3, repRange: [12, 12] }, // Fixed rep count treated as max/min
    { dayNumber: 4, order: 2, name: "Neutral-Grip Lat Pulldown", machineType: "Machine", startingWeight: 120, targetSets: 3, repRange: [12, 12] },
    { dayNumber: 4, order: 3, name: "Cable Lateral Raise (single arm)", machineType: "Cable", startingWeight: 20, targetSets: 4, repRange: [15, 15] },
    { dayNumber: 4, order: 4, name: "Rear Delt Fly Machine", machineType: "Machine", startingWeight: 80, targetSets: 3, repRange: [15, 15] },
    { dayNumber: 4, order: 5, name: "Cable Triceps Pushdown", machineType: "Cable", startingWeight: 65, targetSets: 3, repRange: [12, 12] },
    { dayNumber: 4, order: 6, name: "EZ-Bar Cable Curl", machineType: "Cable", startingWeight: 60, targetSets: 3, repRange: [12, 12] },
    { dayNumber: 4, order: 7, name: "Ab Crunch Machine", machineType: "Machine", startingWeight: 110, targetSets: 3, repRange: [15, 20] },

    // Day 5 - FULL BODY + Conditioning
    { dayNumber: 5, order: 1, name: "Chest Press", machineType: "Machine", startingWeight: 120, targetSets: 3, repRange: [10, 10] },
    { dayNumber: 5, order: 2, name: "Row Machine", machineType: "Machine", startingWeight: 140, targetSets: 3, repRange: [10, 10] },
    { dayNumber: 5, order: 3, name: "Leg Press", machineType: "Machine", startingWeight: 390, targetSets: 3, repRange: [15, 15] },
    { dayNumber: 5, order: 4, name: "Lat Pulldown", machineType: "Machine", startingWeight: 130, targetSets: 3, repRange: [12, 12] },
    { dayNumber: 5, order: 5, name: "Cable Curl + Pushdown superset", machineType: "Cable", startingWeight: 60, targetSets: 3, repRange: [0, 0], notes: "Superset: 60lb curl, 70lb pushdown" },
];

export async function seedExercises() {
    const q = query(collection(db, "exercises"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        console.log("Exercises already seeded.");
        return;
    }

    console.log("Seeding exercises...");
    const batch = writeBatch(db);

    EXERCISES.forEach((exercise) => {
        const docRef = doc(collection(db, "exercises"));
        batch.set(docRef, exercise);
    });

    await batch.commit();
    console.log("Seeding complete.");
}
