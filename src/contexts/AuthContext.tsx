import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/lib/supabase-types";
import { useToast } from "@/components/ui/use-toast";

type UserProfile = Tables<"users"> & { is_admin?: boolean };

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    inviteCode?: string,
  ) => Promise<{ error: any; data: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize the fetchProfile function to avoid recreating it on each render
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  }, []);

  // Public method to refresh the profile
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (isMounted) {
          const currentSession = data.session;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            await fetchProfile(currentSession.user.id);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      console.log(`Auth state changed: ${event}`);

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      } else {
        setProfile(null);
      }

      setLoading(false);

      // Show toast notifications for auth events
      if (event === "SIGNED_IN") {
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
      } else if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      } else if (event === "USER_UPDATED") {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      } else if (event === "PASSWORD_RECOVERY") {
        toast({
          title: "Password recovery",
          description:
            "Please check your email for password reset instructions.",
        });
      }
    });

    // Check for session timeout and validity
    const sessionTimeoutCheck = setInterval(() => {
      if (!isMounted) return;

      const checkSessionValidity = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;

          const currentSession = data.session;

          // Check if session is expired or invalid
          if (!currentSession && session) {
            console.log("Session expired or invalid, logging out user");
            // Session expired
            setSession(null);
            setUser(null);
            setProfile(null);

            toast({
              title: "Session expired",
              description: "Your session has expired. Please log in again.",
              variant: "destructive",
            });

            // Redirect to login page
            window.location.href = "/login";
          } else if (currentSession) {
            // Check if session is about to expire (within 5 minutes)
            const expiresAt = currentSession.expires_at;
            const expiresAtDate = new Date(expiresAt * 1000);
            const now = new Date();
            const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

            if (expiresAtDate.getTime() - now.getTime() < fiveMinutes) {
              // Refresh the session
              const { error: refreshError } =
                await supabase.auth.refreshSession();
              if (refreshError) {
                console.error("Error refreshing session:", refreshError);
              } else {
                console.log("Session refreshed successfully");
              }
            }
          }
        } catch (error) {
          console.error("Error checking session:", error);
        }
      };

      checkSessionValidity();
    }, 60000); // Check every minute

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearInterval(sessionTimeoutCheck);
    };
  }, [fetchProfile, session, toast]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred during sign in"),
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    inviteCode?: string,
  ) => {
    try {
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            invite_code: inviteCode,
          },
        },
      });

      return { data, error };
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred during sign up"),
      };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      return { error };
    } catch (error) {
      console.error("Unexpected error during Google sign in:", error);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred during Google sign in"),
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during sign out:", error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error("No user logged in") };

    try {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);

      if (!error) {
        await fetchProfile(user.id);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }

      return { error };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred while updating profile"),
      };
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshProfile,
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
