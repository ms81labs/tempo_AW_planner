import React from "react";
import Header from "../components/layout/Header";
import ChampionList from "../components/champions/ChampionList";

const ChampionListPage = () => {
  const handleSelectChampion = (
    championName: string,
    championClass: string,
    rarity: string,
    rank: string,
  ) => {
    console.log(
      `Selected ${championName} (${championClass}) - ${rarity} ${rank}`,
    );
    // In a real app, you would handle the champion selection here
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header userRole="officer" />

      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-140px)]">
          <ChampionList onSelectChampion={handleSelectChampion} />
        </div>
      </div>
    </div>
  );
};

export default ChampionListPage;
