import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { UserCircle, Shield, Plus, Trash } from "lucide-react";

interface MemberProps {
  id: string;
  name: string;
  avatar?: string;
  assignedNodes: number;
  totalNodes: number;
}

interface BattlegroupCardProps {
  id?: string;
  name?: string;
  members?: MemberProps[];
  onAddMember?: () => void;
  onRemoveMember?: (memberId: string) => void;
  onSelectMember?: (memberId: string) => void;
}

const BattlegroupCard = ({
  id = "bg-1",
  name = "Battlegroup 1",
  members = [
    { id: "1", name: "John Doe", assignedNodes: 3, totalNodes: 5 },
    { id: "2", name: "Jane Smith", assignedNodes: 5, totalNodes: 5 },
    { id: "3", name: "Mike Johnson", assignedNodes: 2, totalNodes: 5 },
    { id: "4", name: "Sarah Williams", assignedNodes: 0, totalNodes: 5 },
    { id: "5", name: "David Brown", assignedNodes: 4, totalNodes: 5 },
  ],
  onAddMember = () => console.log("Add member clicked"),
  onRemoveMember = (memberId: string) =>
    console.log(`Remove member ${memberId}`),
  onSelectMember = (memberId: string) =>
    console.log(`Select member ${memberId}`),
}: BattlegroupCardProps) => {
  return (
    <Card className="w-full max-w-[450px] h-[600px] flex flex-col bg-white">
      <CardHeader className="bg-primary/10 rounded-t-xl">
        <CardTitle className="text-xl flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {name}
        </CardTitle>
        <CardDescription>
          {members.length}/10 members |{" "}
          {members.filter((m) => m.assignedNodes === m.totalNodes).length} fully
          assigned
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto py-4">
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onSelectMember(member.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  ) : (
                    <AvatarFallback>
                      <UserCircle className="h-6 w-6 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Assigned: {member.assignedNodes}/{member.totalNodes} nodes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {member.assignedNodes === member.totalNodes ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    Complete
                  </Badge>
                ) : member.assignedNodes > 0 ? (
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                  >
                    Partial
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    Unassigned
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMember(member.id);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        {members.length < 10 ? (
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={onAddMember}
          >
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground text-center w-full">
            Maximum members reached (10/10)
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default BattlegroupCard;
