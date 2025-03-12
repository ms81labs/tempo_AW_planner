import React from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

export type NodePosition = "left" | "center" | "right";
export type NodePathType = "A" | "B" | "C" | "boss" | "bottleneck";

interface WarMapNodeProps {
  nodeId: number;
  position: NodePosition;
  pathType?: NodePathType;
  pathNumber?: number;
  color?: string;
  isSelected?: boolean;
  isAssigned?: boolean;
  assignedChampion?: {
    name: string;
    image: string;
    owner?: string;
  };
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const WarMapNode: React.FC<WarMapNodeProps> = ({
  nodeId,
  position,
  pathType = "A",
  pathNumber = 1,
  color = "#ffffff",
  isSelected = false,
  isAssigned = false,
  assignedChampion,
  onClick = () => {},
  size = "md",
}) => {
  // Determine node size based on prop
  const nodeSizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  };

  // Determine text size based on node size
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Determine position label
  const positionLabel = {
    left: "L",
    center: "C",
    right: "R",
  };

  // Generate tooltip content
  const tooltipContent = () => {
    if (isAssigned && assignedChampion) {
      return (
        <div className="text-center">
          <p className="font-bold">{assignedChampion.name}</p>
          {assignedChampion.owner && (
            <p className="text-xs text-muted-foreground">
              {assignedChampion.owner}
            </p>
          )}
          <p className="text-xs mt-1">
            Node {nodeId} - Path {pathType}
            {pathNumber} {positionLabel[position]}
          </p>
        </div>
      );
    }
    return (
      <div className="text-center">
        <p className="font-bold">Node {nodeId}</p>
        <p className="text-xs">
          Path {pathType}
          {pathNumber} {positionLabel[position]}
        </p>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              nodeSizeClasses[size],
              "rounded-full p-0 flex items-center justify-center relative",
              isSelected
                ? "ring-2 ring-offset-2 ring-offset-background ring-primary"
                : "",
              isAssigned ? "bg-opacity-90" : "bg-opacity-20",
            )}
            style={{
              backgroundColor: isAssigned ? color : "transparent",
              borderColor: "black",
              borderWidth: "2px",
            }}
            onClick={onClick}
          >
            {isAssigned && assignedChampion ? (
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={assignedChampion.image}
                  alt={assignedChampion.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <span
                className={cn(
                  textSizeClasses[size],
                  "font-bold",
                  isAssigned ? "text-white" : "text-foreground",
                )}
              >
                {nodeId}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{tooltipContent()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WarMapNode;
