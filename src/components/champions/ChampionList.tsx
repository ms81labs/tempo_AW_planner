import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Search, Plus, Trash, Star, Filter, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useChampions } from "@/hooks/useChampions";
import { useDebounce } from "@/hooks/useDebounce";
import { LoadingSpinner } from "../ui/loading-spinner";
import { createMemoizedComponent } from "../ui/memoized-component";

interface ChampionListProps {
  onSelectChampion?: (
    championName: string,
    championClass: string,
    rarity: string,
    rank: string,
  ) => void;
}

type ChampionRarity = "6-Star" | "7-Star";
type ChampionRank =
  | "Rank 5"
  | "Rank 6 (Ascended)"
  | "Rank 1"
  | "Rank 2"
  | "Rank 3"
  | "Rank 4";

interface Champion {
  id: string;
  name: string;
  class: string;
}

interface UserChampion {
  id: string;
  rarity: ChampionRarity;
  rank: ChampionRank;
  champion_id: string;
  champions: Champion;
}

const ChampionList: React.FC<ChampionListProps> = ({
  onSelectChampion = () => {},
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [activeTab, setActiveTab] = useState("cosmic");
  const [selectedRarity, setSelectedRarity] =
    useState<ChampionRarity>("6-Star");
  const [selectedRank, setSelectedRank] = useState<ChampionRank>("Rank 5");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newChampionId, setNewChampionId] = useState("");
  const [newChampionName, setNewChampionName] = useState("");
  const [newChampionClass, setNewChampionClass] = useState("cosmic");
  const [newChampionRarity, setNewChampionRarity] =
    useState<ChampionRarity>("6-Star");
  const [newChampionRank, setNewChampionRank] =
    useState<ChampionRank>("Rank 5");
  const [loading, setLoading] = useState(true);
  const [champions, setChampions] = useState<Record<string, Champion[]>>({});
  const [userChampions, setUserChampions] = useState<UserChampion[]>([]);

  // Class colors for badges
  const classColors = {
    cosmic: "bg-indigo-100 text-indigo-800",
    mutant: "bg-yellow-100 text-yellow-800",
    mystic: "bg-purple-100 text-purple-800",
    science: "bg-green-100 text-green-800",
    skill: "bg-red-100 text-red-800",
    tech: "bg-blue-100 text-blue-800",
  };

  // Rarity colors and styles
  const rarityStyles = {
    "6-Star": "bg-amber-100 text-amber-800 border-amber-300",
    "7-Star": "bg-red-100 text-red-800 border-red-300",
  };

  // Fetch champions and user champions on component mount
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch champions by class
        const { data: championsData, error: championsError } = await supabase
          .from("champions")
          .select("*")
          .order("name");

        if (championsError) throw championsError;

        // Organize champions by class
        const championsByClass: Record<string, Champion[]> = {};
        championsData.forEach((champion: Champion) => {
          if (!championsByClass[champion.class]) {
            championsByClass[champion.class] = [];
          }
          championsByClass[champion.class].push(champion);
        });
        setChampions(championsByClass);

        // Fetch user's champions
        const { data: userChampionsData, error: userChampionsError } =
          await supabase
            .from("user_champions")
            .select(
              `
            id,
            rarity,
            rank,
            champion_id,
            champions:champion_id(id, name, class)
          `,
            )
            .eq("user_id", user.id);

        if (userChampionsError) throw userChampionsError;

        setUserChampions(userChampionsData as UserChampion[]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load champions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  // Get valid ranks for selected rarity
  const getValidRanks = (): ChampionRank[] => {
    if (selectedRarity === "6-Star") {
      return ["Rank 5", "Rank 6 (Ascended)"];
    } else {
      return ["Rank 1", "Rank 2", "Rank 3", "Rank 4"];
    }
  };

  // Filter champions based on search query
  const filteredAvailableChampions = useMemo(() => {
    return (champions[activeTab] || []).filter((champion) =>
      champion.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
    );
  }, [champions, activeTab, debouncedSearchQuery]);

  // Filter user champions based on search query, class and selected rarity
  const filteredUserChampions = useMemo(() => {
    return userChampions.filter((userChampion) => {
      const nameMatch = userChampion.champions.name
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());
      const classMatch = userChampion.champions.class === activeTab;
      const rarityMatch = userChampion.rarity === selectedRarity;
      return nameMatch && classMatch && rarityMatch;
    });
  }, [userChampions, debouncedSearchQuery, activeTab, selectedRarity]);

  // Add a champion to user's collection
  const handleAddChampion = async () => {
    if (!user || !newChampionId) return;

    try {
      // Show loading toast
      toast({
        title: "Adding champion",
        description:
          "Please wait while we add the champion to your collection.",
      });

      const { data, error } = await supabase.from("user_champions").insert({
        user_id: user.id,
        champion_id: newChampionId,
        rarity: newChampionRarity,
        rank: newChampionRank,
      }).select(`
          id,
          rarity,
          rank,
          champion_id,
          champions:champion_id(id, name, class)
        `);

      if (error) throw error;

      setUserChampions([...userChampions, data[0] as UserChampion]);
      toast({
        title: "Success",
        description: `${newChampionName} added to your collection.`,
      });

      // Reset form
      setNewChampionId("");
      setNewChampionName("");
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error adding champion:", error);
      toast({
        title: "Error",
        description: "Failed to add champion. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Remove a champion from user's collection
  const handleRemoveChampion = async (userChampionId: string) => {
    // Store champion for potential restoration
    const championToRemove = userChampions.find((c) => c.id === userChampionId);
    if (!championToRemove) return;

    // Optimistically update UI
    setUserChampions((prev) => prev.filter((c) => c.id !== userChampionId));

    try {
      const { error } = await supabase
        .from("user_champions")
        .delete()
        .eq("id", userChampionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Champion removed from your collection.",
      });
    } catch (error) {
      console.error("Error removing champion:", error);

      // Restore champion on error
      setUserChampions((prev) => [...prev, championToRemove]);

      toast({
        title: "Error",
        description: "Failed to remove champion. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-full bg-white overflow-hidden flex flex-col">
        <CardHeader className="pb-2 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">MCOC Champion List</CardTitle>
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </CardHeader>
        <div className="p-4 border-b">
          <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <LoadingSpinner size="lg" text="Loading champions..." />
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-white overflow-hidden flex flex-col">
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">MCOC Champion List</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={selectedRarity}
              onValueChange={(value) =>
                setSelectedRarity(value as ChampionRarity)
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6-Star">6-Star</SelectItem>
                <SelectItem value="7-Star">7-Star</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedRank}
              onValueChange={(value) => setSelectedRank(value as ChampionRank)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rank" />
              </SelectTrigger>
              <SelectContent>
                {getValidRanks().map((rank) => (
                  <SelectItem key={rank} value={rank}>
                    {rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" /> Add Champion
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Champion to Collection</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="champion-class" className="text-right">
                      Class:
                    </label>
                    <Select
                      value={newChampionClass}
                      onValueChange={setNewChampionClass}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cosmic">Cosmic</SelectItem>
                        <SelectItem value="mutant">Mutant</SelectItem>
                        <SelectItem value="mystic">Mystic</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="skill">Skill</SelectItem>
                        <SelectItem value="tech">Tech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="champion-name" className="text-right">
                      Champion:
                    </label>
                    <Select
                      value={newChampionId}
                      onValueChange={(value) => {
                        setNewChampionId(value);
                        const champion = champions[newChampionClass]?.find(
                          (c) => c.id === value,
                        );
                        if (champion) {
                          setNewChampionName(champion.name);
                        }
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select champion" />
                      </SelectTrigger>
                      <SelectContent>
                        {champions[newChampionClass]?.map((champion) => (
                          <SelectItem key={champion.id} value={champion.id}>
                            {champion.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="champion-rarity" className="text-right">
                      Rarity:
                    </label>
                    <Select
                      value={newChampionRarity}
                      onValueChange={(value) => {
                        setNewChampionRarity(value as ChampionRarity);
                        // Reset rank when rarity changes
                        if (value === "6-Star") {
                          setNewChampionRank("Rank 5");
                        } else {
                          setNewChampionRank("Rank 1");
                        }
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select rarity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6-Star">6-Star</SelectItem>
                        <SelectItem value="7-Star">7-Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="champion-rank" className="text-right">
                      Rank:
                    </label>
                    <Select
                      value={newChampionRank}
                      onValueChange={(value) =>
                        setNewChampionRank(value as ChampionRank)
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select rank" />
                      </SelectTrigger>
                      <SelectContent>
                        {newChampionRarity === "6-Star" ? (
                          <>
                            <SelectItem value="Rank 5">Rank 5</SelectItem>
                            <SelectItem value="Rank 6 (Ascended)">
                              Rank 6 (Ascended)
                            </SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="Rank 1">Rank 1</SelectItem>
                            <SelectItem value="Rank 2">Rank 2</SelectItem>
                            <SelectItem value="Rank 3">Rank 3</SelectItem>
                            <SelectItem value="Rank 4">Rank 4</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleAddChampion}
                    disabled={!newChampionId}
                  >
                    Add to Collection
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search champions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-6 px-4 py-2 border-b">
          <TabsTrigger value="cosmic">Cosmic</TabsTrigger>
          <TabsTrigger value="mutant">Mutant</TabsTrigger>
          <TabsTrigger value="mystic">Mystic</TabsTrigger>
          <TabsTrigger value="science">Science</TabsTrigger>
          <TabsTrigger value="skill">Skill</TabsTrigger>
          <TabsTrigger value="tech">Tech</TabsTrigger>
        </TabsList>

        {Object.keys(classColors).map((championClass) => (
          <TabsContent
            key={championClass}
            value={championClass}
            className="flex-1 p-4 overflow-auto"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Star className="h-5 w-5 text-amber-500 mr-2" />
                Your{" "}
                {championClass.charAt(0).toUpperCase() +
                  championClass.slice(1)}{" "}
                Champions
              </h3>

              {filteredUserChampions.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {filteredUserChampions.map((userChampion) => (
                    <div
                      key={userChampion.id}
                      className={`p-3 border-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors ${rarityStyles[userChampion.rarity]}`}
                      onClick={() =>
                        onSelectChampion(
                          userChampion.champions.name,
                          userChampion.champions.class,
                          userChampion.rarity,
                          userChampion.rank,
                        )
                      }
                    >
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex justify-between w-full">
                          <Badge
                            variant="secondary"
                            className={
                              classColors[
                                userChampion.champions
                                  .class as keyof typeof classColors
                              ]
                            }
                          >
                            {userChampion.champions.class
                              .charAt(0)
                              .toUpperCase() +
                              userChampion.champions.class.slice(1)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveChampion(userChampion.id);
                            }}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-medium">
                          {userChampion.champions.name}
                        </span>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {userChampion.rarity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {userChampion.rank}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <p className="text-gray-500">
                    No {selectedRarity} champions in your collection. Add some
                    champions!
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">
                Available Champions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {filteredAvailableChampions.map((champion) => (
                  <div
                    key={champion.id}
                    className="p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setNewChampionId(champion.id);
                      setNewChampionName(champion.name);
                      setNewChampionClass(champion.class);
                      setShowAddDialog(true);
                    }}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <Badge
                        variant="secondary"
                        className={
                          classColors[championClass as keyof typeof classColors]
                        }
                      >
                        {championClass.charAt(0).toUpperCase() +
                          championClass.slice(1)}
                      </Badge>
                      <span className="text-sm font-medium">
                        {champion.name}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-1 h-6 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add to Collection
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAvailableChampions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <p className="text-gray-500">
                    No champions found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredAvailableChampions.length} available champions
          </div>
          <div className="text-sm text-gray-500">
            Your collection: {filteredUserChampions.length} {selectedRarity}{" "}
            champions
          </div>
        </div>
      </div>
    </Card>
  );
};

// Use memoization to prevent unnecessary re-renders
export default createMemoizedComponent(ChampionList);
