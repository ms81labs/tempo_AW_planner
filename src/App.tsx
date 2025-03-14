import { Suspense, lazy, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import OfficerDashboard from "./components/dashboard/OfficerDashboard";
import LoginPage from "./pages/LoginPage";
import { ErrorBoundary } from "./components/ui/error-boundary";

// Lazy load pages for better performance
const WarMapPage = lazy(() => import("./pages/WarMapPage"));
const BattlegroupPage = lazy(() => import("./pages/BattlegroupPage"));
const ChampionListPage = lazy(() => import("./pages/ChampionListPage"));
const StatusPage = lazy(() => import("./pages/StatusPage"));
const MembersPage = lazy(() => import("./pages/MembersPage"));
const MemberDetailPage = lazy(() => import("./pages/MemberDetailPage"));
const RosterUpdatePage = lazy(() => import("./pages/RosterUpdatePage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const CreateAlliancePage = lazy(() => import("./pages/CreateAlliancePage"));
import routes from "tempo-routes";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

function AppRoutes() {
  const { profile, loading } = useAuth();

  // If user is logged in but has no alliance, redirect to create alliance page
  const shouldRedirectToCreateAlliance =
    profile && !profile.alliance_id && !profile.is_admin;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/create-alliance"
        element={
          <ProtectedRoute>
            <CreateAlliancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          shouldRedirectToCreateAlliance ? (
            <Navigate to="/create-alliance" />
          ) : (
            <ProtectedRoute>
              <OfficerDashboard />
            </ProtectedRoute>
          )
        }
      />
      <Route
        path="/war-map"
        element={
          <ProtectedRoute>
            <WarMapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/battlegroups"
        element={
          <ProtectedRoute>
            <BattlegroupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/champions"
        element={
          <ProtectedRoute>
            <ChampionListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <MembersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/:memberId"
        element={
          <ProtectedRoute>
            <MemberDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/status"
        element={
          <ProtectedRoute>
            <StatusPage />
          </ProtectedRoute>
        }
      />
      {/* Public route for roster updates via QR code - no auth needed */}
      <Route path="/roster-update/:memberId" element={<RosterUpdatePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }
        >
          <AppRoutes />
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Toaster />
        </Suspense>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
