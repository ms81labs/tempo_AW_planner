import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Shield, Users } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface CreateAllianceFormProps {
  onSuccess?: (allianceId: string) => void;
}

const CreateAllianceForm: React.FC<CreateAllianceFormProps> = ({
  onSuccess = () => {},
}) => {
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  const [allianceName, setAllianceName] = useState("");
  const [allianceTag, setAllianceTag] = useState("");
  const [allianceDescription, setAllianceDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate inputs
    if (!allianceName.trim()) {
      toast({
        title: "Error",
        description: "Alliance name is required",
        variant: "destructive",
      });
      return;
    }

    if (!allianceTag.trim()) {
      toast({
        title: "Error",
        description: "Alliance tag is required",
        variant: "destructive",
      });
      return;
    }

    if (allianceTag.length > 5) {
      toast({
        title: "Error",
        description: "Alliance tag must be 5 characters or less",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create the alliance
      const { data: allianceData, error: allianceError } = await supabase
        .from("alliances")
        .insert({
          name: allianceName.trim(),
          tag: allianceTag.trim().toUpperCase(),
          description: allianceDescription.trim() || null,
        })
        .select()
        .single();

      if (allianceError) throw allianceError;

      // Update the user's alliance_id
      const { error: userError } = await supabase
        .from("users")
        .update({ alliance_id: allianceData.id, role: "officer" })
        .eq("id", user.id);

      if (userError) throw userError;

      // Create default battlegroups
      const { error: battlegroupError } = await supabase
        .from("battlegroups")
        .insert([
          { alliance_id: allianceData.id, name: "Battlegroup 1" },
          { alliance_id: allianceData.id, name: "Battlegroup 2" },
          { alliance_id: allianceData.id, name: "Battlegroup 3" },
        ]);

      if (battlegroupError) throw battlegroupError;

      // Refresh user profile to get updated alliance info
      await refreshProfile();

      toast({
        title: "Success",
        description: "Alliance created successfully",
      });

      onSuccess(allianceData.id);
    } catch (error) {
      console.error("Error creating alliance:", error);
      toast({
        title: "Error",
        description: "Failed to create alliance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl">Create Your Alliance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alliance-name">Alliance Name</Label>
            <Input
              id="alliance-name"
              value={allianceName}
              onChange={(e) => setAllianceName(e.target.value)}
              placeholder="Enter your alliance name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alliance-tag">
              Alliance Tag (5 characters max)
            </Label>
            <Input
              id="alliance-tag"
              value={allianceTag}
              onChange={(e) => setAllianceTag(e.target.value)}
              placeholder="e.g. MCOC"
              maxLength={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alliance-description">Description (Optional)</Label>
            <Textarea
              id="alliance-description"
              value={allianceDescription}
              onChange={(e) => setAllianceDescription(e.target.value)}
              placeholder="Tell us about your alliance"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                Create Alliance
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAllianceForm;
