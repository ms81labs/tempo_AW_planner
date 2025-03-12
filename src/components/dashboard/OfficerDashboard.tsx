import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Shield, Users, Map, Trophy, Plus, ChevronRight } from "lucide-react";
import DashboardCard from "./DashboardCard";
import Header from "../layout/Header";

const OfficerDashboard = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header userRole="officer" />

      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Officer Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage your alliance war strategy and team assignments
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => (window.location.href = "/battlegroups")}
              >
                <Users className="h-4 w-4" />
                Manage Members
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New War
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="battlegroups">Battlegroups</TabsTrigger>
              <TabsTrigger value="defense">Defense</TabsTrigger>
              <TabsTrigger value="attack">Attack</TabsTrigger>
              <TabsTrigger value="season">Season</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Current War Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Defense Placement
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          Complete
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Attack Phase
                        </span>
                        <span className="text-sm font-bold text-amber-600">
                          In Progress
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Time Remaining
                        </span>
                        <span className="text-sm font-bold">16h 24m</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Current Score
                        </span>
                        <span className="text-sm font-bold">1,245 - 980</span>
                      </div>
                      <Button variant="outline" className="w-full mt-2 gap-1">
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Battlegroup Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Battlegroup 1
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          10/10 Members
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Battlegroup 2
                        </span>
                        <span className="text-sm font-bold text-amber-600">
                          8/10 Members
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Battlegroup 3
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          7/10 Members
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-sm font-bold">25/30 Members</span>
                      </div>
                      <Button variant="outline" className="w-full mt-2 gap-1">
                        Manage Battlegroups
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Season Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Current Season
                        </span>
                        <span className="text-sm font-bold">Season 42</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Wars Completed
                        </span>
                        <span className="text-sm font-bold">7/12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Record</span>
                        <span className="text-sm font-bold">5W - 2L - 0D</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Current Tier
                        </span>
                        <span className="text-sm font-bold">Tier 3</span>
                      </div>
                      <Button variant="outline" className="w-full mt-2 gap-1">
                        View Season Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-xl font-bold mt-8 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                  title="Manage Battlegroups"
                  description="Organize members into battlegroups and review team composition"
                  icon={Users}
                  buttonText="Manage"
                />
                <DashboardCard
                  title="Defense Planner"
                  description="Assign champions to defense nodes and optimize placement"
                  icon={Shield}
                  buttonText="Plan Defense"
                />
                <DashboardCard
                  title="War Map"
                  description="View the interactive war map and plan attack paths"
                  icon={Map}
                  buttonText="View Map"
                />
                <DashboardCard
                  title="Season Tracker"
                  description="Track alliance performance across the war season"
                  icon={Trophy}
                  buttonText="View Stats"
                />
              </div>
            </TabsContent>

            <TabsContent value="battlegroups">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">Battlegroups Content</h2>
                <p>Battlegroup management interface will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="defense">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">
                  Defense Planning Content
                </h2>
                <p>Defense planning interface will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="attack">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">
                  Attack Planning Content
                </h2>
                <p>Attack planning interface will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="season">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">
                  Season Tracking Content
                </h2>
                <p>Season tracking interface will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
