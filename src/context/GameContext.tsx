import React, { createContext, useContext, useState, ReactNode } from "react";

// --- INTERFACES ---
export interface User {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  interests: string[];
  squadId: string | null;
}

export interface SquadMember {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  weeklyXp: number[];
}

export interface Squad {
  id: string;
  name: string;
  members: SquadMember[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: Date;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  emoji: string;
  category: "badge" | "discount" | "virtual";
  purchased?: boolean;
}

export interface GlobalSquad {
  id: string;
  name: string;
  emoji: string;
  totalXp: number;
  memberCount: number;
  weeklyGain: number;
}

interface GameContextType {
  user: User | null;
  squad: Squad | null;
  chatMessages: ChatMessage[];
  rewards: RewardItem[];
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => void;
  addXp: (amount: number) => void;
  purchaseReward: (rewardId: string) => boolean;
  sendMessage: (text: string) => void;
  joinSquad: () => void;
  quizHistory: number[];
  addQuizScore: (score: number) => void;
  globalSquads: GlobalSquad[];
  inviteToSquad: (nickname: string) => void;
  quickMatch: () => void;
  // Bot UI Helpers
  showBotSuggestion: boolean;
  handleChatInput: (text: string) => void;
}

// --- MOCK DATA ---
const MOCK_SQUAD: Squad = {
  id: "squad-1",
  name: "🔥 Phoenix Riders",
  members: [
    { id: "u2", username: "Luna", avatar: "🌙", xp: 2450, level: 8, weeklyXp: [120, 80, 150, 200, 90, 170, 130] },
    { id: "u3", username: "Blaze", avatar: "🔥", xp: 3100, level: 10, weeklyXp: [200, 150, 180, 220, 160, 190, 210] },
    { id: "u4", username: "Nova", avatar: "⭐", xp: 1800, level: 6, weeklyXp: [90, 110, 70, 130, 100, 80, 120] },
    { id: "u5", username: "Echo", avatar: "🎵", xp: 2200, level: 7, weeklyXp: [140, 100, 160, 110, 130, 150, 120] },
  ],
};

const MOCK_REWARDS: RewardItem[] = [
  { id: "r1", name: "Bronze Badge", description: "Show off your dedication", cost: 100, emoji: "🥉", category: "badge" },
  { id: "r2", name: "Silver Badge", description: "You're on fire!", cost: 250, emoji: "🥈", category: "badge" },
  { id: "r3", name: "Gold Badge", description: "Legendary status", cost: 500, emoji: "🥇", category: "badge" },
  { id: "r4", name: "10% Off Merch", description: "Discount on QuestHub merch", cost: 300, emoji: "🎫", category: "discount" },
  { id: "r5", name: "Custom Avatar Frame", description: "Stand out from the crowd", cost: 200, emoji: "🖼️", category: "virtual" },
  { id: "r6", name: "XP Booster (2x)", description: "Double XP for 1 day", cost: 400, emoji: "🚀", category: "virtual" },
];

const MOCK_GLOBAL_SQUADS: GlobalSquad[] = [
  { id: "squad-g1", name: "⚡ Thunder Wolves", emoji: "⚡", totalXp: 18200, memberCount: 5, weeklyGain: 1340 },
  { id: "squad-g2", name: "🐉 Dragon Slayers", emoji: "🐉", totalXp: 16800, memberCount: 4, weeklyGain: 1120 },
  { id: "squad-1", name: "🔥 Phoenix Riders", emoji: "🔥", totalXp: 10800, memberCount: 5, weeklyGain: 980 },
  { id: "squad-g3", name: "🚀 Rocket gang", emoji: "🚀", totalXp: 17900, memberCount: 4, weeklyGain: 1500 },
  { id: "squad-2", name: "🖼️ Nerdy dudes", emoji: "🖼️", totalXp: 11500, memberCount: 5, weeklyGain: 890 },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "m1", userId: "u2", username: "Luna", avatar: "🌙", text: "Hey squad! Ready for today's quiz?", timestamp: new Date(Date.now() - 3600000) },
  { id: "m2", userId: "u3", username: "Blaze", avatar: "🔥", text: "Let's crush it! I've been studying all day 💪", timestamp: new Date(Date.now() - 3000000) },
   { id: "m2", userId: "u3", username: "Echo", avatar: "🐉", text: "I've completed morning run (:", timestamp: new Date(Date.now() - 3000000) },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [squad, setSquad] = useState<Squad | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [rewards, setRewards] = useState<RewardItem[]>(MOCK_REWARDS);
  const [quizHistory, setQuizHistory] = useState<number[]>([60, 80, 70, 90, 85]);
  const [globalSquads, setGlobalSquads] = useState<GlobalSquad[]>(MOCK_GLOBAL_SQUADS);

