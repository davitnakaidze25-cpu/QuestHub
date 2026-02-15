import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

const StorePage = () => {
  const { user, rewards, purchaseReward } = useGame();
  const [filter, setFilter] = useState<"all" | "badge" | "discount" | "virtual">("all");
  const [justBought, setJustBought] = useState<string | null>(null);

  const filtered = filter === "all" ? rewards : rewards.filter((r) => r.category === filter);

  const handlePurchase = (id: string) => {
    const success = purchaseReward(id);
    if (success) {
      setJustBought(id);
      toast.success("Reward unlocked! 🎉");
      setTimeout(() => setJustBought(null), 1500);
    } else {
      toast.error("Not enough XP!");
    }
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "badge", label: "🏅 Badges" },
    { key: "discount", label: "🎫 Discounts" },
    { key: "virtual", label: "✨ Virtual" },
  ] as const;

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Reward Store</h2>
          <p className="text-sm text-muted-foreground">Spend your hard-earned XP</p>
        </div>
        <div className="gradient-xp px-3 py-1.5 rounded-full">
          <span className="text-sm font-bold text-xp-foreground">{user?.xp} XP</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === f.key ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {filtered.map((reward, i) => (
            <motion.div
              key={reward.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-4 shadow-card flex flex-col items-center text-center"
            >
              <span className="text-4xl mb-2">{reward.emoji}</span>
              <h3 className="text-sm font-bold text-foreground">{reward.name}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{reward.description}</p>
              <div className="mt-auto pt-3 w-full">
                {reward.purchased ? (
                  <div className="flex items-center justify-center gap-1 text-success text-xs font-bold">
                    <Check size={14} /> Owned
                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handlePurchase(reward.id)}
                    className={`w-full py-2 rounded-lg text-xs font-bold ${
                      (user?.xp ?? 0) >= reward.cost
                        ? "gradient-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {justBought === reward.id ? "🎉" : `${reward.cost} XP`}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StorePage;
