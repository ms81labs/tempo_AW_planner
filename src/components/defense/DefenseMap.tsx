import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Shield, Info } from "lucide-react";

interface DefenseNode {
  id: number;
  position: { x: number; y: number };
  title: string;
  description: string;
  assignedChampion?: {
    name: string;
    class: "Tech" | "Mutant" | "Skill" | "Science" | "Mystic" | "Cosmic";
    image: string;
  };
  bonuses?: string[];
}

interface DefenseMapProps {
  nodes?: DefenseNode[];
  onNodeSelect?: (nodeId: number) => void;
  selectedNodeId?: number;
}

const DefenseMap = ({
  nodes = defaultNodes,
  onNodeSelect = () => {},
  selectedNodeId = null,
}: DefenseMapProps) => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const handleNodeClick = (nodeId: number) => {
    onNodeSelect(nodeId);
  };

  return (
    <Card className="w-full h-full bg-slate-100 overflow-hidden relative">
      <CardContent className="p-0 h-full">
        <div className="relative w-full h-full min-h-[700px] bg-slate-800 p-4">
          {/* Map background with grid lines */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
            {Array.from({ length: 12 }).map((_, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                {Array.from({ length: 12 }).map((_, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="border border-slate-500"
                  />
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Map title */}
          <div className="absolute top-4 left-4 z-10">
            <h2 className="text-2xl font-bold text-white">Defense Map</h2>
            <p className="text-slate-300">
              Place champions on nodes to create your defense
            </p>
          </div>

          {/* Map legend */}
          <div className="absolute top-4 right-4 z-10 bg-slate-900 bg-opacity-70 p-3 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Legend</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-white text-sm">Assigned Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-white text-sm">Empty Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-white text-sm">Selected Node</span>
              </div>
            </div>
          </div>

          {/* Defense nodes */}
          <div className="relative w-full h-full">
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNode === node.id;
              const isAssigned = !!node.assignedChampion;

              return (
                <TooltipProvider key={node.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className={`absolute rounded-full w-12 h-12 flex items-center justify-center transition-all ${isSelected ? "ring-4 ring-blue-500 z-20" : ""} ${isHovered ? "scale-110" : ""}`}
                        style={{
                          left: `${node.position.x}%`,
                          top: `${node.position.y}%`,
                          transform: "translate(-50%, -50%)",
                          backgroundColor: isAssigned ? "#10b981" : "#ef4444",
                        }}
                        onClick={() => handleNodeClick(node.id)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        {isAssigned ? (
                          <img
                            src={node.assignedChampion.image}
                            alt={node.assignedChampion.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <Shield className="text-white" size={20} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div>
                        <h4 className="font-bold">{node.title}</h4>
                        <p className="text-xs">{node.description}</p>
                        {node.bonuses && node.bonuses.length > 0 && (
                          <div className="mt-1">
                            <span className="text-xs font-semibold">
                              Bonuses:
                            </span>
                            <ul className="text-xs list-disc pl-4">
                              {node.bonuses.map((bonus, idx) => (
                                <li key={idx}>{bonus}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {node.assignedChampion && (
                          <div className="mt-1">
                            <span className="text-xs font-semibold">
                              Assigned:
                            </span>
                            <p className="text-xs">
                              {node.assignedChampion.name} (
                              {node.assignedChampion.class})
                            </p>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>

          {/* Connection lines between nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {generateConnectionLines(nodes).map((line, index) => (
              <line
                key={`line-${index}`}
                x1={`${line.start.x}%`}
                y1={`${line.start.y}%`}
                x2={`${line.end.x}%`}
                y2={`${line.end.y}%`}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* Info button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4 bg-slate-900 text-white hover:bg-slate-700"
          >
            <Info size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to generate connection lines between nodes
const generateConnectionLines = (nodes: DefenseNode[]) => {
  const lines = [];

  // This is a simplified example - in a real app, you would define the actual connections
  // For this example, we'll connect nodes that are close to each other
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = Math.sqrt(
        Math.pow(nodes[i].position.x - nodes[j].position.x, 2) +
          Math.pow(nodes[i].position.y - nodes[j].position.y, 2),
      );

      // Connect nodes that are within a certain distance
      if (distance < 20) {
        lines.push({
          start: nodes[i].position,
          end: nodes[j].position,
        });
      }
    }
  }

  return lines;
};

// Default nodes for the map
const defaultNodes: DefenseNode[] = [
  {
    id: 1,
    position: { x: 20, y: 20 },
    title: "Entrance Node",
    description: "First line of defense with enhanced armor",
    bonuses: ["25% Armor", "Regeneration"],
    assignedChampion: {
      name: "Iron Man",
      class: "Tech",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ironman",
    },
  },
  {
    id: 2,
    position: { x: 35, y: 30 },
    title: "Power Gain Node",
    description: "Champions gain power faster on this node",
    bonuses: ["Power Gain +50%", "Special Attack Damage +20%"],
  },
  {
    id: 3,
    position: { x: 50, y: 20 },
    title: "Stun Immunity",
    description: "Champions on this node are immune to stun effects",
    bonuses: ["Stun Immunity", "Increased Critical Rate"],
    assignedChampion: {
      name: "Magneto",
      class: "Mutant",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=magneto",
    },
  },
  {
    id: 4,
    position: { x: 65, y: 30 },
    title: "Bleed Node",
    description: "Champions deal bleed damage with basic attacks",
    bonuses: ["Bleed on Hit", "Enhanced Bleed Duration"],
  },
  {
    id: 5,
    position: { x: 80, y: 20 },
    title: "Healing Node",
    description: "Champions recover health over time",
    bonuses: ["Recovery +100%", "Poison Immunity"],
  },
  {
    id: 6,
    position: { x: 20, y: 50 },
    title: "Armor Break",
    description: "Champions apply armor break with special attacks",
    bonuses: ["Armor Break Duration +50%", "Armor Break Potency +30%"],
  },
  {
    id: 7,
    position: { x: 35, y: 60 },
    title: "Power Lock",
    description: "Champions can lock opponent power gain",
    bonuses: ["Power Lock Duration +40%", "Special Attack Cost -20%"],
    assignedChampion: {
      name: "Vision",
      class: "Tech",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=vision",
    },
  },
  {
    id: 8,
    position: { x: 50, y: 50 },
    title: "Boss Node",
    description: "Central boss node with multiple enhancements",
    bonuses: ["Health +200%", "Attack +100%", "All Resistances +50%"],
  },
  {
    id: 9,
    position: { x: 65, y: 60 },
    title: "Unblockable",
    description: "Champions have unblockable special attacks",
    bonuses: ["Unblockable Specials", "Special Damage +40%"],
  },
  {
    id: 10,
    position: { x: 80, y: 50 },
    title: "Debuff Immunity",
    description: "Champions are immune to debuff effects",
    bonuses: ["Debuff Immunity", "Purify Chance +70%"],
    assignedChampion: {
      name: "Captain America",
      class: "Science",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=captainamerica",
    },
  },
  {
    id: 11,
    position: { x: 20, y: 80 },
    title: "Enhanced Special 1",
    description: "Special 1 attacks deal increased damage",
    bonuses: ["Special 1 Damage +100%", "Special 1 Cost -30%"],
  },
  {
    id: 12,
    position: { x: 35, y: 80 },
    title: "Enhanced Special 2",
    description: "Special 2 attacks deal increased damage",
    bonuses: ["Special 2 Damage +100%", "Special 2 Cost -30%"],
  },
  {
    id: 13,
    position: { x: 50, y: 80 },
    title: "Enhanced Special 3",
    description: "Special 3 attacks deal increased damage",
    bonuses: ["Special 3 Damage +100%", "Special 3 Unblockable"],
  },
  {
    id: 14,
    position: { x: 65, y: 80 },
    title: "Mystic Ward",
    description: "Reduces effectiveness of mystic champions",
    bonuses: [
      "Mystic Champions -30% Ability Accuracy",
      "Non-Mystic +20% Attack",
    ],
  },
  {
    id: 15,
    position: { x: 80, y: 80 },
    title: "Exit Node",
    description: "Final defense node before exit",
    bonuses: ["All Champions +50% Health", "Regeneration"],
    assignedChampion: {
      name: "Doctor Strange",
      class: "Mystic",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=drstrange",
    },
  },
];

export default DefenseMap;
