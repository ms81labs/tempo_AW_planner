import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Plus, Users, UserPlus, Save, Trash2, AlertCircle } from "lucide-react";
import BattlegroupCard from "./BattlegroupCard";

interface Member {
  id: string;
  name: string;
  avatar?: string;
  assignedNodes: number;
  totalNodes: number;
}

interface Battlegroup {
  id: string;
  name: string;
  members: Member[];
}

interface BattlegroupManagerProps {
  initialBattlegroups?: Battlegroup[];
  availableMembers?: Member[];
  onSave?: (battlegroups: Battlegroup[]) => void;
}

const BattlegroupManager = ({
  initialBattlegroups = [
    {
      id: "bg-1",
      name: "Battlegroup 1",
      members: [
        { id: "1", name: "John Doe", assignedNodes: 3, totalNodes: 5 },
        { id: "2", name: "Jane Smith", assignedNodes: 5, totalNodes: 5 },
        { id: "3", name: "Mike Johnson", assignedNodes: 2, totalNodes: 5 },
      ],
    },
    {
      id: "bg-2",
      name: "Battlegroup 2",
      members: [
        { id: "4", name: "Sarah Williams", assignedNodes: 0, totalNodes: 5 },
        { id: "5", name: "David Brown", assignedNodes: 4, totalNodes: 5 },
        { id: "6", name: "Emily Davis", assignedNodes: 1, totalNodes: 5 },
      ],
    },
    {
      id: "bg-3",
      name: "Battlegroup 3",
      members: [
        { id: "7", name: "Michael Wilson", assignedNodes: 5, totalNodes: 5 },
        { id: "8", name: "Jessica Taylor", assignedNodes: 3, totalNodes: 5 },
        { id: "9", name: "Robert Martinez", assignedNodes: 2, totalNodes: 5 },
      ],
    },
  ],
  availableMembers = [
    { id: "10", name: "Thomas Anderson", assignedNodes: 0, totalNodes: 5 },
    { id: "11", name: "Lisa Johnson", assignedNodes: 0, totalNodes: 5 },
    { id: "12", name: "Kevin Clark", assignedNodes: 0, totalNodes: 5 },
    { id: "13", name: "Amanda Lewis", assignedNodes: 0, totalNodes: 5 },
    { id: "14", name: "Daniel White", assignedNodes: 0, totalNodes: 5 },
  ],
  onSave = () => console.log("Battlegroups saved"),
}: BattlegroupManagerProps) => {
  const [battlegroups, setBattlegroups] =
    useState<Battlegroup[]>(initialBattlegroups);
  const [activeTab, setActiveTab] = useState("bg-1");
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showDeleteBattlegroupDialog, setShowDeleteBattlegroupDialog] =
    useState(false);
  const [selectedBattlegroupId, setSelectedBattlegroupId] =
    useState<string>("");
  const [newBattlegroupName, setNewBattlegroupName] = useState("");
  const [showCreateBattlegroupDialog, setShowCreateBattlegroupDialog] =
    useState(false);

  // Find the currently active battlegroup
  const activeBattlegroup = battlegroups.find((bg) => bg.id === activeTab);

  // Handle adding a member to a battlegroup
  const handleAddMember = (battlegroupId: string, memberId: string) => {
    const member = availableMembers.find((m) => m.id === memberId);
    if (!member) return;

    setBattlegroups((prev) =>
      prev.map((bg) => {
        if (bg.id === battlegroupId && bg.members.length < 10) {
          return {
            ...bg,
            members: [...bg.members, member],
          };
        }
        return bg;
      }),
    );

    setShowAddMemberDialog(false);
  };

  // Handle removing a member from a battlegroup
  const handleRemoveMember = (battlegroupId: string, memberId: string) => {
    setBattlegroups((prev) =>
      prev.map((bg) => {
        if (bg.id === battlegroupId) {
          return {
            ...bg,
            members: bg.members.filter((m) => m.id !== memberId),
          };
        }
        return bg;
      }),
    );
  };

  // Handle creating a new battlegroup
  const handleCreateBattlegroup = () => {
    if (!newBattlegroupName.trim()) return;

    const newBattlegroup: Battlegroup = {
      id: `bg-${battlegroups.length + 1}`,
      name: newBattlegroupName,
      members: [],
    };

    setBattlegroups((prev) => [...prev, newBattlegroup]);
    setActiveTab(newBattlegroup.id);
    setNewBattlegroupName("");
    setShowCreateBattlegroupDialog(false);
  };

  // Handle deleting a battlegroup
  const handleDeleteBattlegroup = () => {
    if (!selectedBattlegroupId) return;

    setBattlegroups((prev) =>
      prev.filter((bg) => bg.id !== selectedBattlegroupId),
    );

    // Set active tab to the first battlegroup if the active one was deleted
    if (activeTab === selectedBattlegroupId && battlegroups.length > 1) {
      const newActiveId =
        battlegroups.find((bg) => bg.id !== selectedBattlegroupId)?.id || "";
      setActiveTab(newActiveId);
    }

    setShowDeleteBattlegroupDialog(false);
    setSelectedBattlegroupId("");
  };

  // Calculate total stats for the summary
  const totalMembers = battlegroups.reduce(
    (acc, bg) => acc + bg.members.length,
    0,
  );
  const fullyAssignedMembers = battlegroups.reduce(
    (acc, bg) =>
      acc + bg.members.filter((m) => m.assignedNodes === m.totalNodes).length,
    0,
  );

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Battlegroup Management
        </h1>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowCreateBattlegroupDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Battlegroup
          </Button>

          <Button
            onClick={() => onSave(battlegroups)}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Members
            </h3>
            <p className="text-2xl font-bold">{totalMembers}/30</p>
          </div>

          <div className="bg-white p-3 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Fully Assigned
            </h3>
            <p className="text-2xl font-bold">
              {fullyAssignedMembers}/{totalMembers}
            </p>
          </div>

          <div className="bg-white p-3 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Battlegroups
            </h3>
            <p className="text-2xl font-bold">{battlegroups.length}/3</p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {battlegroups.map((bg) => (
              <TabsTrigger key={bg.id} value={bg.id} className="px-4">
                {bg.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {battlegroups.length > 1 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setSelectedBattlegroupId(activeTab);
                setShowDeleteBattlegroupDialog(true);
              }}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete Battlegroup
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          {battlegroups.map((bg) => (
            <TabsContent key={bg.id} value={bg.id} className="h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <BattlegroupCard
                  id={bg.id}
                  name={bg.name}
                  members={bg.members}
                  onAddMember={() => {
                    setSelectedBattlegroupId(bg.id);
                    setShowAddMemberDialog(true);
                  }}
                  onRemoveMember={(memberId) =>
                    handleRemoveMember(bg.id, memberId)
                  }
                  onSelectMember={(memberId) =>
                    console.log(`Selected member ${memberId} in ${bg.id}`)
                  }
                />

                <div className="col-span-2 bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">
                      Battlegroup Statistics
                    </h3>
                    <p className="text-muted-foreground">
                      {bg.members.length}/10 members assigned
                    </p>
                    <p className="text-muted-foreground">
                      {
                        bg.members.filter(
                          (m) => m.assignedNodes === m.totalNodes,
                        ).length
                      }{" "}
                      members fully assigned
                    </p>
                    <p className="text-muted-foreground">
                      {bg.members.reduce((acc, m) => acc + m.assignedNodes, 0)}/
                      {bg.members.reduce((acc, m) => acc + m.totalNodes, 0)}{" "}
                      total nodes assigned
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member to Battlegroup</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
            {availableMembers.length > 0 ? (
              availableMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() =>
                    handleAddMember(selectedBattlegroupId, member.id)
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                    </div>
                  </div>

                  <Button size="sm" variant="ghost">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  No available members to add
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddMemberDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Battlegroup Dialog */}
      <Dialog
        open={showCreateBattlegroupDialog}
        onOpenChange={setShowCreateBattlegroupDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Battlegroup</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Battlegroup Name</Label>
              <Input
                id="name"
                placeholder="Enter battlegroup name"
                value={newBattlegroupName}
                onChange={(e) => setNewBattlegroupName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateBattlegroupDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBattlegroup}
              disabled={!newBattlegroupName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Battlegroup Alert Dialog */}
      <AlertDialog
        open={showDeleteBattlegroupDialog}
        onOpenChange={setShowDeleteBattlegroupDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Battlegroup</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this battlegroup? This action
              cannot be undone and all member assignments will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBattlegroup}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BattlegroupManager;
