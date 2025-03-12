import React from "react";
import Header from "../components/layout/Header";
import BattlegroupManager from "../components/battlegroups/BattlegroupManager";

const BattlegroupPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header userRole="officer" />

      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-140px)]">
          <BattlegroupManager />
        </div>
      </div>
    </div>
  );
};

export default BattlegroupPage;
