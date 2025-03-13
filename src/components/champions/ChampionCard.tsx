import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";

type ChampionClass =
  | "Tech"
  | "Mutant"
  | "Skill"
  | "Science"
  | "Mystic"
  | "Cosmic";

interface ChampionCardProps {
  name?: string;
  image?: string;
  championClass?: ChampionClass;
  rating?: number;
  stars?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

const getClassColor = (championClass: ChampionClass): string => {
  const colors = {
    Tech: "bg-blue-100 text-blue-800",
    Mutant: "bg-yellow-100 text-yellow-800",
    Skill: "bg-red-100 text-red-800",
    Science: "bg-green-100 text-green-800",
    Mystic: "bg-purple-100 text-purple-800",
    Cosmic: "bg-pink-100 text-pink-800",
  };
  return colors[championClass];
};

const ChampionCard: React.FC<ChampionCardProps> = ({
  name = "Champion Name",
  image = "https://api.dicebear.com/7.x/avataaars/svg?seed=champion",
  championClass = "Cosmic",
  rating = 5000,
  stars = 5,
  isSelected = false,
  onClick = () => {},
}) => {
  return (
    <Card
      className={`w-44 h-64 cursor-pointer transition-all duration-200 bg-white ${isSelected ? "ring-2 ring-primary scale-105" : "hover:shadow-lg"}`}
      onClick={onClick}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <Badge className={`${getClassColor(championClass)}`}>
            {championClass}
          </Badge>
          <div className="text-amber-500 font-bold">{"★".repeat(stars)}</div>
        </div>
      </CardHeader>
      <CardContent className="p-3 flex flex-col items-center">
        <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100 mb-2">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <h3 className="font-bold text-center text-sm mt-1 line-clamp-1">
          {name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Rating: {rating.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(ChampionCard, (prevProps, nextProps) => {
  // Custom comparison function to determine if component should re-render
  return (
    prevProps.name === nextProps.name &&
    prevProps.image === nextProps.image &&
    prevProps.championClass === nextProps.championClass &&
    prevProps.rating === nextProps.rating &&
    prevProps.stars === nextProps.stars &&
    prevProps.isSelected === nextProps.isSelected
  );
});
