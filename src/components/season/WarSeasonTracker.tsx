import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Filter,
  Plus,
  Search,
  Trophy,
} from "lucide-react";
import WarCard from "./WarCard";
import PerformanceChart from "./PerformanceChart";

interface War {
  id: string;
  opponent: string;
  result: "win" | "loss" | "draw" | "upcoming";
  score?: {
    alliance: number;
    opponent: number;
  };
  date: Date;
  tier: number;
  metrics?: {
    defensiveKills: number;
    nodesCleared: number;
    mvp?: string;
  };
}

interface WarSeasonTrackerProps {
  seasonId?: string;
  wars?: War[];
  onAddWar?: (war: Partial<War>) => void;
  onFilterChange?: (filters: any) => void;
}

const WarSeasonTracker: React.FC<WarSeasonTrackerProps> = ({
  seasonId = "season-2023-06",
  wars = defaultWars,
  onAddWar = () => {},
  onFilterChange = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Filter wars based on search query and result filter
  const filteredWars = wars.filter((war) => {
    const matchesSearch = war.opponent
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesResult = resultFilter === "all" || war.result === resultFilter;
    return matchesSearch && matchesResult;
  });

  // Calculate season statistics
  const totalWars = wars.length;
  const completedWars = wars.filter((war) => war.result !== "upcoming").length;
  const wins = wars.filter((war) => war.result === "win").length;
  const losses = wars.filter((war) => war.result === "loss").length;
  const draws = wars.filter((war) => war.result === "draw").length;
  const winRate =
    completedWars > 0 ? Math.round((wins / completedWars) * 100) : 0;

  return (
    <div className="w-full h-full bg-white p-6 overflow-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">War Season Tracker</h1>
            <p className="text-muted-foreground">
              Track and analyze your alliance's performance across the war
              season
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              Season: {seasonId}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              {completedWars}/{totalWars} Wars Completed
            </Badge>
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              {winRate}% Win Rate
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wars">Wars</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Wars
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalWars}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalWars - completedWars} upcoming
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Wins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {wins}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((wins / Math.max(completedWars, 1)) * 100).toFixed(1)}% of
                    completed wars
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Losses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {losses}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((losses / Math.max(completedWars, 1)) * 100).toFixed(1)}%
                    of completed wars
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Draws</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {draws}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((draws / Math.max(completedWars, 1)) * 100).toFixed(1)}%
                    of completed wars
                  </p>
                </CardContent>
              </Card>
            </div>

            <PerformanceChart />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Wars</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("wars")}
                >
                  View All Wars
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wars
                  .slice()
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .slice(0, 4)
                  .map((war) => (
                    <WarCard
                      key={war.id}
                      opponent={war.opponent}
                      result={war.result}
                      score={war.score}
                      date={format(war.date, "yyyy-MM-dd")}
                      tier={war.tier}
                      metrics={war.metrics}
                    />
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wars" className="space-y-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alliances..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="win">Wins</SelectItem>
                    <SelectItem value="loss">Losses</SelectItem>
                    <SelectItem value="draw">Draws</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full md:w-auto justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button className="w-full md:w-auto" onClick={() => onAddWar({})}>
                <Plus className="mr-2 h-4 w-4" /> Add War
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredWars.length > 0 ? (
                filteredWars
                  .slice()
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((war) => (
                    <WarCard
                      key={war.id}
                      opponent={war.opponent}
                      result={war.result}
                      score={war.score}
                      date={format(war.date, "yyyy-MM-dd")}
                      tier={war.tier}
                      metrics={war.metrics}
                    />
                  ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No wars found</h3>
                  <p className="text-muted-foreground mt-1">
                    No wars match your current filters. Try adjusting your
                    search criteria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Performance Analytics</h2>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter Data
              </Button>
            </div>

            <PerformanceChart />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Defense Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                    Defense performance chart placeholder
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Attack Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                    Attack performance chart placeholder
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Default mock data
const defaultWars: War[] = [
  {
    id: "war-1",
    opponent: "The Avengers",
    result: "win",
    score: { alliance: 1250, opponent: 980 },
    date: new Date("2023-06-01"),
    tier: 3,
    metrics: { defensiveKills: 24, nodesCleared: 45, mvp: "Iron Man" },
  },
  {
    id: "war-2",
    opponent: "X-Men Elite",
    result: "win",
    score: { alliance: 1320, opponent: 1150 },
    date: new Date("2023-06-08"),
    tier: 3,
    metrics: { defensiveKills: 28, nodesCleared: 48, mvp: "Captain America" },
  },
  {
    id: "war-3",
    opponent: "Guardians of Galaxy",
    result: "loss",
    score: { alliance: 980, opponent: 1200 },
    date: new Date("2023-06-15"),
    tier: 3,
    metrics: { defensiveKills: 18, nodesCleared: 40, mvp: "Star-Lord" },
  },
  {
    id: "war-4",
    opponent: "Wakanda Forever",
    result: "win",
    score: { alliance: 1400, opponent: 1100 },
    date: new Date("2023-06-22"),
    tier: 3,
    metrics: { defensiveKills: 30, nodesCleared: 50, mvp: "Black Panther" },
  },
  {
    id: "war-5",
    opponent: "Asgardians",
    result: "draw",
    score: { alliance: 1200, opponent: 1200 },
    date: new Date("2023-06-29"),
    tier: 3,
    metrics: { defensiveKills: 25, nodesCleared: 45, mvp: "Thor" },
  },
  {
    id: "war-6",
    opponent: "Fantastic Four",
    result: "win",
    score: { alliance: 1350, opponent: 1050 },
    date: new Date("2023-07-06"),
    tier: 3,
    metrics: { defensiveKills: 27, nodesCleared: 47, mvp: "Mr. Fantastic" },
  },
  {
    id: "war-7",
    opponent: "Brotherhood",
    result: "loss",
    score: { alliance: 1050, opponent: 1300 },
    date: new Date("2023-07-13"),
    tier: 3,
    metrics: { defensiveKills: 20, nodesCleared: 42, mvp: "Magneto" },
  },
  {
    id: "war-8",
    opponent: "Illuminati",
    result: "upcoming",
    date: new Date("2023-07-20"),
    tier: 3,
  },
  {
    id: "war-9",
    opponent: "Defenders",
    result: "upcoming",
    date: new Date("2023-07-27"),
    tier: 3,
  },
  {
    id: "war-10",
    opponent: "Inhumans",
    result: "upcoming",
    date: new Date("2023-08-03"),
    tier: 3,
  },
  {
    id: "war-11",
    opponent: "Eternals",
    result: "upcoming",
    date: new Date("2023-08-10"),
    tier: 3,
  },
  {
    id: "war-12",
    opponent: "Midnight Sons",
    result: "upcoming",
    date: new Date("2023-08-17"),
    tier: 3,
  },
];

export default WarSeasonTracker;
