import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, session } = useAuth();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Additional session validation
    const validateSession = async () => {
      try {
        if (!session) {
          setIsAuthenticated(false);
          setIsCheckingSession(false);
          return;
        }

        // Check if session is still valid
        const { data } = await supabase.auth.getUser();
        setIsAuthenticated(!!data.user);
      } catch (error) {
        console.error("Session validation error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    if (!loading) {
      validateSession();
    }
  }, [loading, session]);

  if (loading || isCheckingSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
