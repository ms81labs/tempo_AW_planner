import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export type ChampionClass =
  | "Tech"
  | "Mutant"
  | "Skill"
  | "Science"
  | "Mystic"
  | "Cosmic"
  | "All";

interface ClassFilterProps {
  selectedClasses?: ChampionClass[];
  onClassToggle?: (championClass: ChampionClass) => void;
  onClearFilters?: () => void;
}

const ClassFilter = ({
  selectedClasses = ["All"],
  onClassToggle = () => {},
  onClearFilters = () => {},
}: ClassFilterProps) => {
  const classes: ChampionClass[] = [
    "All",
    "Tech",
    "Mutant",
    "Skill",
    "Science",
    "Mystic",
    "Cosmic",
  ];

  // Class colors mapping
  const classColors: Record<ChampionClass, string> = {
    All: "bg-gray-700",
    Tech: "bg-blue-600",
    Mutant: "bg-yellow-500",
    Skill: "bg-red-600",
    Science: "bg-green-600",
    Mystic: "bg-purple-600",
    Cosmic: "bg-indigo-600",
  };

  return (
    <div className="w-full bg-gray-100 p-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {classes.map((championClass) => (
            <Badge
              key={championClass}
              className={`${classColors[championClass]} hover:${classColors[championClass]}/90 cursor-pointer px-4 py-2 text-white ${selectedClasses.includes(championClass) ? "ring-2 ring-offset-2 ring-offset-white ring-black" : "opacity-70"}`}
              onClick={() => onClassToggle(championClass)}
            >
              {championClass}
            </Badge>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="whitespace-nowrap"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default ClassFilter;
