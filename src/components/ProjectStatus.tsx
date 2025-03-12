import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  CheckCircle2,
  AlertCircle,
  Database,
  Shield,
  Users,
  Map,
  QrCode,
} from "lucide-react";

const ProjectStatus = () => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              MCOC Alliance War Planner - Project Status
            </CardTitle>
            <CardDescription>
              Current implementation status and functionality overview
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" /> Connected to Supabase
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> Database Integration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Implemented Tables</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Users - Store user profiles with roles (officer/member)</li>
                <li>Alliances - Store alliance information</li>
                <li>Battlegroups - Organize alliance members into groups</li>
                <li>Champions - Master list of all MCOC champions</li>
                <li>User Champions - Track user's champion collection</li>
                <li>War Seasons - Track alliance war seasons</li>
                <li>Wars - Individual war data</li>
                <li>Defense Nodes - War defense assignments</li>
                <li>Attack Assignments - War attack planning</li>
              </ul>
            </div>

            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Data Relationships</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Users belong to Alliances</li>
                <li>Alliances have multiple Battlegroups</li>
                <li>Users own Champions (with rarity and rank)</li>
                <li>Wars belong to Seasons and Alliances</li>
                <li>Defense Nodes and Attack Assignments link to Wars</li>
                <li>Battlegroups contain Members (users)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Authentication &
            Authorization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Authentication Features</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Email/Password authentication</li>
                <li>Google OAuth integration</li>
                <li>Protected routes with authentication checks</li>
                <li>User session management</li>
                <li>User profile data linked to auth</li>
              </ul>
            </div>

            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Authorization Controls</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Role-based access (officer vs member)</li>
                <li>Row-Level Security in database</li>
                <li>User can only manage their own champions</li>
                <li>Officers can manage alliance settings</li>
                <li>Data access policies implemented</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Implemented Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Champion Management</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Champion list by class</li>
                <li>Add champions to collection</li>
                <li>Set champion rarity (6-Star, 7-Star)</li>
                <li>Set champion rank (R5, R6, etc.)</li>
                <li>Remove champions from collection</li>
                <li>Search and filter champions</li>
              </ul>
            </div>

            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Member Management</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Add members with in-game name and LINE ID</li>
                <li>View member details and champion roster</li>
                <li>Generate QR codes for roster updates</li>
                <li>No-auth roster update via QR code</li>
                <li>Assign members to battlegroups</li>
                <li>Track member champion statistics</li>
              </ul>
            </div>

            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">War Planning</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Interactive war map</li>
                <li>Defense node assignments</li>
                <li>Attack path planning</li>
                <li>War season tracking</li>
                <li>War results and statistics</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" /> QR Code Integration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">QR Code Features</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Generate unique QR codes for each member</li>
                <li>QR codes link to no-auth roster update page</li>
                <li>Members can scan QR to update their roster</li>
                <li>Copy shareable links for distribution</li>
                <li>Secure access to member-specific data</li>
              </ul>
            </div>

            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Roster Update Page</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>No authentication required</li>
                <li>View existing champion roster</li>
                <li>Add new champions with proper rarity/rank</li>
                <li>Remove champions from roster</li>
                <li>Filter champions by class</li>
                <li>Real-time updates to database</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" /> Technical Implementation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Frontend Architecture</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>React with TypeScript</li>
                <li>Tailwind CSS for styling</li>
                <li>ShadCN UI component library</li>
                <li>React Router for navigation</li>
                <li>Context API for state management</li>
                <li>Custom hooks for data fetching</li>
              </ul>
            </div>

            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Backend Services</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Supabase for authentication</li>
                <li>PostgreSQL database</li>
                <li>Row-Level Security policies</li>
                <li>Edge Functions for server logic</li>
                <li>Real-time subscriptions</li>
                <li>Storage for images and assets</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Current Status</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Database schema and migrations implemented</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Authentication system working</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Champion management functionality complete</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Member management with QR code generation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>No-auth roster update system working</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>War map visualization working</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span>Real-time collaboration features in progress</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span>Advanced analytics and reporting in development</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatus;
