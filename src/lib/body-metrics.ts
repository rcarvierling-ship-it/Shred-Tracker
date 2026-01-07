import { db } from "./firebase";
import { collection, addDoc, query, orderBy, getDocs, Timestamp, where } from "firebase/firestore";

export interface BodyMetric {
    id?: string;
    uid: string;
    weight: number;
    date: Date;
}

export async function logBodyWeight(uid: string, weight: number) {
    if (!uid) return;
    await addDoc(collection(db, "body_metrics"), {
        uid,
        weight,
        date: Timestamp.now()
    });
}

export async function getBodyWeightHistory(uid: string): Promise<BodyMetric[]> {
    if (!uid) return [];

    // Calculate date 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const q = query(
        collection(db, "body_metrics"),
        where("uid", "==", uid),
        where("date", ">=", sixMonthsAgo),
        orderBy("date", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            uid: data.uid,
            weight: data.weight,
            date: data.date.toDate()
        } as BodyMetric;
    });
}
