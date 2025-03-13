import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Trophy, Shield, Target } from "lucide-react";

interface WarCardProps {
  opponent: string;
  result: "win" | "loss" | "draw" | "upcoming";
  score?: {
    alliance: number;
    opponent: number;
  };
  date: string;
  tier: number;
  metrics?: {
    defensiveKills: number;
    nodesCleared: number;
    mvp?: string;
  };
}

const WarCard: React.FC<WarCardProps> = ({
  opponent,
  result,
  score,
  date,
  tier,
  metrics,
}) => {
  // Determine result badge styling
  const getResultBadge = () => {
    switch (result) {
      case "win":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Victory
          </Badge>
        );
      case "loss":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Defeat
          </Badge>
        );
      case "draw":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Draw
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Upcoming
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex justify-between items-start">
        <div>
          <div className="font-bold text-lg">{opponent}</div>
          <div className="text-sm text-muted-foreground">{date}</div>
        </div>
        {getResultBadge()}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Score display for completed wars */}
          {score && (
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Score</div>
              <div className="font-bold">
                {score.alliance} - {score.opponent}
              </div>
            </div>
          )}

          {/* Tier information */}
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Tier</div>
            <Badge variant="outline">{tier}</Badge>
          </div>

          {/* Performance metrics for completed wars */}
          {metrics && (
            <div className="pt-2 mt-2 border-t space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs">
                  <Shield className="h-3 w-3 mr-1 text-blue-500" />
                  <span>Defensive Kills</span>
                </div>
                <span className="text-xs font-medium">
                  {metrics.defensiveKills}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs">
                  <Target className="h-3 w-3 mr-1 text-red-500" />
                  <span>Nodes Cleared</span>
                </div>
                <span className="text-xs font-medium">
                  {metrics.nodesCleared}
                </span>
              </div>

              {metrics.mvp && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs">
                    <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                    <span>MVP</span>
                  </div>
                  <span className="text-xs font-medium">{metrics.mvp}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WarCard;
