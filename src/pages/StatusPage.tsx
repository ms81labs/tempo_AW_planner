import React from "react";
import Header from "../components/layout/Header";
import ProjectStatus from "../components/ProjectStatus";

const StatusPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header userRole="officer" />

      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
          <ProjectStatus />
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
