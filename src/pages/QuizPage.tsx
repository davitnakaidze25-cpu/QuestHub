import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Timer, CheckCircle2, XCircle, Zap } from "lucide-react";

const QUESTIONS = [
  { id: "q1", question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], correctIndex: 1, category: "Biology" },
  { id: "q2", question: "What year did World War II end?", options: ["1943", "1944", "1945", "1946"], correctIndex: 2, category: "History" },
  { id: "q3", question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correctIndex: 2, category: "Chemistry" },
  { id: "q4", question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctIndex: 1, category: "Astronomy" },
  { id: "q5", question: "What is the square root of 144?", options: ["10", "11", "12", "14"], correctIndex: 2, category: "Math" },
];

const QuizPage = () => {
  const { addXp, addQuizScore } = useGame();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [phase, setPhase] = useState<"playing" | "result" | "finished">("playing");
  const [answered, setAnswered] = useState(false);

  const question = QUESTIONS[currentQ];

  const handleNext = useCallback(() => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((p) => p + 1);
      setSelected(null);
      setTimer(15);
      setAnswered(false);
      setPhase("playing");
    } else {
      const pct = Math.round((score / QUESTIONS.length) * 100);
      addXp(score * 20);
      addQuizScore(pct);
      setPhase("finished");
    }
  }, [currentQ, score, addXp, addQuizScore]);

  useEffect(() => {
    if (phase !== "playing" || answered) return;
    if (timer <= 0) {
      setAnswered(true);
      setPhase("result");
      return;
    }
    const t = setTimeout(() => setTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, phase, answered]);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === question.correctIndex) setScore((p) => p + 1);
    setPhase("result");
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setTimer(15);
    setPhase("playing");
    setAnswered(false);
  };

  if (phase === "finished") {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">
          {pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "📚"}
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">Quiz Complete!</h2>
        <p className="text-muted-foreground mt-1">
          {score}/{QUESTIONS.length} correct — {pct}%
        </p>
        <div className="flex items-center gap-1 gradient-xp px-4 py-2 rounded-full mt-4">
          <Zap size={16} className="text-xp-foreground" />
          <span className="text-sm font-bold text-xp-foreground">+{score * 20} XP</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={restart}
          className="mt-6 px-6 py-3 rounded-lg gradient-primary text-primary-foreground font-bold"
        >
          Play Again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all"
            style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{currentQ + 1}/{QUESTIONS.length}</span>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">{question.category}</span>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${timer <= 5 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
          <Timer size={14} />
          <span className="text-sm font-bold">{timer}s</span>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
        >
          <h3 className="text-lg font-bold text-foreground leading-snug">{question.question}</h3>
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt, i) => {
          let style = "bg-card border border-border text-foreground";
          if (phase === "result") {
            if (i === question.correctIndex) style = "bg-success/10 border-2 border-success text-success";
            else if (i === selected) style = "bg-destructive/10 border-2 border-destructive text-destructive";
          }
          return (
            <motion.button
              key={i}
              whileTap={!answered ? { scale: 0.97 } : {}}
              onClick={() => handleAnswer(i)}
              disabled={answered}
              className={`w-full text-left p-4 rounded-xl font-medium text-sm transition-all ${style} flex items-center justify-between`}
            >
              <span>{opt}</span>
              {phase === "result" && i === question.correctIndex && <CheckCircle2 size={18} className="text-success" />}
              {phase === "result" && i === selected && i !== question.correctIndex && <XCircle size={18} className="text-destructive" />}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      {phase === "result" && (
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleNext}
          className="w-full py-3 rounded-lg gradient-primary text-primary-foreground font-bold"
        >
          {currentQ < QUESTIONS.length - 1 ? "Next Question" : "See Results"}
        </motion.button>
      )}
    </div>
  );
};

export default QuizPage;
