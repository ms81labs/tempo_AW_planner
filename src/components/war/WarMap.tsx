import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Lock, Unlock, Search, MessageSquare, Save, X } from "lucide-react";
import WarMapNode, { NodePosition, NodePathType } from "./WarMapNode";

interface Champion {
  id: string;
  name: string;
  image: string;
  class: "Tech" | "Mutant" | "Skill" | "Science" | "Mystic" | "Cosmic";
  owner: string;
}

interface Node {
  id: number;
  position: NodePosition;
  pathType: NodePathType;
  pathNumber: number;
  color: string;
  assignedChampion?: Champion;
  attackingChampion?: Champion;
  comment?: string;
}

interface WarMapProps {
  mode?: "defense" | "attack";
  isLocked?: boolean;
  nodes?: Node[];
  availableChampions?: Champion[];
  onSave?: (nodes: Node[]) => void;
  onLockToggle?: (isLocked: boolean) => void;
}

const WarMap: React.FC<WarMapProps> = ({
  mode = "defense",
  isLocked = false,
  nodes = defaultNodes,
  availableChampions = [],
  onSave = () => {},
  onLockToggle = () => {},
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [commentText, setCommentText] = useState("");
  const [mapIsLocked, setMapIsLocked] = useState(isLocked);

  // Get the currently selected node
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  // Filter champions based on search query
  const filteredChampions = availableChampions.filter((champion) =>
    champion.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle node selection
  const handleNodeClick = (nodeId: number) => {
    if (mapIsLocked) return;
    setSelectedNodeId(nodeId);

    // If in attack mode and the node has a comment, load it
    if (mode === "attack") {
      const node = nodes.find((n) => n.id === nodeId);
      if (node?.comment) {
        setCommentText(node.comment);
      } else {
        setCommentText("");
      }
    }
  };

  // Handle champion assignment
  const handleChampionAssign = (champion: Champion) => {
    if (!selectedNodeId || mapIsLocked) return;

    // Update nodes with the assigned champion
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNodeId) {
        if (mode === "defense") {
          return { ...node, assignedChampion: champion };
        } else {
          return { ...node, attackingChampion: champion };
        }
      }
      return node;
    });

    onSave(updatedNodes);
    setSelectedNodeId(null);
    setSearchQuery("");
  };

  // Handle removing a champion from a node
  const handleRemoveChampion = () => {
    if (!selectedNodeId || mapIsLocked) return;

    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNodeId) {
        if (mode === "defense") {
          return { ...node, assignedChampion: undefined };
        } else {
          return { ...node, attackingChampion: undefined };
        }
      }
      return node;
    });

    onSave(updatedNodes);
    setSelectedNodeId(null);
  };

  // Handle saving a comment for a node (attack mode only)
  const handleSaveComment = () => {
    if (!selectedNodeId || mode !== "attack" || mapIsLocked) return;

    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNodeId) {
        return { ...node, comment: commentText };
      }
      return node;
    });

    onSave(updatedNodes);
    setCommentText("");
    setSelectedNodeId(null);
  };

  // Toggle map lock status
  const toggleLock = () => {
    const newLockStatus = !mapIsLocked;
    setMapIsLocked(newLockStatus);
    onLockToggle(newLockStatus);
    setSelectedNodeId(null);
  };

  // Render the map layout based on the MCOC Alliance War map
  const renderMap = () => {
    return (
      <div className="relative w-full h-[800px] bg-white rounded-lg overflow-auto border border-gray-300">
        {/* Map title */}
        <div className="absolute top-4 left-4 text-black text-2xl font-bold">
          AW Map
        </div>

        {/* Grid background - 7x7 grid */}
        <div className="absolute inset-0 grid grid-cols-7 grid-rows-7 gap-0">
          {Array.from({ length: 49 }).map((_, i) => (
            <div key={i} className="border border-gray-200"></div>
          ))}
        </div>

        {/* Row 7 (Top Row) - Boss, Nodes 48-49 */}
        <div className="absolute top-[80px] left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 border-2 border-black rounded-full flex items-center justify-center">
              <span className="text-black text-xs">BOSS</span>
            </div>
            <WarMapNode
              nodeId={50}
              position="center"
              pathType="boss"
              pathNumber={1}
              color="#ffffff"
              isAssigned={!!nodes.find((n) => n.id === 50)?.assignedChampion}
              assignedChampion={
                nodes.find((n) => n.id === 50)?.assignedChampion
              }
              isSelected={selectedNodeId === 50}
              onClick={() => handleNodeClick(50)}
            />
          </div>
          <div className="h-10 w-[2px] bg-black my-1"></div>
        </div>

        {/* Row 7 - Nodes 48-49 */}
        <div className="absolute top-[140px] left-1/2 transform -translate-x-1/2 flex items-center space-x-[100px]">
          <WarMapNode
            nodeId={48}
            position="left"
            pathType="boss"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 48)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 48)?.assignedChampion}
            isSelected={selectedNodeId === 48}
            onClick={() => handleNodeClick(48)}
          />
          <WarMapNode
            nodeId={49}
            position="right"
            pathType="boss"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 49)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 49)?.assignedChampion}
            isSelected={selectedNodeId === 49}
            onClick={() => handleNodeClick(49)}
          />
        </div>

        {/* Connector lines from 48-49 to Boss */}
        <div className="absolute top-[140px] left-[calc(50%-50px)] w-[100px] h-[2px] bg-black"></div>
        <div className="absolute top-[140px] left-[calc(50%-25px)] h-[40px] w-[2px] bg-black transform rotate-45"></div>
        <div className="absolute top-[140px] left-[calc(50%+25px)] h-[40px] w-[2px] bg-black transform -rotate-45"></div>

        {/* Row 6 - Nodes 43-47 and Junction */}
        <div className="absolute top-[200px] left-1/2 transform -translate-x-1/2 flex items-center space-x-[100px]">
          <WarMapNode
            nodeId={46}
            position="left"
            pathType="boss"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 46)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 46)?.assignedChampion}
            isSelected={selectedNodeId === 46}
            onClick={() => handleNodeClick(46)}
          />
          <WarMapNode
            nodeId={47}
            position="right"
            pathType="boss"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 47)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 47)?.assignedChampion}
            isSelected={selectedNodeId === 47}
            onClick={() => handleNodeClick(47)}
          />
        </div>

        {/* Junction at (6,9) */}
        <div className="absolute top-[200px] left-[calc(50%-100px)] transform -translate-x-1/2">
          <div className="w-10 h-10 border-2 border-black rotate-45"></div>
        </div>

        {/* Connector lines for Row 6 */}
        <div className="absolute top-[200px] left-[calc(50%-150px)] w-[100px] h-[2px] bg-black"></div>
        <div className="absolute top-[200px] left-[calc(50%+50px)] w-[100px] h-[2px] bg-black"></div>
        <div className="absolute top-[200px] left-[calc(50%-100px)] h-[40px] w-[2px] bg-black transform rotate-45"></div>
        <div className="absolute top-[200px] left-[calc(50%+100px)] h-[40px] w-[2px] bg-black transform -rotate-45"></div>

        {/* Row 6 - Nodes 43-45 */}
        <div className="absolute top-[260px] left-[calc(50%-200px)] flex items-center space-x-[60px]">
          <WarMapNode
            nodeId={43}
            position="left"
            pathType="bottleneck"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 43)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 43)?.assignedChampion}
            isSelected={selectedNodeId === 43}
            onClick={() => handleNodeClick(43)}
          />
          <WarMapNode
            nodeId={44}
            position="center"
            pathType="bottleneck"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 44)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 44)?.assignedChampion}
            isSelected={selectedNodeId === 44}
            onClick={() => handleNodeClick(44)}
          />
        </div>

        <div className="absolute top-[260px] left-[calc(50%+150px)]">
          <WarMapNode
            nodeId={45}
            position="right"
            pathType="bottleneck"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 45)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 45)?.assignedChampion}
            isSelected={selectedNodeId === 45}
            onClick={() => handleNodeClick(45)}
          />
        </div>

        {/* Junction at (5,8) */}
        <div className="absolute top-[320px] left-1/2 transform -translate-x-1/2 rotate-45">
          <div className="w-10 h-10 border-2 border-black"></div>
        </div>

        {/* Connector lines for Row 5-6 */}
        <div className="absolute top-[320px] left-[calc(50%-50px)] w-[100px] h-[2px] bg-black"></div>
        <div className="absolute top-[320px] left-1/2 transform -translate-x-1/2 h-[40px] w-[2px] bg-black"></div>

        {/* Row 5 - Nodes 37-42 */}
        <div className="absolute top-[380px] left-[calc(50%-200px)] flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={40}
            position="left"
            pathType="A"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 40)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 40)?.assignedChampion}
            isSelected={selectedNodeId === 40}
            onClick={() => handleNodeClick(40)}
          />
          <WarMapNode
            nodeId={41}
            position="center"
            pathType="A"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 41)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 41)?.assignedChampion}
            isSelected={selectedNodeId === 41}
            onClick={() => handleNodeClick(41)}
          />
          <WarMapNode
            nodeId={42}
            position="right"
            pathType="A"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 42)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 42)?.assignedChampion}
            isSelected={selectedNodeId === 42}
            onClick={() => handleNodeClick(42)}
          />
        </div>

        <div className="absolute top-[380px] left-[calc(50%+100px)] flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={37}
            position="left"
            pathType="C"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 37)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 37)?.assignedChampion}
            isSelected={selectedNodeId === 37}
            onClick={() => handleNodeClick(37)}
          />
          <WarMapNode
            nodeId={38}
            position="center"
            pathType="C"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 38)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 38)?.assignedChampion}
            isSelected={selectedNodeId === 38}
            onClick={() => handleNodeClick(38)}
          />
          <WarMapNode
            nodeId={39}
            position="right"
            pathType="C"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 39)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 39)?.assignedChampion}
            isSelected={selectedNodeId === 39}
            onClick={() => handleNodeClick(39)}
          />
        </div>

        {/* Row 4 - Nodes 28-36 */}
        <div className="absolute top-[440px] left-[calc(50%-200px)] flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={28}
            position="left"
            pathType="A"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 28)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 28)?.assignedChampion}
            isSelected={selectedNodeId === 28}
            onClick={() => handleNodeClick(28)}
          />
          <WarMapNode
            nodeId={29}
            position="center"
            pathType="A"
            pathNumber={2}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 29)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 29)?.assignedChampion}
            isSelected={selectedNodeId === 29}
            onClick={() => handleNodeClick(29)}
          />
          <WarMapNode
            nodeId={30}
            position="right"
            pathType="A"
            pathNumber={3}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 30)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 30)?.assignedChampion}
            isSelected={selectedNodeId === 30}
            onClick={() => handleNodeClick(30)}
          />
        </div>

        <div className="absolute top-[440px] left-1/2 transform -translate-x-1/2 flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={31}
            position="left"
            pathType="B"
            pathNumber={4}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 31)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 31)?.assignedChampion}
            isSelected={selectedNodeId === 31}
            onClick={() => handleNodeClick(31)}
          />
          <WarMapNode
            nodeId={32}
            position="center"
            pathType="B"
            pathNumber={5}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 32)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 32)?.assignedChampion}
            isSelected={selectedNodeId === 32}
            onClick={() => handleNodeClick(32)}
          />
          <WarMapNode
            nodeId={33}
            position="right"
            pathType="B"
            pathNumber={6}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 33)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 33)?.assignedChampion}
            isSelected={selectedNodeId === 33}
            onClick={() => handleNodeClick(33)}
          />
        </div>

        <div className="absolute top-[440px] left-[calc(50%+100px)] flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={34}
            position="left"
            pathType="C"
            pathNumber={7}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 34)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 34)?.assignedChampion}
            isSelected={selectedNodeId === 34}
            onClick={() => handleNodeClick(34)}
          />
          <WarMapNode
            nodeId={35}
            position="center"
            pathType="C"
            pathNumber={8}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 35)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 35)?.assignedChampion}
            isSelected={selectedNodeId === 35}
            onClick={() => handleNodeClick(35)}
          />
          <WarMapNode
            nodeId={36}
            position="right"
            pathType="C"
            pathNumber={9}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 36)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 36)?.assignedChampion}
            isSelected={selectedNodeId === 36}
            onClick={() => handleNodeClick(36)}
          />
        </div>

        {/* Connector lines for Row 4 */}
        <div className="absolute top-[440px] left-[calc(50%-150px)] h-[40px] w-[2px] bg-black transform rotate-45"></div>
        <div className="absolute top-[440px] left-[calc(50%)] h-[40px] w-[2px] bg-black"></div>
        <div className="absolute top-[440px] left-[calc(50%+150px)] h-[40px] w-[2px] bg-black transform -rotate-45"></div>

        {/* Row 3 - Nodes 19-27 */}
        <div className="absolute top-[500px] left-[calc(50%-200px)] flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={19}
            position="left"
            pathType="A"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 19)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 19)?.assignedChampion}
            isSelected={selectedNodeId === 19}
            onClick={() => handleNodeClick(19)}
          />
          <WarMapNode
            nodeId={20}
            position="center"
            pathType="A"
            pathNumber={2}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 20)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 20)?.assignedChampion}
            isSelected={selectedNodeId === 20}
            onClick={() => handleNodeClick(20)}
          />
          <WarMapNode
            nodeId={21}
            position="right"
            pathType="A"
            pathNumber={3}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 21)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 21)?.assignedChampion}
            isSelected={selectedNodeId === 21}
            onClick={() => handleNodeClick(21)}
          />
        </div>

        <div className="absolute top-[500px] left-1/2 transform -translate-x-1/2 flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={22}
            position="left"
            pathType="B"
            pathNumber={4}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 22)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 22)?.assignedChampion}
            isSelected={selectedNodeId === 22}
            onClick={() => handleNodeClick(22)}
          />
          <WarMapNode
            nodeId={23}
            position="center"
            pathType="B"
            pathNumber={5}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 23)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 23)?.assignedChampion}
            isSelected={selectedNodeId === 23}
            onClick={() => handleNodeClick(23)}
          />
          <WarMapNode
            nodeId={24}
            position="right"
            pathType="B"
            pathNumber={6}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 24)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 24)?.assignedChampion}
            isSelected={selectedNodeId === 24}
            onClick={() => handleNodeClick(24)}
          />
        </div>

        <div className="absolute top-[500px] left-[calc(50%+100px)] flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={25}
            position="left"
            pathType="C"
            pathNumber={7}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 25)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 25)?.assignedChampion}
            isSelected={selectedNodeId === 25}
            onClick={() => handleNodeClick(25)}
          />
          <WarMapNode
            nodeId={26}
            position="center"
            pathType="C"
            pathNumber={8}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 26)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 26)?.assignedChampion}
            isSelected={selectedNodeId === 26}
            onClick={() => handleNodeClick(26)}
          />
          <WarMapNode
            nodeId={27}
            position="right"
            pathType="C"
            pathNumber={9}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 27)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 27)?.assignedChampion}
            isSelected={selectedNodeId === 27}
            onClick={() => handleNodeClick(27)}
          />
        </div>

        {/* Connector lines for Row 3 */}
        <div className="absolute top-[500px] left-[calc(50%-150px)] h-[40px] w-[2px] bg-black transform rotate-45"></div>
        <div className="absolute top-[500px] left-[calc(50%)] h-[40px] w-[2px] bg-black"></div>
        <div className="absolute top-[500px] left-[calc(50%+150px)] h-[40px] w-[2px] bg-black transform -rotate-45"></div>

        {/* Row 2 - Nodes 10-18 */}
        <div className="absolute top-[560px] left-[calc(50%-200px)] flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={10}
            position="left"
            pathType="A"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 10)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 10)?.assignedChampion}
            isSelected={selectedNodeId === 10}
            onClick={() => handleNodeClick(10)}
          />
          <WarMapNode
            nodeId={11}
            position="center"
            pathType="A"
            pathNumber={2}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 11)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 11)?.assignedChampion}
            isSelected={selectedNodeId === 11}
            onClick={() => handleNodeClick(11)}
          />
          <WarMapNode
            nodeId={12}
            position="right"
            pathType="A"
            pathNumber={3}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 12)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 12)?.assignedChampion}
            isSelected={selectedNodeId === 12}
            onClick={() => handleNodeClick(12)}
          />
        </div>

        <div className="absolute top-[560px] left-1/2 transform -translate-x-1/2 flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={13}
            position="left"
            pathType="B"
            pathNumber={4}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 13)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 13)?.assignedChampion}
            isSelected={selectedNodeId === 13}
            onClick={() => handleNodeClick(13)}
          />
          <WarMapNode
            nodeId={14}
            position="center"
            pathType="B"
            pathNumber={5}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 14)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 14)?.assignedChampion}
            isSelected={selectedNodeId === 14}
            onClick={() => handleNodeClick(14)}
          />
          <WarMapNode
            nodeId={15}
            position="right"
            pathType="B"
            pathNumber={6}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 15)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 15)?.assignedChampion}
            isSelected={selectedNodeId === 15}
            onClick={() => handleNodeClick(15)}
          />
        </div>

        <div className="absolute top-[560px] left-[calc(50%+100px)] flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={16}
            position="left"
            pathType="C"
            pathNumber={7}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 16)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 16)?.assignedChampion}
            isSelected={selectedNodeId === 16}
            onClick={() => handleNodeClick(16)}
          />
          <WarMapNode
            nodeId={17}
            position="center"
            pathType="C"
            pathNumber={8}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 17)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 17)?.assignedChampion}
            isSelected={selectedNodeId === 17}
            onClick={() => handleNodeClick(17)}
          />
          <WarMapNode
            nodeId={18}
            position="right"
            pathType="C"
            pathNumber={9}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 18)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 18)?.assignedChampion}
            isSelected={selectedNodeId === 18}
            onClick={() => handleNodeClick(18)}
          />
        </div>

        {/* Connector lines for Row 2 */}
        <div className="absolute top-[560px] left-[calc(50%-150px)] h-[40px] w-[2px] bg-black transform rotate-45"></div>
        <div className="absolute top-[560px] left-[calc(50%)] h-[40px] w-[2px] bg-black"></div>
        <div className="absolute top-[560px] left-[calc(50%+150px)] h-[40px] w-[2px] bg-black transform -rotate-45"></div>

        {/* Row 1 (Bottom Row) - Nodes 1-9 */}
        <div className="absolute top-[620px] left-[calc(50%-200px)] flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={1}
            position="left"
            pathType="A"
            pathNumber={1}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 1)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 1)?.assignedChampion}
            isSelected={selectedNodeId === 1}
            onClick={() => handleNodeClick(1)}
          />
          <WarMapNode
            nodeId={2}
            position="center"
            pathType="A"
            pathNumber={2}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 2)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 2)?.assignedChampion}
            isSelected={selectedNodeId === 2}
            onClick={() => handleNodeClick(2)}
          />
          <WarMapNode
            nodeId={3}
            position="right"
            pathType="A"
            pathNumber={3}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 3)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 3)?.assignedChampion}
            isSelected={selectedNodeId === 3}
            onClick={() => handleNodeClick(3)}
          />
        </div>

        <div className="absolute top-[620px] left-1/2 transform -translate-x-1/2 flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={4}
            position="left"
            pathType="B"
            pathNumber={4}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 4)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 4)?.assignedChampion}
            isSelected={selectedNodeId === 4}
            onClick={() => handleNodeClick(4)}
          />
          <WarMapNode
            nodeId={5}
            position="center"
            pathType="B"
            pathNumber={5}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 5)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 5)?.assignedChampion}
            isSelected={selectedNodeId === 5}
            onClick={() => handleNodeClick(5)}
          />
          <WarMapNode
            nodeId={6}
            position="right"
            pathType="B"
            pathNumber={6}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 6)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 6)?.assignedChampion}
            isSelected={selectedNodeId === 6}
            onClick={() => handleNodeClick(6)}
          />
        </div>

        <div className="absolute top-[620px] left-[calc(50%+100px)] flex items-center space-x-[30px]">
          <WarMapNode
            nodeId={7}
            position="left"
            pathType="C"
            pathNumber={7}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 7)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 7)?.assignedChampion}
            isSelected={selectedNodeId === 7}
            onClick={() => handleNodeClick(7)}
          />
          <WarMapNode
            nodeId={8}
            position="center"
            pathType="C"
            pathNumber={8}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 8)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 8)?.assignedChampion}
            isSelected={selectedNodeId === 8}
            onClick={() => handleNodeClick(8)}
          />
          <WarMapNode
            nodeId={9}
            position="right"
            pathType="C"
            pathNumber={9}
            color="#ffffff"
            isAssigned={!!nodes.find((n) => n.id === 9)?.assignedChampion}
            assignedChampion={nodes.find((n) => n.id === 9)?.assignedChampion}
            isSelected={selectedNodeId === 9}
            onClick={() => handleNodeClick(9)}
          />
        </div>

        {/* Lock/Unlock button */}
        <Button
          variant={mapIsLocked ? "destructive" : "default"}
          className="absolute top-4 right-4 flex items-center gap-2"
          onClick={toggleLock}
        >
          {mapIsLocked ? (
            <>
              <Unlock size={16} />
              Unlock Map
            </>
          ) : (
            <>
              <Lock size={16} />
              Lock Map
            </>
          )}
        </Button>

        {/* Map stats */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          <Badge
            variant="outline"
            className="bg-white text-black border-gray-300"
          >
            {mode === "defense" ? "Defense Map" : "Attack Map"}
          </Badge>
          <Badge
            variant="outline"
            className="bg-white text-black border-gray-300"
          >
            {
              nodes.filter((n) =>
                mode === "defense" ? n.assignedChampion : n.attackingChampion,
              ).length
            }
            /50 Nodes Assigned
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="flex items-center justify-between">
          <span>
            {mode === "defense"
              ? "Alliance War Defense Map"
              : "Alliance War Attack Map"}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant={mapIsLocked ? "destructive" : "default"}>
              {mapIsLocked ? "Locked" : "Unlocked"}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-col md:flex-row h-[calc(100%-57px)]">
        <div className="w-full md:w-3/4 h-full overflow-auto">
          {renderMap()}
        </div>

        <div className="w-full md:w-1/4 border-l h-full">
          <Tabs defaultValue="search" className="h-full flex flex-col">
            <TabsList className="w-full justify-stretch px-2 py-2">
              <TabsTrigger value="search" className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Search
              </TabsTrigger>
              {mode === "attack" && (
                <TabsTrigger value="comments" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comments
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="search" className="flex-1 p-4 overflow-auto">
              {selectedNodeId ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Node {selectedNodeId}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedNodeId(null)}
                    >
                      <X size={16} />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Search champions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />

                    {selectedNode &&
                    ((mode === "defense" && selectedNode.assignedChampion) ||
                      (mode === "attack" && selectedNode.attackingChampion)) ? (
                      <div className="p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                              src={
                                mode === "defense"
                                  ? selectedNode.assignedChampion?.image
                                  : selectedNode.attackingChampion?.image
                              }
                              alt="Champion"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {mode === "defense"
                                ? selectedNode.assignedChampion?.name
                                : selectedNode.attackingChampion?.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {mode === "defense"
                                ? selectedNode.assignedChampion?.owner
                                : selectedNode.attackingChampion?.owner}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full mt-3"
                          onClick={handleRemoveChampion}
                        >
                          Remove Champion
                        </Button>
                      </div>
                    ) : (
                      <div className="max-h-[500px] overflow-y-auto space-y-2">
                        {filteredChampions.length > 0 ? (
                          filteredChampions.map((champion) => (
                            <div
                              key={champion.id}
                              className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                              onClick={() => handleChampionAssign(champion)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                  <img
                                    src={champion.image}
                                    alt={champion.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    {champion.name}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {champion.class}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {champion.owner}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">
                              No champions found matching your search.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">Select a Node</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Click on a node in the map to assign a champion
                    {mapIsLocked && " (map is currently locked)"}
                  </p>
                </div>
              )}
            </TabsContent>

            {mode === "attack" && (
              <TabsContent
                value="comments"
                className="flex-1 p-4 overflow-auto"
              >
                {selectedNodeId ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        Node {selectedNodeId} Comments
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedNodeId(null)}
                      >
                        <X size={16} />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        placeholder="Add tactical instructions for this node..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full h-32 p-3 border rounded-md resize-none"
                        disabled={mapIsLocked}
                      />

                      <Button
                        onClick={handleSaveComment}
                        className="w-full"
                        disabled={mapIsLocked}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Comment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">Node Comments</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Select a node to add tactical instructions
                      {mapIsLocked && " (map is currently locked)"}
                    </p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

// Default nodes for the map
const defaultNodes: Node[] = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1;
  let pathType: NodePathType = "A";
  let pathNumber = 1;
  let position: NodePosition = "center";
  let color = "#ffffff";

  // Assign path types, numbers and colors based on node ID
  if (id >= 46) {
    pathType = "boss";
    color = "#888888";
  } else if (id >= 43 && id <= 45) {
    pathType = "bottleneck";
    color = "#888888";
  } else if (id >= 37 && id <= 42) {
    if (id <= 39) pathType = "C";
    else pathType = "A";
    color = "#888888";
  } else if (id >= 28 && id <= 36) {
    if (id <= 30) {
      pathType = "A";
      pathNumber = id - 27;
    } else if (id <= 33) {
      pathType = "B";
      pathNumber = id - 27;
    } else {
      pathType = "C";
      pathNumber = id - 27;
    }

    // Assign colors based on path
    if (pathNumber === 1) color = "#ff4444";
    else if (pathNumber === 2) color = "#ff8844";
    else if (pathNumber === 3) color = "#ffcc44";
    else if (pathNumber === 4) color = "#44cc44";
    else if (pathNumber === 5) color = "#44aaff";
    else if (pathNumber === 6) color = "#aa44ff";
    else if (pathNumber === 7) color = "#ff44aa";
    else if (pathNumber === 8) color = "#ddaa77";
    else if (pathNumber === 9) color = "#4444ff";
  } else if (id >= 19 && id <= 27) {
    if (id <= 21) {
      pathType = "A";
      pathNumber = id - 18;
    } else if (id <= 24) {
      pathType = "B";
      pathNumber = id - 18;
    } else {
      pathType = "C";
      pathNumber = id - 18;
    }

    // Assign colors based on path
    if (pathNumber === 1) color = "#ff4444";
    else if (pathNumber === 2) color = "#ff8844";
    else if (pathNumber === 3) color = "#ffcc44";
    else if (pathNumber === 4) color = "#44cc44";
    else if (pathNumber === 5) color = "#44aaff";
    else if (pathNumber === 6) color = "#aa44ff";
    else if (pathNumber === 7) color = "#ff44aa";
    else if (pathNumber === 8) color = "#ddaa77";
    else if (pathNumber === 9) color = "#4444ff";
  } else {
    if (id <= 3) {
      pathType = "A";
      pathNumber = id;
    } else if (id <= 6) {
      pathType = "B";
      pathNumber = id - 3;
    } else {
      pathType = "C";
      pathNumber = id - 6;
    }

    // Assign colors based on path
    if (pathNumber === 1) color = "#ff4444";
    else if (pathNumber === 2) color = "#ff8844";
    else if (pathNumber === 3) color = "#ffcc44";
    else if (pathNumber === 4) color = "#44cc44";
    else if (pathNumber === 5) color = "#44aaff";
    else if (pathNumber === 6) color = "#aa44ff";
    else if (pathNumber === 7) color = "#ff44aa";
    else if (pathNumber === 8) color = "#ddaa77";
    else if (pathNumber === 9) color = "#4444ff";
  }

  // Assign positions based on node ID patterns
  if ([1, 4, 7, 19, 22, 25, 37, 40, 43, 46].includes(id)) {
    position = "left";
  } else if ([3, 6, 9, 21, 24, 27, 39, 42, 45, 47, 49].includes(id)) {
    position = "right";
  }

  return {
    id,
    position,
    pathType,
    pathNumber,
    color,
  };
});

export default WarMap;
