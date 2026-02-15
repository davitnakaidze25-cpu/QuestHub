import React, { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Upload, CheckCircle, Clock, ShieldCheck, Camera } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  emoji: string;
  status: "pending" | "submitted" | "verified" | "rejected";
}

const INITIAL_CHALLENGES: Challenge[] = [
  { id: "c1", title: "Morning Run", description: "Run at least 2km before 8 AM", xpReward: 50, emoji: "🏃", status: "pending" },
  { id: "c2", title: "Healthy Meal", description: "Eat a balanced meal with veggies", xpReward: 30, emoji: "🥗", status: "pending" },
  { id: "c4", title: "Read 20 Pages", description: "Read 20 pages of any book", xpReward: 35, emoji: "📖", status: "pending" },
  { id: "c5", title: "Working Out", description: "Hit the GYM", xpReward: 60, emoji: "💪", status: "pending" },
];

const ChallengesPage = () => {
  const { addXp } = useGame();
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [verifying, setVerifying] = useState<string | null>(null);

  const handleUpload = (id: string) => {
    setChallenges((prev) => prev.map((c) => (c.id === id ? { ...c, status: "submitted" } : c)));
    setVerifying(id);

    // Simulated AI validation
    setTimeout(() => {
      const passed = Math.random() > 0.2; // 80% pass rate
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          if (passed) {
            addXp(c.xpReward);
            return { ...c, status: "verified" };
          }
          return { ...c, status: "rejected" };
        })
      );
      setVerifying(null);
    }, 2000);
  };

  const statusConfig = {
    pending: { icon: Camera, label: "Upload Proof", color: "gradient-primary text-primary-foreground" },
    submitted: { icon: Clock, label: "Verifying...", color: "bg-warning text-warning-foreground" },
    verified: { icon: CheckCircle, label: "Verified ✓", color: "bg-success text-success-foreground" },
    rejected: { icon: ShieldCheck, label: "Rejected — Retry", color: "bg-destructive text-destructive-foreground" },
  };

  return (
    <div className="px-4 py-5 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Daily Challenges</h2>
        <p className="text-sm text-muted-foreground">Complete habits, earn XP 💪</p>
      </div>

      {challenges.map((c, i) => {
        const config = statusConfig[c.status];
        const Icon = config.icon;
        return (
          <motion.div
            key={c.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-xl p-4 shadow-card"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{c.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-foreground">{c.title}</h3>
                  <span className="text-xs font-bold text-xp gradient-xp px-2 py-0.5 rounded-full text-xp-foreground">
                    +{c.xpReward} XP
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    if (c.status === "pending" || c.status === "rejected") handleUpload(c.id);
                  }}
                  disabled={c.status === "submitted" || c.status === "verified"}
                  className={`mt-2 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${config.color} disabled:opacity-60`}
                >
                  {verifying === c.id ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Clock size={14} />
                    </motion.div>
                  ) : (
                    <Icon size={14} />
                  )}
                  {/* Changed label logic here */}
                  {c.id === "c4" && c.status === "pending" ? "Scan for quiz" : config.label}
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ChallengesPage;