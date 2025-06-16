
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Common
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

// Auth
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dashboards
import VoterDashboard from "./pages/dashboard/VoterDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

// Admin Pages
import VotersManagement from "./pages/admin/VotersManagement";
import PositionsManagement from "./pages/admin/PositionsManagement";
import CandidatesManagement from "./pages/admin/CandidatesManagement";
import FeedbackManagement from "./pages/admin/FeedbackManagement";

// Voting Pages
import VotingPortal from "./pages/voting/VotingPortal";
import ResultsPage from "./pages/voting/ResultsPage";
import FeedbackPage from "./pages/voting/FeedbackPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Pages - Set Login as default landing page */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Voter Routes */}
          <Route path="/dashboard" element={<Layout userRole="voter"><VoterDashboard /></Layout>} />
          <Route path="/voting" element={<Layout userRole="voter"><VotingPortal /></Layout>} />
          <Route path="/results" element={<Layout userRole="voter"><ResultsPage /></Layout>} />
          <Route path="/feedback" element={<Layout userRole="voter"><FeedbackPage /></Layout>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Layout userRole="admin"><AdminDashboard /></Layout>} />
          <Route path="/voters" element={<Layout userRole="admin"><VotersManagement /></Layout>} />
          <Route path="/positions" element={<Layout userRole="admin"><PositionsManagement /></Layout>} />
          <Route path="/candidates" element={<Layout userRole="admin"><CandidatesManagement /></Layout>} />
          <Route path="/votes" element={<Layout userRole="admin"><ResultsPage /></Layout>} /> 
          <Route path="/ballot-position" element={<Layout userRole="admin"><PositionsManagement /></Layout>} />
          <Route path="/election-title" element={<Layout userRole="admin"><AdminDashboard /></Layout>} />
          <Route path="/feedback-management" element={<Layout userRole="admin"><FeedbackManagement /></Layout>} />
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
