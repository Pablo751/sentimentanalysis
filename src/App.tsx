import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AppProvider, useAppState } from "@/context/AppContext";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import BriefIntake from "@/pages/BriefIntake";
import GeneratedDocument from "@/pages/GeneratedDocument";
import Documents from "@/pages/Documents";
import PositioningOpportunities from "@/pages/PositioningOpportunities";
import Login from "@/pages/Login";
import LoadingScreen from "@/pages/LoadingScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthLoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background px-6">
    <p className="text-sm text-muted-foreground">Checking secure session...</p>
  </div>
);

const RequireAuth = () => {
  const { authLoading, isAuthenticated } = useAppState();
  const location = useLocation();

  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return <Outlet />;
};

const PublicOnlyRoute = () => {
  const { authLoading, hasSeenLoader, isAuthenticated } = useAppState();

  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to={hasSeenLoader ? "/" : "/loading"} replace />;
  }

  return <Outlet />;
};

const AppLayout = () => {
  const location = useLocation();
  const { authLoading, isAuthenticated } = useAppState();
  const isLogin = location.pathname === "/login" || location.pathname === "/loading";
  const hideNavigation = authLoading || !isAuthenticated || isLogin;

  return (
    <>
      {!hideNavigation && <Navigation />}
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/brief" element={<BriefIntake />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/opportunities" element={<PositioningOpportunities />} />
          <Route path="/document" element={<GeneratedDocument />} />
          <Route path="*" element={<NotFound />} />
        </Route>
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
