import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider, useGame } from "@/context/GameContext";
import { ThemeProvider } from "@/context/ThemeContext";
import MobileLayout from "@/components/MobileLayout";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import QuizPage from "@/pages/QuizPage";
import ChallengesPage from "@/pages/ChallengesPage";
import StorePage from "@/pages/StorePage";
import SquadPage from "@/pages/SquadPage";
import GlobalRankingsPage from "@/pages/GlobalRankingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useGame();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isLoggedIn } = useGame();
  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/home" replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute><MobileLayout /></ProtectedRoute>}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/squad" element={<SquadPage />} />
        <Route path="/rankings" element={<GlobalRankingsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <GameProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </GameProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
