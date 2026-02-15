import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Send, Trophy, MessageCircle, UserPlus, Shuffle, X, Bot } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const SquadPage = () => {
  const { 
    squad, 
    user, 
    chatMessages, 
    sendMessage, 
    inviteToSquad, 
    quickMatch,
    showBotSuggestion,
    handleChatInput 
  } = useGame();
  
  const [tab, setTab] = useState<"chat" | "leaderboard">("chat");
  const [msg, setMsg] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteNickname, setInviteNickname] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    if (!msg.trim()) return;
    sendMessage(msg.trim());
    setMsg("");
  };

  const handleInvite = () => {
    if (!inviteNickname.trim()) return;
    inviteToSquad(inviteNickname.trim());
    setInviteNickname("");
    setShowInvite(false);
  };

  const sortedMembers = squad ? [...squad.members].sort((a, b) => b.xp - a.xp) : [];

  const chartData = sortedMembers.map((m) => ({
    name: m.username,
    xp: m.xp,
    isUser: m.id === user?.id,
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Squad Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{squad?.name ?? "Squad"}</h2>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInvite(true)}
            className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center"
          >
            <UserPlus size={14} className="text-primary-foreground" />
          </motion.button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setTab("chat")}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              tab === "chat" ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            <MessageCircle size={14} /> Chat
          </button>
          <button
            onClick={() => setTab("leaderboard")}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              tab === "leaderboard" ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            <Trophy size={14} /> Leaderboard
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/40 z-20 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-5 w-full max-w-sm shadow-elevated space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">Add to Squad</h3>
                <button onClick={() => setShowInvite(false)} className="text-muted-foreground">
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Invite by Nickname</label>
                <div className="flex gap-2">
                  <input
                    value={inviteNickname}
                    onChange={(e) => setInviteNickname(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                    placeholder="Enter nickname..."
                    className="flex-1 px-3 py-2.5 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInvite}
                    disabled={!inviteNickname.trim()}
                    className="px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                  >
                    Invite
                  </motion.button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  quickMatch();
                  setShowInvite(false);
                }}
                className="w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm flex items-center justify-center gap-2"
              >
                <Shuffle size={16} />
                Quick Match — Find Random Player
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {tab === "chat" ? (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {chatMessages.map((m) => {
              const isMe = m.userId === user?.id;
              const isBot = m.userId === "questbot";
              const isSystem = m.userId === "system";

              if (isSystem) {
                return (
                  <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">{m.text}</span>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={m.id}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 shadow-sm ${isBot ? "bg-primary/20" : "bg-muted"}`}>
                    {m.avatar}
                  </div>
                  <div className={`max-w-[75%] ${isMe ? "items-end" : ""}`}>
                    <p className={`text-[10px] font-medium mb-0.5 flex items-center gap-1 ${isMe ? "justify-end" : ""} text-muted-foreground`}>
                      {isBot && <Bot size={10} className="text-primary" />}
                      {m.username}
                    </p>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm shadow-sm ${
                        isMe
                          ? "gradient-primary text-primary-foreground rounded-br-md"
                          : isBot 
                            ? "bg-primary/10 text-foreground border border-primary/20 rounded-bl-md font-medium"
                            : "bg-card text-foreground border border-border rounded-bl-md"
                      }`}
                    >
                      {m.text}
                    </div>
                    <p className={`text-[9px] text-muted-foreground mt-0.5 ${isMe ? "text-right" : ""}`}>
                      {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input & Bot Suggestion */}
          <div className="px-4 py-3 bg-card border-t border-border relative">
            <AnimatePresence>
              {showBotSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-4 mb-3 w-64 bg-card border border-primary/30 rounded-xl shadow-2xl p-3 z-30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                      <Bot size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">QuestBot</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-semibold">AI Assistant</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground border-t border-border mt-2 pt-2">
                    Tag me with <span className="text-primary font-mono font-bold">@QuestBot</span> to help you navigate!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2">
              <input
                value={msg}
                onChange={(e) => {
                  setMsg(e.target.value);
                  handleChatInput(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Message or tag @QuestBot..."
                className="flex-1 px-4 py-2.5 rounded-full bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-lg"
              >
                <Send size={16} className="text-primary-foreground" />
              </motion.button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Chart */}
          <div className="bg-card rounded-xl p-4 shadow-card">
            <p className="text-sm font-semibold text-foreground mb-3">Squad XP Rankings</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220,10%,50%)" }} axisLine={false} tickLine={false} />
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
                    <Cell key={idx} fill={entry.isUser ? "hsl(174, 62%, 47%)" : "hsl(260, 45%, 82%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leaderboard List */}
          {sortedMembers.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 bg-card rounded-xl p-3 shadow-card ${
                m.id === user?.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="w-8 text-center font-bold text-sm text-muted-foreground">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </div>
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg">{m.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {m.username} {m.id === user?.id && <span className="text-primary text-xs">(You)</span>}
                </p>
                <p className="text-xs text-muted-foreground">Lv.{m.level}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-xp">{m.xp} XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SquadPage;