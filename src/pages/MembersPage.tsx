import React from "react";
import Header from "../components/layout/Header";
import MemberList from "../components/members/MemberList";

const MembersPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header userRole="officer" />

      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-140px)]">
          <MemberList />
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
