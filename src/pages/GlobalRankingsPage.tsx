import React from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Globe, Trophy, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const GlobalRankingsPage = () => {
  const { globalSquads, squad } = useGame();

  const sorted = [...globalSquads].sort((a, b) => b.totalXp - a.totalXp);
  const myRank = squad ? sorted.findIndex((s) => s.id === squad.id) + 1 : null;

  const chartData = sorted.slice(0, 8).map((s) => ({
    name: s.name.replace(/[^\w\s]/g, "").trim().slice(0, 8),
    xp: s.totalXp,
    isMine: s.id === squad?.id,
  }));

  return (
    <div className="px-4 py-5 space-y-5">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="flex items-center gap-2 mb-1">
          <Globe size={20} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">Global Rankings</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {myRank ? `Your squad ranks #${myRank} worldwide` : "Join a squad to compete globally"}
        </p>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-4 shadow-card"
      >
        <p className="text-sm font-semibold text-foreground mb-3">Top Squads XP</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(220,10%,50%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Bar dataKey="xp" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.isMine ? "hsl(174, 62%, 47%)" : "hsl(260, 45%, 72%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Rankings List */}
      <div className="space-y-2">
        {sorted.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-3 bg-card rounded-xl p-3 shadow-card ${
              s.id === squad?.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <div className="w-8 text-center font-bold text-sm text-muted-foreground">
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
            </div>
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg">
              {s.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {s.name} {s.id === squad?.id && <span className="text-primary text-xs">(You)</span>}
              </p>
              <p className="text-xs text-muted-foreground">{s.memberCount} members</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-xp">{s.totalXp.toLocaleString()} XP</p>
              <div className="flex items-center gap-0.5 justify-end">
                <TrendingUp size={10} className="text-success" />
                <span className="text-[10px] text-success">+{s.weeklyGain}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GlobalRankingsPage;
