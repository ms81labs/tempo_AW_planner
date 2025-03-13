import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "../ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "officer" | "member" | "admin" | "any";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = "any",
}) => {
  const { user, loading, session, profile } = useAuth();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const location = useLocation();

  // Memoize the validateSession function
  const validateSession = useCallback(async () => {
    try {
      if (!session) {
        setIsAuthenticated(false);
        setHasRequiredRole(false);
        setIsCheckingSession(false);
        return;
      }

      // Check if session is still valid
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Session validation error:", error);
        setIsAuthenticated(false);
        setHasRequiredRole(false);
        return;
      }

      const isValid = !!data.user;
      setIsAuthenticated(isValid);

      // Check role requirements if authenticated
      if (isValid && profile) {
        if (requiredRole === "any") {
          setHasRequiredRole(true);
        } else {
          setHasRequiredRole(profile.role === requiredRole);
        }
      } else {
        setHasRequiredRole(false);
      }
    } catch (error) {
      console.error("Session validation error:", error);
      setIsAuthenticated(false);
      setHasRequiredRole(false);
    } finally {
      setIsCheckingSession(false);
    }
  }, [session, profile, requiredRole]);

  useEffect(() => {
    if (!loading) {
      validateSession();
    }
  }, [loading, validateSession]);

  if (loading || isCheckingSession) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    // Redirect to login and remember the page they tried to access
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!hasRequiredRole) {
    // User is authenticated but doesn't have the required role
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="mb-4 text-gray-600">
            You don't have permission to access this page. Please contact an
            administrator if you believe this is an error.
          </p>
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
            onClick={() => (window.location.href = "/")}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
