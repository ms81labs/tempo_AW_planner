import React from "react";
import Header from "../components/layout/Header";
import InvitationCodeManager from "../components/admin/InvitationCodeManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Shield, Users, Key } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const { profile } = useAuth();

  // Redirect if not admin
  if (!profile?.is_admin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header userRole="admin" />

      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage system settings and user access
              </p>
            </div>
          </div>

          <Tabs defaultValue="invitations" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger
                value="invitations"
                className="flex items-center gap-2"
              >
                <Key className="h-4 w-4" />
                Invitation Codes
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invitations" className="space-y-6">
              <InvitationCodeManager />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    User management functionality will be implemented in a
                    future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    System settings will be implemented in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
