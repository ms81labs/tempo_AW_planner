import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { QrCode, User, Shield, Star, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { QRCodeSVG } from "qrcode.react";

type ChampionRarity = "6-Star" | "7-Star";
type ChampionRank =
  | "Rank 5"
  | "Rank 6 (Ascended)"
  | "Rank 1"
  | "Rank 2"
  | "Rank 3"
  | "Rank 4";

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
}

interface UserChampion {
  id: string;
  rarity: ChampionRarity;
  rank: ChampionRank;
  champion_id: string;
  champions: {
    id: string;
    name: string;
    class: string;
  };
}

const MemberDetailPage = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { toast } = useToast();
  const [member, setMember] = useState<Member | null>(null);
  const [userChampions, setUserChampions] = useState<UserChampion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [activeClass, setActiveClass] = useState("all");
  const [activeRarity, setActiveRarity] = useState("all");

  // Class colors for badges
  const classColors = {
    cosmic: "bg-indigo-100 text-indigo-800",
    mutant: "bg-yellow-100 text-yellow-800",
    mystic: "bg-purple-100 text-purple-800",
    science: "bg-green-100 text-green-800",
    skill: "bg-red-100 text-red-800",
    tech: "bg-blue-100 text-blue-800",
  };

  // Rarity colors and styles
  const rarityStyles = {
    "6-Star": "bg-amber-100 text-amber-800 border-amber-300",
    "7-Star": "bg-red-100 text-red-800 border-red-300",
  };

  useEffect(() => {
    if (!memberId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch member info
        const { data: memberData, error: memberError } = await supabase
          .from("users")
          .select(
            `
            id, username, ingame_name, line_id, role, avatar_url, alliance_id,
            battlegroup_members(battlegroup:battlegroup_id(id, name))
          `,
          )
          .eq("id", memberId)
          .single();

        if (memberError) throw memberError;

        setMember({
          ...memberData,
          battlegroup: memberData.battlegroup_members[0]?.battlegroup,
        });

        // Fetch user's champions
        const { data: userChampionsData, error: userChampionsError } =
          await supabase
            .from("user_champions")
            .select(
              `
            id,
            rarity,
            rank,
            champion_id,
            champions:champion_id(id, name, class)
          `,
            )
            .eq("user_id", memberId);

        if (userChampionsError) throw userChampionsError;

        setUserChampions(userChampionsData as UserChampion[]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load member data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memberId, toast]);

  const generateInviteLink = () => {
    if (!memberId) return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/roster-update/${memberId}`;
  };

  const handleGenerateQR = () => {
    const link = generateInviteLink();
    setInviteLink(link);
    setShowQRDialog(true);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link Copied",
      description: "Invite link has been copied to clipboard.",
    });
  };

  // Filter champions based on active class and rarity
  const filteredChampions = userChampions.filter((champion) => {
    const classMatch =
      activeClass === "all" || champion.champions.class === activeClass;
    const rarityMatch =
      activeRarity === "all" || champion.rarity === activeRarity;
    return classMatch && rarityMatch;
  });

  // Group champions by class
  const championsByClass = filteredChampions.reduce(
    (acc, champion) => {
      const championClass = champion.champions.class;
      if (!acc[championClass]) {
        acc[championClass] = [];
      }
      acc[championClass].push(champion);
      return acc;
    },
    {} as Record<string, UserChampion[]>,
  );

  // Count champions by class and rarity
  const championCounts = {
    total: userChampions.length,
    byClass: Object.entries(championsByClass).reduce(
      (acc, [className, champions]) => {
        acc[className] = champions.length;
        return acc;
      },
      {} as Record<string, number>,
    ),
    byRarity: userChampions.reduce(
      (acc, champion) => {
        if (!acc[champion.rarity]) {
          acc[champion.rarity] = 0;
        }
        acc[champion.rarity]++;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header userRole="officer" />
        <div className="container mx-auto pt-24 px-4 pb-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header userRole="officer" />
        <div className="container mx-auto pt-24 px-4 pb-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Member Not Found</h2>
            <p className="text-gray-500 mt-2">
              The member you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header userRole="officer" />

      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Member Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Member Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold mb-4">
                  {member.ingame_name?.charAt(0).toUpperCase() || "M"}
                </div>
                <h2 className="text-2xl font-bold">{member.ingame_name}</h2>
                <div className="mt-1">
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

                <div className="w-full mt-6 space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">LINE ID</span>
                    </div>
                    <span className="font-medium">{member.line_id}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">Battlegroup</span>
                    </div>
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
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">Champions</span>
                    </div>
                    <span className="font-medium">
                      {userChampions.length} total
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 gap-2"
                  onClick={handleGenerateQR}
                >
                  <QrCode className="h-4 w-4" />
                  Generate Roster Update QR
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Champion Roster Card */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Champion Roster</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-gray-50">
                    {championCounts.total} Champions
                  </Badge>
                  {Object.entries(championCounts.byRarity).map(
                    ([rarity, count]) => (
                      <Badge
                        key={rarity}
                        variant="outline"
                        className={
                          rarityStyles[rarity as keyof typeof rarityStyles]
                        }
                      >
                        {count} {rarity}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activeClass === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveClass("all")}
                  >
                    All Classes
                  </Button>
                  {Object.keys(classColors).map((className) => (
                    <Button
                      key={className}
                      variant={
                        activeClass === className ? "default" : "outline"
                      }
                      size="sm"
                      className={
                        activeClass !== className
                          ? classColors[className as keyof typeof classColors]
                          : ""
                      }
                      onClick={() => setActiveClass(className)}
                    >
                      {className.charAt(0).toUpperCase() + className.slice(1)}
                      {championCounts.byClass[className] && (
                        <Badge variant="outline" className="ml-2 bg-white">
                          {championCounts.byClass[className]}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    variant={activeRarity === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveRarity("all")}
                  >
                    All Rarities
                  </Button>
                  <Button
                    variant={activeRarity === "6-Star" ? "default" : "outline"}
                    size="sm"
                    className={
                      activeRarity !== "6-Star"
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : ""
                    }
                    onClick={() => setActiveRarity("6-Star")}
                  >
                    6-Star
                  </Button>
                  <Button
                    variant={activeRarity === "7-Star" ? "default" : "outline"}
                    size="sm"
                    className={
                      activeRarity !== "7-Star"
                        ? "bg-red-100 text-red-800 border-red-300"
                        : ""
                    }
                    onClick={() => setActiveRarity("7-Star")}
                  >
                    7-Star
                  </Button>
                </div>
              </div>

              <div className="p-4 overflow-auto max-h-[500px]">
                {Object.keys(championsByClass).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(championsByClass).map(
                      ([className, champions]) => (
                        <div key={className}>
                          <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <Badge
                              variant="secondary"
                              className={
                                classColors[
                                  className as keyof typeof classColors
                                ]
                              }
                            >
                              {className.charAt(0).toUpperCase() +
                                className.slice(1)}
                            </Badge>
                            <span className="ml-2">
                              {champions.length} Champions
                            </span>
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {champions.map((champion) => (
                              <div
                                key={champion.id}
                                className={`p-3 border-2 rounded-md ${rarityStyles[champion.rarity]}`}
                              >
                                <div className="flex flex-col items-start gap-1">
                                  <span className="text-sm font-medium">
                                    {champion.champions.name}
                                  </span>
                                  <div className="flex gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {champion.rarity}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {champion.rank}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-gray-500">
                      No champions found with the selected filters.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Champion Roster Update Link</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4 gap-4">
            <div className="text-center mb-2">
              <p className="font-medium">{member.ingame_name}</p>
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
    </div>
  );
};

export default MemberDetailPage;
