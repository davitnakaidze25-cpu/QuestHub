import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Sparkles } from "lucide-react";

const INTERESTS = ["Education", "Healthy Lifestyle", "Finance", "Creative Arts", "Tech Skills"];

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Education", "Healthy Lifestyle"]);
  const { login } = useGame();
  const navigate = useNavigate();

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleLogin = () => {
    if (!username.trim()) return;
    login(username.trim());
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
  <img src="/logo.png" alt="QuestHub Logo" className="w-32 h-32 object-contain" />
          </div>

          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">QuestHub</h1>
          <p className="text-muted-foreground mt-2 text-sm">Level up your life with your squad</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              maxLength={20}
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedInterests.includes(interest)
                      ? "gradient-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleLogin}
            disabled={!username.trim()}
            className="w-full py-3.5 rounded-lg gradient-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            <Sparkles size={18} />
            Start Your Quest
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
