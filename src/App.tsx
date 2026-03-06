import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import BriefIntake from "@/pages/BriefIntake";
import GeneratedDocument from "@/pages/GeneratedDocument";
import Documents from "@/pages/Documents";
import PositioningOpportunities from "@/pages/PositioningOpportunities";
import Login from "@/pages/Login";
import LoadingScreen from "@/pages/LoadingScreen";
import NotFound from "./pages/NotFound";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login" || location.pathname === "/loading";

  return (
    <>
      {!isLogin && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/loading" element={<LoadingScreen />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/brief" element={<BriefIntake />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/opportunities" element={<PositioningOpportunities />} />
        <Route path="/document" element={<GeneratedDocument />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