  // --- NEW TAGGING STATE ---
  const [showBotSuggestion, setShowBotSuggestion] = useState(false);

  const login = (username: string) => {
    const newUser: User = {
      id: "u1",
      username,
      avatar: "🦊",
      xp: 1250,
      level: 5,
      streak: 7,
      interests: ["Education", "Healthy Lifestyle"],
      squadId: null,
    };
    setUser(newUser);
    setSquad({
      ...MOCK_SQUAD,
      members: [
        { id: "u1", username, avatar: "🦊", xp: 1250, level: 5, weeklyXp: [100, 120, 90, 140, 110, 130, 100] },
        ...MOCK_SQUAD.members,
      ],
    });
  };

  const logout = () => {
    setUser(null);
    setSquad(null);
  };

  const addXp = (amount: number) => {
    if (!user) return;
    const newXp = user.xp + amount;
    const newLevel = Math.floor(newXp / 300) + 1;
    setUser({ ...user, xp: newXp, level: newLevel });
  };

  const purchaseReward = (rewardId: string): boolean => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward || !user || user.xp < reward.cost || reward.purchased) return false;
    setUser({ ...user, xp: user.xp - reward.cost });
    setRewards(rewards.map((r) => (r.id === rewardId ? { ...r, purchased: true } : r)));
    return true;
  };

  // --- MODIFIED MESSAGE LOGIC ---
  const handleChatInput = (text: string) => {
    // Shows popup if user types '@' or starts the bot name
    if (text.match(/@$|@Q$|@Qu$|@Que$|@Ques$|@QuestBot$/i)) {
      setShowBotSuggestion(true);
    } else {
      setShowBotSuggestion(false);
    }
  };

  const sendMessage = (text: string) => {
    if (!user) return;

    // Reset popup
    setShowBotSuggestion(false);

    // Add User Message
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      text,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Check for @QuestBot tag
    if (/@QuestBot/i.test(text)) {
      const query = text.toLowerCase();
      let reply = "🤖 “This feature is currently under development, I will be available soon.";

      if (query.includes("shop") || query.includes("reward")) {
        reply = "🛍️ **Marketplace**: Go to the **Rewards** tab to spend your XP!";
      } else if (query.includes("quiz") || query.includes("play")) {
        reply = "🧠 **Game Center**: Head over to the **Play** tab to start a quiz.";
      } else if (query.includes("squad")) {
        reply = "🛡️ **Squad Hub**: Manage your team and invites in the **Squad** tab.";
      }

      // Simulate Bot reply delay
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          userId: "questbot",
          username: "QuestBot",
          avatar: "🤖",
          text: reply,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, botMsg]);
      }, 750);
    }
  };

  const joinSquad = () => { if (user) setUser({ ...user, squadId: "squad-1" }); };

  const inviteToSquad = (nickname: string) => {
    if (!squad || !user) return;
    const newMember: SquadMember = {
      id: `u-inv-${Date.now()}`,
      username: nickname,
      avatar: "🐶",
      xp: 800,
      level: 3,
      weeklyXp: [50, 60, 70, 80, 90, 100, 110],
    };
    setSquad({ ...squad, members: [...squad.members, newMember] });
  };

  const quickMatch = () => { inviteToSquad("New Player"); };
  const addQuizScore = (score: number) => { setQuizHistory((prev) => [...prev, score]); };

  return (
    <GameContext.Provider
      value={{
        user, squad, chatMessages, rewards, isLoggedIn: !!user,
        login, logout, addXp, purchaseReward, sendMessage, joinSquad,
        quizHistory, addQuizScore, globalSquads, inviteToSquad, quickMatch,
        showBotSuggestion, handleChatInput
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};