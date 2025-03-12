import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Shield, Swords, Save, Download, Upload, Users } from "lucide-react";
import WarMap from "./WarMap";

interface Champion {
  id: string;
  name: string;
  image: string;
  class: "Tech" | "Mutant" | "Skill" | "Science" | "Mystic" | "Cosmic";
  owner: string;
}

interface Node {
  id: number;
  position: "left" | "center" | "right";
  pathType: "A" | "B" | "C" | "boss" | "bottleneck";
  pathNumber: number;
  color: string;
  assignedChampion?: Champion;
  attackingChampion?: Champion;
  comment?: string;
}

interface WarMapManagerProps {
  battlegroups?: Array<{
    id: string;
    name: string;
    members: Array<{
      id: string;
      name: string;
      champions: Champion[];
    }>;
  }>;
  onSave?: (defenseNodes: Node[], attackNodes: Node[]) => void;
}

const WarMapManager: React.FC<WarMapManagerProps> = ({
  battlegroups = [
    {
      id: "bg-1",
      name: "Battlegroup 1",
      members: [
        {
          id: "member-1",
          name: "IronMan616",
          champions: [
            {
              id: "champ-1",
              name: "Doctor Doom",
              class: "Mystic",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=doom",
              owner: "IronMan616",
            },
            {
              id: "champ-2",
              name: "Ghost",
              class: "Tech",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ghost",
              owner: "IronMan616",
            },
          ],
        },
        {
          id: "member-2",
          name: "ThanosSnap",
          champions: [
            {
              id: "champ-3",
              name: "Corvus Glaive",
              class: "Cosmic",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=corvus",
              owner: "ThanosSnap",
            },
            {
              id: "champ-4",
              name: "Nick Fury",
              class: "Skill",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fury",
              owner: "ThanosSnap",
            },
          ],
        },
      ],
    },
    {
      id: "bg-2",
      name: "Battlegroup 2",
      members: [
        {
          id: "member-3",
          name: "WebSlinger",
          champions: [
            {
              id: "champ-5",
              name: "Apocalypse",
              class: "Mutant",
              image:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=apocalypse",
              owner: "WebSlinger",
            },
            {
              id: "champ-6",
              name: "Captain America",
              class: "Science",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=capiw",
              owner: "WebSlinger",
            },
          ],
        },
      ],
    },
  ],
  onSave = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("defense");
  const [selectedBattlegroup, setSelectedBattlegroup] = useState(
    battlegroups[0]?.id || "",
  );
  const [defenseNodes, setDefenseNodes] = useState<Node[]>(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      position: "center",
      pathType: "A",
      pathNumber: 1,
      color: "#ffffff",
    })),
  );
  const [attackNodes, setAttackNodes] = useState<Node[]>(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      position: "center",
      pathType: "A",
      pathNumber: 1,
      color: "#ffffff",
    })),
  );
  const [defenseMapLocked, setDefenseMapLocked] = useState(false);
  const [attackMapLocked, setAttackMapLocked] = useState(false);

  // Get all champions from the selected battlegroup
  const availableChampions =
    battlegroups
      .find((bg) => bg.id === selectedBattlegroup)
      ?.members.flatMap((member) => member.champions) || [];

  // Handle saving defense nodes
  const handleSaveDefenseNodes = (nodes: Node[]) => {
    setDefenseNodes(nodes);
  };

  // Handle saving attack nodes
  const handleSaveAttackNodes = (nodes: Node[]) => {
    setAttackNodes(nodes);
  };

  // Handle saving all map data
  const handleSaveAllMaps = () => {
    onSave(defenseNodes, attackNodes);
  };

  // Calculate stats
  const defenseAssignedCount = defenseNodes.filter(
    (node) => node.assignedChampion,
  ).length;
  const attackAssignedCount = attackNodes.filter(
    (node) => node.attackingChampion,
  ).length;

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <Card className="w-full border-b rounded-none">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              {activeTab === "defense" ? (
                <Shield className="h-6 w-6 text-primary" />
              ) : (
                <Swords className="h-6 w-6 text-primary" />
              )}
              <CardTitle>Alliance War Map Manager</CardTitle>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select
                value={selectedBattlegroup}
                onChange={(e) => setSelectedBattlegroup(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                {battlegroups.map((bg) => (
                  <option key={bg.id} value={bg.id}>
                    {bg.name}
                  </option>
                ))}
              </select>

              <Button onClick={handleSaveAllMaps} className="gap-2">
                <Save className="h-4 w-4" />
                Save Maps
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="border-b px-4">
            <TabsList className="mt-2">
              <TabsTrigger value="defense" className="gap-2">
                <Shield className="h-4 w-4" />
                Defense Map
              </TabsTrigger>
              <TabsTrigger value="attack" className="gap-2">
                <Swords className="h-4 w-4" />
                Attack Map
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="defense" className="h-full m-0 p-4">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      <Users className="h-3 w-3 mr-1" />
                      {
                        battlegroups.find((bg) => bg.id === selectedBattlegroup)
                          ?.name
                      }
                    </Badge>
                    <Badge variant="outline">
                      {defenseAssignedCount}/50 Nodes Assigned
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-3 w-3" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Upload className="h-3 w-3" />
                      Import
                    </Button>
                  </div>
                </div>

                <div className="flex-1">
                  <WarMap
                    mode="defense"
                    nodes={defenseNodes}
                    availableChampions={availableChampions}
                    onSave={handleSaveDefenseNodes}
                    isLocked={defenseMapLocked}
                    onLockToggle={setDefenseMapLocked}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attack" className="h-full m-0 p-4">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      <Users className="h-3 w-3 mr-1" />
                      {
                        battlegroups.find((bg) => bg.id === selectedBattlegroup)
                          ?.name
                      }
                    </Badge>
                    <Badge variant="outline">
                      {attackAssignedCount}/50 Nodes Assigned
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-3 w-3" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Upload className="h-3 w-3" />
                      Import
                    </Button>
                  </div>
                </div>

                <div className="flex-1">
                  <WarMap
                    mode="attack"
                    nodes={attackNodes}
                    availableChampions={availableChampions}
                    onSave={handleSaveAttackNodes}
                    isLocked={attackMapLocked}
                    onLockToggle={setAttackMapLocked}
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default WarMapManager;
