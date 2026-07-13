import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import DsaTracker from "./pages/DsaTracker";
import Planner from "./pages/Planner";
import Resume from "./pages/Resume";
import MockInterview from "./pages/MockInterview";
import PremiumSuccess from "./pages/PremiumSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Premium from "./pages/Premium";
import NotFound from "./pages/NotFound";

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar />
      <div className="flex flex-1 bg-canvas">{children}</div>
    </div>
  );
}

function DashboardLayout() {
  const { user } = useAuth();
  return (
    <AppShell>
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dsa" element={<DsaTracker />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/interview" element={<MockInterview />} />
          <Route path="/premium/success" element={<PremiumSuccess />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/admin"
            element={
              user?.role === "ADMIN" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
        </Routes>
      </main>
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell><Landing /></AppShell>} />
      <Route path="/login" element={<AppShell><Login /></AppShell>} />
      <Route path="/register" element={<AppShell><Register /></AppShell>} />
      <Route path="/pricing" element={<AppShell><Pricing /></AppShell>} />

      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<DashboardLayout />} />
      </Route>

      <Route path="*" element={<AppShell><NotFound /></AppShell>} />
    </Routes>
  );
}
