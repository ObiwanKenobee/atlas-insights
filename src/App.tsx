import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import RiskRadarPage from "./pages/RiskRadar";
import ScenariosPage from "./pages/Scenarios";
import ScenarioBuilderPage from "./pages/ScenarioBuilder";
import SimulationsPage from "./pages/Simulations";
import SimulationDetailPage from "./pages/SimulationDetail";
import PortfoliosPage from "./pages/Portfolios";
import PortfolioDetailPage from "./pages/PortfolioDetail";
import ImpactPage from "./pages/Impact";
import GraphPage from "./pages/Graph";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const protect = (el: JSX.Element) => <ProtectedRoute>{el}</ProtectedRoute>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={protect(<DashboardPage />)} />
            <Route path="/risk-radar" element={protect(<RiskRadarPage />)} />
            <Route path="/scenarios" element={protect(<ScenariosPage />)} />
            <Route path="/scenarios/new" element={protect(<ScenarioBuilderPage />)} />
            <Route path="/scenarios/:id" element={protect(<ScenariosPage />)} />
            <Route path="/simulations" element={protect(<SimulationsPage />)} />
            <Route path="/simulations/:id" element={protect(<SimulationDetailPage />)} />
            <Route path="/portfolios" element={protect(<PortfoliosPage />)} />
            <Route path="/portfolios/:id" element={protect(<PortfolioDetailPage />)} />
            <Route path="/impact" element={protect(<ImpactPage />)} />
            <Route path="/graph" element={protect(<GraphPage />)} />
            <Route path="/settings" element={protect(<SettingsPage />)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
