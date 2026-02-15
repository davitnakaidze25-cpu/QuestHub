import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Brain, Dumbbell, ShoppingBag, Users, Globe, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { useTheme } from "@/context/ThemeContext";

const tabs = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/quiz", label: "Quiz", icon: Brain },
  { path: "/challenges", label: "Habits", icon: Dumbbell },
  { path: "/store", label: "Store", icon: ShoppingBag },
  { path: "/squad", label: "Squad", icon: Users },
  { path: "/rankings", label: "Global", icon: Globe },
];

const MobileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useGame();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-[100dvh] max-w-lg mx-auto bg-background relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-card shadow-card z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{user?.avatar}</span>
          <div>
            <p className="text-sm font-bold text-foreground">{user?.username}</p>
            <p className="text-xs text-muted-foreground">Lv.{user?.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            {theme === "light" ? <Moon size={16} className="text-foreground" /> : <Sun size={16} className="text-foreground" />}
          </motion.button>
          <div className="flex items-center gap-1 gradient-xp px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-xp-foreground">{user?.xp} XP</span>
          </div>
          <div className="flex items-center gap-1 gradient-accent px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-accent-foreground">🔥 {user?.streak}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="bg-card border-t border-border safe-bottom">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-0.5 px-2 py-1 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-2 w-8 h-1 rounded-full gradient-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  size={20}
                  className={isActive ? "text-primary" : "text-muted-foreground"}
                />
                <span
                  className={`text-[9px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;
