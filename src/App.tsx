import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import OfficerDashboard from "./components/dashboard/OfficerDashboard";
import WarMapPage from "./pages/WarMapPage";
import LoginPage from "./pages/LoginPage";
import BattlegroupPage from "./pages/BattlegroupPage";
import ChampionListPage from "./pages/ChampionListPage";
import StatusPage from "./pages/StatusPage";
import MembersPage from "./pages/MembersPage";
import MemberDetailPage from "./pages/MemberDetailPage";
import RosterUpdatePage from "./pages/RosterUpdatePage";
import routes from "tempo-routes";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <OfficerDashboard />
                </ProtectedRoute>
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
            <Route
              path="/roster-update/:memberId"
              element={<RosterUpdatePage />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
