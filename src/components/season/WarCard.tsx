import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Trophy, Shield, Star, TrendingUp, TrendingDown } from "lucide-react";

interface WarCardProps {
  opponent?: string;
  result?: "win" | "loss" | "draw" | "upcoming";
  score?: {
    alliance: number;
    opponent: number;
  };
  date?: string;
  tier?: number;
  metrics?: {
    defensiveKills: number;
    nodesCleared: number;
    mvp?: string;
  };
}

const WarCard = ({
  opponent = "The Avengers",
  result = "win",
  score = { alliance: 1250, opponent: 980 },
  date = "2023-06-15",
  tier = 3,
  metrics = {
    defensiveKills: 24,
    nodesCleared: 45,
    mvp: "Iron Man",
  },
}: WarCardProps) => {
  // Determine card border color based on result
  const resultColors = {
    win: "border-green-500",
    loss: "border-red-500",
    draw: "border-yellow-500",
    upcoming: "border-blue-500",
  };

  // Determine badge color based on result
  const resultBadgeVariants = {
    win: "bg-green-100 text-green-800",
    loss: "bg-red-100 text-red-800",
    draw: "bg-yellow-100 text-yellow-800",
    upcoming: "bg-blue-100 text-blue-800",
  };

  // Format the result text
  const resultText = {
    win: "Victory",
    loss: "Defeat",
    draw: "Draw",
    upcoming: "Upcoming",
  };

  return (
    <Card
      className={`w-full max-w-[320px] h-[200px] bg-white ${resultColors[result]} border-2`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">{opponent}</CardTitle>
          <Badge className={`${resultBadgeVariants[result]}`}>
            {resultText[result]}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {date} • Tier {tier}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        {result !== "upcoming" ? (
          <div className="flex justify-between items-center mb-2">
            <div className="text-center">
              <p className="text-sm font-medium">Our Score</p>
              <p className="text-xl font-bold">{score.alliance}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Their Score</p>
              <p className="text-xl font-bold">{score.opponent}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-12">
            <p className="text-sm text-gray-500">Match scheduled</p>
          </div>
        )}

        {result !== "upcoming" && (
          <div className="grid grid-cols-3 gap-1 mt-2">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-xs">{metrics.defensiveKills} Kills</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-xs">{metrics.nodesCleared} Nodes</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="text-xs truncate">{metrics.mvp}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full flex justify-end">
          <p className="text-xs text-gray-500">
            {result === "win" && (
              <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
            )}
            {result === "loss" && (
              <TrendingDown className="h-3 w-3 inline mr-1 text-red-500" />
            )}
            {score.alliance - score.opponent !== 0 &&
              result !== "upcoming" &&
              `${Math.abs(score.alliance - score.opponent)} point ${score.alliance > score.opponent ? "advantage" : "deficit"}`}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WarCard;
