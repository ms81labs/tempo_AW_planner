import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Upload, Filter, Search, Plus, RefreshCw } from "lucide-react";
import ChampionCard from "./ChampionCard";
import ClassFilter, { ChampionClass } from "./ClassFilter";

interface Champion {
  id: string;
  name: string;
  image: string;
  championClass: ChampionClass;
  rating: number;
  stars: number;
}

interface ChampionRosterProps {
  champions?: Champion[];
  onChampionSelect?: (championId: string) => void;
  onChampionUpload?: (champions: Champion[]) => void;
  selectedChampionIds?: string[];
}

const ChampionRoster = ({
  champions = defaultChampions,
  onChampionSelect = () => {},
  onChampionUpload = () => {},
  selectedChampionIds = [],
}: ChampionRosterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<ChampionClass[]>([
    "All",
  ]);
  const [selectedStars, setSelectedStars] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [filteredChampions, setFilteredChampions] =
    useState<Champion[]>(champions);
  const [activeTab, setActiveTab] = useState("browse");

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = [...champions];

    // Apply search filter
    if (searchQuery) {
      result = result.filter((champion) =>
        champion.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply class filter
    if (!selectedClasses.includes("All")) {
      result = result.filter((champion) =>
        selectedClasses.includes(champion.championClass),
      );
    }

    // Apply stars filter
    if (selectedStars !== "All") {
      const starsNumber = parseInt(selectedStars);
      result = result.filter((champion) => champion.stars === starsNumber);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "stars") {
        return b.stars - a.stars;
      }
      return 0;
    });

    setFilteredChampions(result);
  }, [champions, searchQuery, selectedClasses, selectedStars, sortBy]);

  const handleClassToggle = (championClass: ChampionClass) => {
    if (championClass === "All") {
      setSelectedClasses(["All"]);
      return;
    }

    // Remove "All" if it's in the selected classes
    let newSelectedClasses = selectedClasses.filter((c) => c !== "All");

    // Toggle the selected class
    if (newSelectedClasses.includes(championClass)) {
      newSelectedClasses = newSelectedClasses.filter(
        (c) => c !== championClass,
      );
    } else {
      newSelectedClasses.push(championClass);
    }

    // If no classes are selected, select "All"
    if (newSelectedClasses.length === 0) {
      setSelectedClasses(["All"]);
    } else {
      setSelectedClasses(newSelectedClasses);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedClasses(["All"]);
    setSelectedStars("All");
    setSortBy("rating");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real app, this would process the file and extract champion data
    // For this UI scaffolding, we'll just simulate a successful upload
    setTimeout(() => {
      alert("Champions uploaded successfully!");
      // Here you would call onChampionUpload with the actual data
      onChampionUpload(defaultChampions);
    }, 1000);
  };

  return (
    <Card className="w-full h-full bg-white overflow-hidden flex flex-col">
      <CardHeader className="pb-2 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-2xl font-bold">Champion Roster</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setActiveTab("upload")}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Champions
            </Button>
            <Button
              variant="default"
              onClick={() => setActiveTab("browse")}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="px-4 pt-2 border-b">
          <TabsTrigger value="browse">Browse Champions</TabsTrigger>
          <TabsTrigger value="upload">Upload Champions</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="flex-1 flex flex-col p-0">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search champions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating (High to Low)</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="stars">Stars (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStars} onValueChange={setSelectedStars}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by stars" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Stars</SelectItem>
                    <SelectItem value="6">6 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClearFilters}
                  title="Clear filters"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <ClassFilter
                selectedClasses={selectedClasses}
                onClassToggle={handleClassToggle}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {filteredChampions.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredChampions.map((champion) => (
                  <ChampionCard
                    key={champion.id}
                    name={champion.name}
                    image={champion.image}
                    championClass={champion.championClass}
                    rating={champion.rating}
                    stars={champion.stars}
                    isSelected={selectedChampionIds.includes(champion.id)}
                    onClick={() => onChampionSelect(champion.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No champions found
                </h3>
                <p className="text-gray-500 max-w-md">
                  No champions match your current filters. Try adjusting your
                  search criteria or clear the filters to see all champions.
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {filteredChampions.length} of {champions.length}{" "}
                champions
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium">Selected:</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {selectedChampionIds.length} champions
                </Badge>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="flex-1 p-6">
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 w-full mb-6 hover:border-primary transition-colors">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Upload Champion Roster
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop your champion roster file here, or click to browse
              </p>
              <input
                type="file"
                id="champion-upload"
                className="hidden"
                accept=".csv,.json"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("champion-upload")?.click()
                }
              >
                Browse Files
              </Button>
            </div>

            <div className="w-full">
              <h4 className="font-medium mb-2 text-left">Supported Formats:</h4>
              <ul className="list-disc pl-5 text-left text-sm text-gray-600 space-y-1">
                <li>CSV file with champion data</li>
                <li>JSON export from MCOC companion apps</li>
                <li>Manual entry (coming soon)</li>
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-800 text-sm">
                <h4 className="font-semibold mb-1">Need Help?</h4>
                <p>
                  Check our guide on how to export your champion roster from the
                  game or companion apps.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

// Default champions data for UI scaffolding
const defaultChampions: Champion[] = [
  {
    id: "1",
    name: "Doctor Doom",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=doom",
    championClass: "Mystic",
    rating: 12500,
    stars: 6,
  },
  {
    id: "2",
    name: "Ghost",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ghost",
    championClass: "Tech",
    rating: 11800,
    stars: 5,
  },
  {
    id: "3",
    name: "Corvus Glaive",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=corvus",
    championClass: "Cosmic",
    rating: 11500,
    stars: 5,
  },
  {
    id: "4",
    name: "Nick Fury",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fury",
    championClass: "Skill",
    rating: 11200,
    stars: 5,
  },
  {
    id: "5",
    name: "Apocalypse",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=apocalypse",
    championClass: "Mutant",
    rating: 12000,
    stars: 6,
  },
  {
    id: "6",
    name: "Captain America (IW)",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=capiw",
    championClass: "Science",
    rating: 10800,
    stars: 5,
  },
  {
    id: "7",
    name: "Magneto",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=magneto",
    championClass: "Mutant",
    rating: 10500,
    stars: 5,
  },
  {
    id: "8",
    name: "Archangel",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=archangel",
    championClass: "Mutant",
    rating: 10200,
    stars: 5,
  },
  {
    id: "9",
    name: "Quake",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=quake",
    championClass: "Science",
    rating: 10000,
    stars: 5,
  },
  {
    id: "10",
    name: "Omega Red",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=omegared",
    championClass: "Mutant",
    rating: 9800,
    stars: 5,
  },
  {
    id: "11",
    name: "Hyperion",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=hyperion",
    championClass: "Cosmic",
    rating: 9600,
    stars: 5,
  },
  {
    id: "12",
    name: "Sunspot",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sunspot",
    championClass: "Mutant",
    rating: 9400,
    stars: 5,
  },
];

export default ChampionRoster;
