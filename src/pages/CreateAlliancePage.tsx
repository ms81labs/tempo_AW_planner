import React from "react";
import { useNavigate } from "react-router-dom";
import CreateAllianceForm from "../components/alliance/CreateAllianceForm";
import { useAuth } from "../contexts/AuthContext";

const CreateAlliancePage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // If user already has an alliance, redirect to dashboard
  if (profile?.alliance_id) {
    navigate("/");
    return null;
  }

  const handleAllianceCreated = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <CreateAllianceForm onSuccess={handleAllianceCreated} />
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

export default CreateAlliancePage;
