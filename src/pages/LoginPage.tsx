import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    inviteCode: string,
  ) => {
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm
          onLogin={handleLogin}
          onRegister={handleRegister}
          onGoogleLogin={handleGoogleLogin}
          isLoading={loading}
        />
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} MCOC Alliance War Planner</p>
        <p className="mt-1">
          A strategic tool for Marvel Contest of Champions alliances
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
