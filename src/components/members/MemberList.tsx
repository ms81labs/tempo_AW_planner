import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Plus,
  QrCode,
  User,
  Users,
  Trash,
  ExternalLink,
  Copy,
  Search,
} from "lucide-react";
import { useToast } from "../ui/use-toast";
import { LoadingSpinner } from "../ui/loading-spinner";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "../ui/pagination-controls";
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

interface MemberListProps {
  allianceId?: string;
}

interface Member {
  id: string;
  username: string;
  ingame_name: string;
  line_id: string;
  role: string;
  avatar_url: string | null;
  alliance_id: string | null;
  battlegroup?: {
    id: string;
    name: string;
  };
  champion_count?: number;
}

const MemberList: React.FC<MemberListProps> = ({ allianceId }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberLineId, setNewMemberLineId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [inviteLink, setInviteLink] = useState("");

  // Fetch members on component mount
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const effectiveAllianceId = allianceId || profile?.alliance_id;
    if (!effectiveAllianceId) {
      if (isMounted) setLoading(false);
      return;
    }

    fetchMembers(effectiveAllianceId);

    return () => {
      isMounted = false;
    };
  }, [user, allianceId, profile]);

  const fetchMembers = async (alliance_id: string) => {
    setLoading(true);
    try {
      // Fetch alliance members
      const { data: membersData, error: membersError } = await supabase
        .from("users")
        .select(
          `
          id, username, ingame_name, line_id, role, avatar_url, alliance_id,
          battlegroup_members(battlegroup:battlegroup_id(id, name))
        `,
        )
        .eq("alliance_id", alliance_id);

      if (membersError) throw membersError;

      // Get champion counts for each member
      const membersWithChampionCounts = await Promise.all(
        membersData.map(async (member: any) => {
          const { count, error } = await supabase
            .from("user_champions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", member.id);

          return {
            ...member,
            battlegroup: member.battlegroup_members[0]?.battlegroup,
            champion_count: count || 0,
          };
        }),
      );

      setMembers(membersWithChampionCounts);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error",
        description: "Failed to load alliance members.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    // Enhanced form validation with more comprehensive checks
    if (!newMemberName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide an in-game name.",
        variant: "destructive",
      });
      return;
    }

    if (!newMemberLineId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a LINE ID.",
        variant: "destructive",
      });
      return;
    }

    // Validate name length
    if (newMemberName.trim().length < 3) {
      toast({
        title: "Invalid Name",
        description: "In-game name must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Check for special characters in name
    if (!/^[a-zA-Z0-9\s._-]+$/.test(newMemberName)) {
      toast({
        title: "Invalid Name",
        description: "In-game name contains invalid characters.",
        variant: "destructive",
      });
      return;
    }

    const effectiveAllianceId = allianceId || profile?.alliance_id;
    if (!effectiveAllianceId) {
      toast({
        title: "Error",
        description: "No alliance ID found. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    // Create optimistic member object with a unique temporary ID
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const optimisticMember = {
      id: tempId,
      username: `${newMemberName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      ingame_name: newMemberName,
      line_id: newMemberLineId,
      role: "member",
      alliance_id: effectiveAllianceId,
      champion_count: 0,
      battlegroup: null,
      avatar_url: null,
    };

    // Store form values in case we need to retry
    const memberNameToAdd = newMemberName;
    const memberLineIdToAdd = newMemberLineId;

    // Reset form immediately for better UX
    setNewMemberName("");
    setNewMemberLineId("");
    setShowAddDialog(false);

    // Optimistically update UI with functional update to avoid race conditions
    setMembers((prevMembers) => [...prevMembers, optimisticMember]);

    // Show loading toast
    toast({
      title: "Adding Member",
      description: `Adding ${memberNameToAdd} to the alliance...`,
    });

    try {
      // Create a new user with member role
      const { data, error } = await supabase
        .from("users")
        .insert({
          username: optimisticMember.username,
          ingame_name: memberNameToAdd,
          line_id: memberLineIdToAdd,
          role: "member",
          alliance_id: effectiveAllianceId,
        })
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("No data returned from server");
      }

      // Replace optimistic member with actual data using functional update
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === optimisticMember.id
            ? { ...data[0], champion_count: 0 }
            : member,
        ),
      );

      toast({
        title: "Success",
        description: `${memberNameToAdd} has been added to the alliance.`,
      });
    } catch (error) {
      console.error("Error adding member:", error);

      // Remove optimistic member on error using functional update
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== optimisticMember.id),
      );

      toast({
        title: "Error",
        description:
          error instanceof Error
            ? `Failed to add member: ${error.message}`
            : "Failed to add member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (
      !confirm(
        `Are you sure you want to remove ${memberName} from the alliance?`,
      )
    )
      return;

    // Store member for potential restoration
    const memberToRemove = members.find((member) => member.id === memberId);
    if (!memberToRemove) return;

    // Optimistically update UI
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== memberId),
    );

    try {
      // Remove user from alliance
      const { error } = await supabase
        .from("users")
        .update({ alliance_id: null })
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Member Removed",
        description: `${memberName} has been removed from the alliance.`,
      });
    } catch (error) {
      console.error("Error removing member:", error);

      // Restore member on error
      setMembers((prevMembers) => [...prevMembers, memberToRemove]);

      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateInviteLink = useCallback((memberId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/roster-update/${memberId}`;
  }, []);

  const handleGenerateQR = useCallback(
    (member: Member) => {
      setSelectedMember(member);
      const link = generateInviteLink(member.id);
      setInviteLink(link);
      setShowQRDialog(true);
    },
    [generateInviteLink],
  );

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link Copied",
      description: "Invite link has been copied to clipboard.",
    });
  };

  const handleViewMember = useCallback(
    (memberId: string) => {
      navigate(`/member/${memberId}`);
    },
    [navigate],
  );

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.ingame_name
        ?.toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) ||
      member.line_id
        ?.toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()),
  );

  // Paginate filtered members
  const {
    paginatedData: paginatedMembers,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination({
    data: filteredMembers,
    itemsPerPage: 10,
    initialPage: 1,
  });

  // Render loading state
  if (loading) {
    return (
      <Card className="w-full h-full bg-white overflow-hidden flex flex-col">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-xl">Alliance Members</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="md" text="Loading members..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-white overflow-hidden flex flex-col">
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Alliance Members</CardTitle>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Alliance Member</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="member-name" className="text-right">
                    In-Game Name:
                  </Label>
                  <Input
                    id="member-name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter member's in-game name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="line-id" className="text-right">
                    LINE ID:
                  </Label>
                  <Input
                    id="line-id"
                    value={newMemberLineId}
                    onChange={(e) => setNewMemberLineId(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter member's LINE ID"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddMember}>
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search members by name or LINE ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <CardContent className="flex-1 p-0 overflow-auto">
        {filteredMembers.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>LINE ID</TableHead>
                  <TableHead>Battlegroup</TableHead>
                  <TableHead>Champions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {member.ingame_name?.charAt(0).toUpperCase() || "M"}
                        </div>
                        <div>
                          <div>{member.ingame_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {member.role === "officer" ? (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                Officer
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-gray-50 text-gray-700 border-gray-200"
                              >
                                Member
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.line_id}</TableCell>
                    <TableCell>
                      {member.battlegroup ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {member.battlegroup.name}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          Unassigned
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {member.champion_count} champions
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleGenerateQR(member)}
                          title="Generate QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewMember(member.id)}
                          title="View Member Details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() =>
                            handleRemoveMember(member.id, member.ingame_name)
                          }
                          title="Remove Member"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="p-4 border-t">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <Users className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">No members found</p>
            {searchQuery && (
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term
              </p>
            )}
          </div>
        )}
      </CardContent>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Champion Roster Update Link</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4 gap-4">
            <div className="text-center mb-2">
              <p className="font-medium">{selectedMember?.ingame_name}</p>
              <p className="text-sm text-muted-foreground">
                Scan this QR code to update your champion roster
              </p>
            </div>
            <div className="border p-4 rounded-lg bg-white">
              <QRCodeSVG value={inviteLink} size={200} level="H" />
            </div>
            <div className="flex items-center gap-2 mt-2 w-full">
              <Input value={inviteLink} readOnly className="flex-1" />
              <Button variant="outline" size="icon" onClick={copyInviteLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MemberList;
