import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/lib/supabase-types";

type UserProfile = Tables<"users">;

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Error getting session:", error);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Check for session timeout and validity
    const sessionTimeoutCheck = setInterval(() => {
      if (!isMounted) return;

      supabase.auth
        .getSession()
        .then(({ data: { session: currentSession } }) => {
          // Check if session is expired or invalid
          if (!currentSession && session) {
            console.log("Session expired or invalid, logging out user");
            // Session expired
            setSession(null);
            setUser(null);
            setProfile(null);

            // Optionally show a notification to the user
            // that they've been logged out due to session expiration
            if (
              window.confirm("Your session has expired. Please log in again.")
            ) {
              window.location.href = "/login";
            }
          } else if (currentSession) {
            // Check if session is about to expire (within 5 minutes)
            const expiresAt = currentSession.expires_at;
            const expiresAtDate = new Date(expiresAt * 1000);
            const now = new Date();
            const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

            if (expiresAtDate.getTime() - now.getTime() < fiveMinutes) {
              // Refresh the session
              supabase.auth.refreshSession();
            }
          }
        })
        .catch((error) => {
          console.error("Error checking session:", error);
        });
    }, 60000); // Check every minute

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearInterval(sessionTimeoutCheck);
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error("No user logged in") };

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id);

    if (!error) {
      fetchProfile(user.id);
    }

    return { error };
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
