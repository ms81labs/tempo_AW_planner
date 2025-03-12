import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Shield, Save, Users, Map, Filter, Info } from "lucide-react";
import DefenseMap from "./DefenseMap";
import NodeAssignment from "./NodeAssignment";

interface DefensePlannerProps {
  battlegroups?: Array<{
    id: string;
    name: string;
  }>;
  onSave?: (battleGroupId: string, defenseData: any) => void;
}

const DefensePlanner = ({
  battlegroups = [
    { id: "bg-1", name: "Battlegroup 1" },
    { id: "bg-2", name: "Battlegroup 2" },
    { id: "bg-3", name: "Battlegroup 3" },
  ],
  onSave = () => console.log("Defense plan saved"),
}: DefensePlannerProps) => {
  const [selectedBattlegroup, setSelectedBattlegroup] = useState(
    battlegroups[0].id,
  );
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("map");
  const [classFilter, setClassFilter] = useState("all");

  // Stats for the defense plan (would be calculated from actual data in a real implementation)
  const stats = {
    totalNodes: 50,
    assignedNodes: 32,
    classDistribution: {
      Tech: 6,
      Mutant: 7,
      Skill: 5,
      Science: 4,
      Mystic: 6,
      Cosmic: 4,
    },
  };

  const handleNodeSelect = (nodeId: number) => {
    setSelectedNodeId(nodeId);
    setActiveTab("assignment");
  };

  const handleAssignChampion = (
    nodeId: string,
    memberId: string,
    championId: string,
  ) => {
    console.log(
      `Assigned champion ${championId} from member ${memberId} to node ${nodeId}`,
    );
    // In a real implementation, this would update the state with the assignment
  };

  const handleSave = () => {
    onSave(selectedBattlegroup, {
      /* defense data would go here */
    });
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <Card className="w-full border-b rounded-none">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle>Defense Planner</CardTitle>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Select
                value={selectedBattlegroup}
                onValueChange={setSelectedBattlegroup}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Battlegroup" />
                </SelectTrigger>
                <SelectContent>
                  {battlegroups.map((bg) => (
                    <SelectItem key={bg.id} value={bg.id}>
                      {bg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Defense Plan
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 p-4">
        <div className="w-full lg:w-3/5 h-[600px] lg:h-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full h-full"
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="map" className="gap-2">
                  <Map className="h-4 w-4" />
                  Defense Map
                </TabsTrigger>
                <TabsTrigger value="assignment" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Node Assignment
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="mutant">Mutant</SelectItem>
                    <SelectItem value="skill">Skill</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="mystic">Mystic</SelectItem>
                    <SelectItem value="cosmic">Cosmic</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="map" className="h-[calc(100%-48px)] m-0">
              <DefenseMap
                onNodeSelect={handleNodeSelect}
                selectedNodeId={selectedNodeId}
              />
            </TabsContent>

            <TabsContent value="assignment" className="h-[calc(100%-48px)] m-0">
              <NodeAssignment
                selectedNodeId={selectedNodeId?.toString()}
                onAssign={handleAssignChampion}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full lg:w-2/5 h-[400px] lg:h-full">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                Defense Overview
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Completion Status</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{
                        width: `${(stats.assignedNodes / stats.totalNodes) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{stats.assignedNodes} assigned</span>
                    <span>
                      {stats.totalNodes - stats.assignedNodes} remaining
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Class Distribution</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(stats.classDistribution).map(
                      ([className, count]) => (
                        <div
                          key={className}
                          className="flex flex-col items-center p-2 border rounded-md"
                        >
                          <Badge
                            className={getClassBadgeColor(
                              className as keyof typeof stats.classDistribution,
                            )}
                          >
                            {className}
                          </Badge>
                          <span className="text-lg font-bold mt-1">
                            {count}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round((count / stats.assignedNodes) * 100)}%
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Team Members</h3>
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Member Assignments
                      </span>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Users className="h-3 w-3" />
                        View All
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Fully Assigned</span>
                        <span className="font-medium">6/10</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Partially Assigned</span>
                        <span className="font-medium">3/10</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Unassigned</span>
                        <span className="font-medium">1/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function to get badge color based on champion class
const getClassBadgeColor = (championClass: string): string => {
  const colors: Record<string, string> = {
    Tech: "bg-blue-100 text-blue-800",
    Mutant: "bg-yellow-100 text-yellow-800",
    Skill: "bg-red-100 text-red-800",
    Science: "bg-green-100 text-green-800",
    Mystic: "bg-purple-100 text-purple-800",
    Cosmic: "bg-pink-100 text-pink-800",
  };

  return colors[championClass] || "bg-gray-100 text-gray-800";
};

export default DefensePlanner;
