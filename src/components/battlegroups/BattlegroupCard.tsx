import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { UserPlus, X, User } from "lucide-react";

interface Member {
  id: string;
  name: string;
  avatar?: string;
  assignedNodes: number;
  totalNodes: number;
}

interface BattlegroupCardProps {
  id: string;
  name: string;
  members: Member[];
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
  onSelectMember: (memberId: string) => void;
}

const BattlegroupCard: React.FC<BattlegroupCardProps> = ({
  id,
  name,
  members,
  onAddMember,
  onRemoveMember,
  onSelectMember,
}) => {
  return (
    <Card className="h-full bg-white overflow-hidden flex flex-col">
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant="outline">{members?.length || 0}/10 Members</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-auto">
        <div className="p-4 space-y-3">
          {members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
              onClick={() => onSelectMember(member.id)}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="font-medium text-primary">
                      {member.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>
                      {member.assignedNodes}/{member.totalNodes} nodes assigned
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveMember(member.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {(!members || members.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No members in this battlegroup</p>
              <p className="text-sm">Click the button below to add members</p>
            </div>
          )}

          {(!members || members.length < 10) && (
            <Button
              variant="outline"
              className="w-full mt-2 gap-2"
              onClick={onAddMember}
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BattlegroupCard;
