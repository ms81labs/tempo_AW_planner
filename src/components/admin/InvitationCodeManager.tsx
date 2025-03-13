import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Badge } from "../ui/badge";
import { Clipboard, Plus, Trash2, RefreshCw, Copy } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface InvitationCode {
  id: string;
  code: string;
  description: string;
  created_at: string;
  used_at: string | null;
  used_by: string | null;
  is_active: boolean;
  user?: {
    username: string;
    email: string;
  };
}

const InvitationCodeManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchInvitationCodes();
  }, []);

  const fetchInvitationCodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("invitation_codes")
        .select(
          `
          *,
          user:used_by(username, email)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCodes(data || []);
    } catch (error) {
      console.error("Error fetching invitation codes:", error);
      toast({
        title: "Error",
        description: "Failed to load invitation codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    setNewCode(result);
  };

  const handleCreateCode = async () => {
    if (!newCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a code",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("invitation_codes")
        .insert({
          code: newCode.trim(),
          description: newDescription.trim() || null,
          created_by: user?.id,
          is_active: true,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invitation code created successfully",
      });

      setCodes([data[0], ...codes]);
      setNewCode("");
      setNewDescription("");
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error creating invitation code:", error);
      toast({
        title: "Error",
        description: "Failed to create invitation code",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCode = async () => {
    if (!codeToDelete) return;

    try {
      const { error } = await supabase
        .from("invitation_codes")
        .delete()
        .eq("id", codeToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invitation code deleted successfully",
      });

      setCodes(codes.filter((code) => code.id !== codeToDelete));
      setCodeToDelete(null);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting invitation code:", error);
      toast({
        title: "Error",
        description: "Failed to delete invitation code",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Invitation code copied to clipboard",
    });
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Invitation Codes</CardTitle>
            <CardDescription>
              Manage invitation codes for new users
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchInvitationCodes}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Invitation Code</DialogTitle>
                  <DialogDescription>
                    Create a new invitation code for users to register
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Code
                    </Label>
                    <div className="col-span-3 flex gap-2">
                      <Input
                        id="code"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        placeholder="Enter code or generate"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateRandomCode}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Optional description"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateCode}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Used By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.length > 0 ? (
                  codes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{code.code}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(code.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{code.description || "-"}</TableCell>
                      <TableCell>
                        {format(new Date(code.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {code.is_active ? (
                          code.used_at ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700"
                            >
                              Used
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700"
                            >
                              Active
                            </Badge>
                          )
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700"
                          >
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {code.used_by ? (
                          <div className="text-sm">
                            <div>{code.user?.username}</div>
                            <div className="text-xs text-muted-foreground">
                              {code.user?.email}
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => {
                            setCodeToDelete(code.id);
                            setShowDeleteDialog(true);
                          }}
                          disabled={!!code.used_by}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Clipboard className="h-8 w-8 mb-2" />
                        <p>No invitation codes found</p>
                        <p className="text-sm">
                          Create your first code to get started
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Invitation Code</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this invitation code? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCode}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default InvitationCodeManager;
