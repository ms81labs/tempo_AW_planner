import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Shield, User, Upload, FileText } from "lucide-react";
import ChampionCard from "../champions/ChampionCard";
import ClassFilter from "../champions/ClassFilter";

// Define ChampionClass type locally since we can't import it
type ChampionClass =
  | "Tech"
  | "Mutant"
  | "Skill"
  | "Science"
  | "Mystic"
  | "Cosmic"
  | "All";

interface Assignment {
  nodeId: string;
  nodeName: string;
  championId: string;
  championName: string;
  championClass: ChampionClass;
  championImage: string;
}

interface Champion {
  id: string;
  name: string;
  championClass: ChampionClass;
  rating: number;
  stars: number;
  image: string;
}

interface MemberDashboardProps {
  username?: string;
  assignments?: Assignment[];
  champions?: Champion[];
  onUploadChampions?: () => void;
  onManageRoster?: () => void;
  onViewAssignments?: () => void;
}

const MemberDashboard = ({
  username = "SummonerUser",
  assignments = [
    {
      nodeId: "node-1",
      nodeName: "Entrance Node",
      championId: "champ-1",
      championName: "Iron Man",
      championClass: "Tech",
      championImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=ironman",
    },
    {
      nodeId: "node-7",
      nodeName: "Power Lock",
      championId: "champ-2",
      championName: "Vision",
      championClass: "Tech",
      championImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=vision",
    },
    {
      nodeId: "node-10",
      nodeName: "Debuff Immunity",
      championId: "champ-3",
      championName: "Captain America",
      championClass: "Science",
      championImage:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=captainamerica",
    },
    {
      nodeId: "node-15",
      nodeName: "Exit Node",
      championId: "champ-4",
      championName: "Doctor Strange",
      championClass: "Mystic",
      championImage:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=drstrange",
    },
  ],
  champions = [
    {
      id: "champ-1",
      name: "Iron Man",
      championClass: "Tech",
      rating: 5000,
      stars: 5,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ironman",
    },
    {
      id: "champ-2",
      name: "Vision",
      championClass: "Tech",
      rating: 4800,
      stars: 5,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=vision",
    },
    {
      id: "champ-3",
      name: "Captain America",
      championClass: "Science",
      rating: 5200,
      stars: 5,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=captainamerica",
    },
    {
      id: "champ-4",
      name: "Doctor Strange",
      championClass: "Mystic",
      rating: 4900,
      stars: 5,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=drstrange",
    },
    {
      id: "champ-5",
      name: "Black Widow",
      championClass: "Skill",
      rating: 4700,
      stars: 5,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=blackwidow",
    },
    {
      id: "champ-6",
      name: "Thor",
      championClass: "Cosmic",
      rating: 5100,
      stars: 5,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=thor",
    },
    {
      id: "champ-7",
      name: "Wolverine",
      championClass: "Mutant",
      rating: 5300,
      stars: 5,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=wolverine",
    },
    {
      id: "champ-8",
      name: "Hulk",
      championClass: "Science",
      rating: 5400,
      stars: 5,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=hulk",
    },
  ],
  onUploadChampions = () => console.log("Upload champions clicked"),
  onManageRoster = () => console.log("Manage roster clicked"),
  onViewAssignments = () => console.log("View assignments clicked"),
}: MemberDashboardProps) => {
  const [selectedClasses, setSelectedClasses] = React.useState<ChampionClass[]>(
    ["All"],
  );

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

  const clearFilters = () => {
    setSelectedClasses(["All"]);
  };

  const filteredChampions = champions.filter((champion) => {
    if (selectedClasses.includes("All")) return true;
    return selectedClasses.includes(champion.championClass);
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {username}</h1>
          <p className="text-gray-500 mt-1">
            Manage your champion roster and view your defense assignments
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onUploadChampions}
          >
            <Upload size={16} />
            Upload Champions
          </Button>
          <Button className="flex items-center gap-2" onClick={onManageRoster}>
            <User size={16} />
            Manage Roster
          </Button>
        </div>
      </div>

      <Tabs defaultValue="champions" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="champions" className="flex items-center gap-2">
            <User size={16} />
            My Champions
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Shield size={16} />
            Defense Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="champions" className="space-y-6">
          <ClassFilter
            selectedClasses={selectedClasses}
            onClassToggle={handleClassToggle}
            onClearFilters={clearFilters}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredChampions.length > 0 ? (
              filteredChampions.map((champion) => (
                <ChampionCard
                  key={champion.id}
                  name={champion.name}
                  image={champion.image}
                  championClass={champion.championClass}
                  rating={champion.rating}
                  stars={champion.stars}
                />
              ))
            ) : (
              <div className="col-span-full p-8 text-center bg-white rounded-lg border">
                <p className="text-gray-500 mb-4">
                  No champions match your selected filters
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {champions.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border">
              <User size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Champions Found</h3>
              <p className="text-gray-500 text-center mb-6">
                You haven't added any champions to your roster yet. Upload your
                champions to get started.
              </p>
              <Button
                onClick={onUploadChampions}
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Upload Champions
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          {assignments.length > 0 ? (
            <>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} className="text-primary" />
                    Your Defense Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.nodeId}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                            <img
                              src={assignment.championImage}
                              alt={assignment.championName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {assignment.championName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {assignment.championClass}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{assignment.nodeName}</p>
                          <p className="text-sm text-gray-500">
                            Node {assignment.nodeId.split("-")[1]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={onViewAssignments}
                >
                  <FileText size={16} />
                  View Full Defense Map
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border">
              <Shield size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Assignments Yet</h3>
              <p className="text-gray-500 text-center mb-6">
                You haven't been assigned any defense nodes yet. Check back
                later or contact your alliance officer.
              </p>
              <Button
                variant="outline"
                onClick={onViewAssignments}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                View Defense Map
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberDashboard;
