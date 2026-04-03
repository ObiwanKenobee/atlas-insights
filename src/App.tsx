import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/risk-radar" element={<RiskRadarPage />} />
          <Route path="/scenarios" element={<ScenariosPage />} />
          <Route path="/scenarios/new" element={<ScenarioBuilderPage />} />
          <Route path="/scenarios/:id" element={<ScenariosPage />} />
          <Route path="/simulations" element={<SimulationsPage />} />
          <Route path="/simulations/:id" element={<SimulationDetailPage />} />
          <Route path="/portfolios" element={<PortfoliosPage />} />
          <Route path="/portfolios/:id" element={<PortfolioDetailPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
