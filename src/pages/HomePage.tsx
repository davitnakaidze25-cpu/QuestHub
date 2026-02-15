import React from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Trophy, Target, Flame, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";

const HomePage = () => {
  const { user, squad, quizHistory } = useGame();

  const chartData = quizHistory.map((score, i) => ({ day: `D${i + 1}`, score }));

  const stats = [
    { label: "XP Total", value: user?.xp ?? 0, icon: Trophy, gradient: "gradient-xp" },
    { label: "Streak", value: `${user?.streak ?? 0} days`, icon: Flame, gradient: "gradient-accent" },
    { label: "Level", value: user?.level ?? 1, icon: TrendingUp, gradient: "gradient-primary" },
    { label: "Quizzes", value: quizHistory.length, icon: Target, gradient: "gradient-success" },
  ];

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Welcome */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-xl font-bold text-foreground">
          Welcome back, {user?.username}! 👋
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Keep pushing — you're on a roll!</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl p-4 shadow-card"
          >
            <div className={`w-8 h-8 rounded-lg ${stat.gradient} flex items-center justify-center mb-2`}>
              <stat.icon size={16} className="text-primary-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* XP Progress */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl p-4 shadow-card"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-foreground">Level Progress</p>
          <p className="text-xs text-muted-foreground">
            {(user?.xp ?? 0) % 300}/300 XP
          </p>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(((user?.xp ?? 0) % 300) / 300) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full gradient-primary"
          />
        </div>
      </motion.div>

      {/* Quiz Performance Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-xl p-4 shadow-card"
      >
        <p className="text-sm font-semibold text-foreground mb-3">Quiz Performance</p>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(174, 62%, 47%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(174, 62%, 47%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(220,10%,50%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(0,0%,100%)", border: "1px solid hsl(160,15%,88%)", borderRadius: "8px", fontSize: "12px" }}
            />
            <Area type="monotone" dataKey="score" stroke="hsl(174, 62%, 47%)" fill="url(#colorScore)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Squad Preview */}
      {squad && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl p-4 shadow-card"
        >
          <p className="text-sm font-semibold text-foreground mb-3">{squad.name}</p>
          <div className="flex -space-x-2">
            {squad.members.slice(0, 5).map((m) => (
              <div
                key={m.id}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg border-2 border-card"
              >
                {m.avatar}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{squad.members.length} members • Squad XP: {squad.members.reduce((a, b) => a + b.xp, 0)}</p>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
