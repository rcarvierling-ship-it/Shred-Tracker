"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { seedExercises } from "@/lib/seed";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dumbbell, LogOut, Settings, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    await seedExercises();
    setSeeding(false);
    alert("Seeding complete! Refreshing...");
    window.location.reload();
  };

  const days = [
    { title: "Day 1: PUSH", desc: "Chest, Shoulders, Triceps", color: "from-blue-600 to-cyan-500" },
    { title: "Day 2: PULL", desc: "Back, Biceps, Rear Delts", color: "from-purple-600 to-pink-500" },
    { title: "Day 3: LEGS", desc: "Quads, Hams, Glutes, Calves", color: "from-red-600 to-orange-500" },
    { title: "Day 4: UPPER", desc: "Aesthetics Focus", color: "from-emerald-600 to-teal-500" },
    { title: "Day 5: FULL BODY", desc: "Conditioning & Strength", color: "from-indigo-600 to-blue-500" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pb-24 selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      <header className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
            Shred Tracker
          </h1>
          <p className="text-gray-400 text-sm font-medium">Welcome back, {user?.email?.split("@")[0]}</p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur rounded-full p-1 border border-gray-800">
          <Button variant="ghost" size="icon" onClick={() => router.push("/settings")} className="rounded-full hover:bg-gray-800">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="space-y-6 relative z-10">
        {/* Quick Actions / Status */}
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Zap className="w-24 h-24" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white font-semibold">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Ready to crush it?</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSeed} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800">
                    {seeding ? "Seeding..." : "Reset Data"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Workout Days Grid */}
        <motion.section
          className="grid grid-cols-1 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {days.map((day, index) => (
            <motion.div key={index} variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => router.push(`/workout/${index + 1}`)}
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${day.color}`}></div>
                <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br ${day.color} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity`}></div>

                <CardHeader className="flex flex-row items-center justify-between pl-6">
                  <div>
                    <CardTitle className="text-xl text-white font-bold tracking-wide">
                      {day.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 font-medium">
                      {day.desc}
                    </CardDescription>
                  </div>
                  <div className="bg-gray-800/80 p-3 rounded-full group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                    <Dumbbell className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.section>
      </main>
    </div>
  );
}
