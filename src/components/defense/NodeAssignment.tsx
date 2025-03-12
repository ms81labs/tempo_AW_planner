import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Filter, Search, Shield, User, X } from "lucide-react";

interface Champion {
  id: string;
  name: string;
  class: "Tech" | "Mutant" | "Skill" | "Science" | "Mystic" | "Cosmic";
  rating: number;
  imageUrl: string;
}

interface Member {
  id: string;
  name: string;
  champions: Champion[];
  avatarUrl?: string;
}

interface NodeAssignmentProps {
  selectedNodeId?: string;
  members?: Member[];
  onAssign?: (nodeId: string, memberId: string, championId: string) => void;
}

const NodeAssignment = ({
  selectedNodeId = "node-1",
  members = [
    {
      id: "member-1",
      name: "IronMan616",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=IronMan",
      champions: [
        {
          id: "champ-1",
          name: "Doctor Doom",
          class: "Mystic",
          rating: 5,
          imageUrl:
            "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=300&q=80",
        },
        {
          id: "champ-2",
          name: "Magneto",
          class: "Mutant",
          rating: 5,
          imageUrl:
            "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=300&q=80",
        },
        {
          id: "champ-3",
          name: "Captain America",
          class: "Science",
          rating: 4,
          imageUrl:
            "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=300&q=80",
        },
      ],
    },
    {
      id: "member-2",
      name: "ThanosSnap",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thanos",
      champions: [
        {
          id: "champ-4",
          name: "Ghost",
          class: "Tech",
          rating: 5,
          imageUrl:
            "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=300&q=80",
        },
        {
          id: "champ-5",
          name: "Corvus Glaive",
          class: "Cosmic",
          rating: 5,
          imageUrl:
            "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=300&q=80",
        },
      ],
    },
    {
      id: "member-3",
      name: "WebSlinger",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Spider",
      champions: [
        {
          id: "champ-6",
          name: "Nick Fury",
          class: "Skill",
          rating: 5,
          imageUrl:
            "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=300&q=80",
        },
        {
          id: "champ-7",
          name: "Apocalypse",
          class: "Mutant",
          rating: 5,
          imageUrl:
            "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=300&q=80",
        },
      ],
    },
  ],
  onAssign = () => {},
}: NodeAssignmentProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [selectedRating, setSelectedRating] = useState<string>("All");

  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
  };

  const handleAssignChampion = (championId: string) => {
    if (selectedNodeId && selectedMemberId) {
      onAssign(selectedNodeId, selectedMemberId, championId);
    }
  };

  const selectedMember = members.find(
    (member) => member.id === selectedMemberId,
  );

  const filteredChampions =
    selectedMember?.champions.filter((champion) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        champion.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by class
      const matchesClass =
        selectedClass === "All" || champion.class === selectedClass;

      // Filter by rating
      const matchesRating =
        selectedRating === "All" ||
        champion.rating === parseInt(selectedRating);

      return matchesSearch && matchesClass && matchesRating;
    }) || [];

  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="bg-gray-100 border-b">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Node Assignment{" "}
          {selectedNodeId && `- Node ${selectedNodeId.split("-")[1]}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="w-full justify-start px-4 py-2 bg-gray-50">
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-white"
            >
              <User className="h-4 w-4 mr-2" />
              Select Member
            </TabsTrigger>
            <TabsTrigger
              value="champions"
              className="data-[state=active]:bg-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Select Champion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedMemberId === member.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"}`}
                  onClick={() => handleMemberSelect(member.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback>
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-gray-500">
                        {member.champions.length} Champions
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="champions" className="space-y-4">
            {!selectedMemberId ? (
              <div className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium">Select a Member First</h3>
                <p className="text-gray-500">
                  Please select a member to view their available champions
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={selectedMember?.avatarUrl}
                        alt={selectedMember?.name}
                      />
                      <AvatarFallback>
                        {selectedMember?.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedMember?.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedMember?.champions.length} Champions
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => setSelectedMemberId("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search champions..."
                        className="w-full pl-9 pr-4 py-2 border rounded-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-40">
                        <Select
                          value={selectedClass}
                          onValueChange={setSelectedClass}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Classes</SelectItem>
                            <SelectItem value="Tech">Tech</SelectItem>
                            <SelectItem value="Mutant">Mutant</SelectItem>
                            <SelectItem value="Skill">Skill</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Mystic">Mystic</SelectItem>
                            <SelectItem value="Cosmic">Cosmic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-40">
                        <Select
                          value={selectedRating}
                          onValueChange={setSelectedRating}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Ratings</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedClass("All");
                          setSelectedRating("All");
                        }}
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                  {filteredChampions.length > 0 ? (
                    filteredChampions.map((champion) => (
                      <div
                        key={champion.id}
                        className="border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-all"
                        onClick={() => handleAssignChampion(champion.id)}
                      >
                        <div className="relative h-40 bg-gray-100">
                          <img
                            src={champion.imageUrl}
                            alt={champion.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                            {champion.rating}★
                          </div>
                          <div
                            className={`absolute bottom-0 left-0 right-0 py-1 px-2 text-xs text-white ${getClassColor(champion.class)}`}
                          >
                            {champion.class}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium truncate">
                            {champion.name}
                          </h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {champion.rating}-Star
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignChampion(champion.id);
                              }}
                            >
                              Assign
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full p-8 text-center">
                      <p className="text-gray-500">
                        No champions match your filters
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper function to get background color based on champion class
function getClassColor(championClass: string): string {
  switch (championClass) {
    case "Tech":
      return "bg-blue-600";
    case "Mutant":
      return "bg-yellow-600";
    case "Skill":
      return "bg-red-600";
    case "Science":
      return "bg-green-600";
    case "Mystic":
      return "bg-purple-600";
    case "Cosmic":
      return "bg-pink-600";
    default:
      return "bg-gray-600";
  }
}

export default NodeAssignment;
