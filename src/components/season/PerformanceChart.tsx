import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, LineChart, TrendingUp, PieChart } from "lucide-react";

interface PerformanceData {
  war: number;
  attackKills: number;
  defenseKills: number;
  diversity: number;
  score: number;
}

interface PerformanceChartProps {
  data?: PerformanceData[];
  seasonId?: string;
}

const defaultData: PerformanceData[] = [
  { war: 1, attackKills: 45, defenseKills: 32, diversity: 85, score: 1250 },
  { war: 2, attackKills: 48, defenseKills: 28, diversity: 90, score: 1320 },
  { war: 3, attackKills: 50, defenseKills: 35, diversity: 95, score: 1400 },
  { war: 4, attackKills: 43, defenseKills: 30, diversity: 80, score: 1180 },
  { war: 5, attackKills: 49, defenseKills: 33, diversity: 90, score: 1350 },
  { war: 6, attackKills: 47, defenseKills: 31, diversity: 85, score: 1290 },
  { war: 7, attackKills: 51, defenseKills: 36, diversity: 95, score: 1420 },
  { war: 8, attackKills: 46, defenseKills: 29, diversity: 85, score: 1270 },
  { war: 9, attackKills: 44, defenseKills: 27, diversity: 80, score: 1200 },
  { war: 10, attackKills: 49, defenseKills: 34, diversity: 90, score: 1360 },
  { war: 11, attackKills: 52, defenseKills: 38, diversity: 100, score: 1450 },
  { war: 12, attackKills: 50, defenseKills: 35, diversity: 95, score: 1400 },
];

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data = defaultData,
  seasonId = "current",
}) => {
  const [chartType, setChartType] = useState("line");
  const [metric, setMetric] = useState("score");

  // Calculate averages for summary
  const averageScore = Math.round(
    data.reduce((acc, curr) => acc + curr.score, 0) / data.length,
  );
  const averageAttackKills = Math.round(
    data.reduce((acc, curr) => acc + curr.attackKills, 0) / data.length,
  );
  const averageDefenseKills = Math.round(
    data.reduce((acc, curr) => acc + curr.defenseKills, 0) / data.length,
  );
  const averageDiversity = Math.round(
    data.reduce((acc, curr) => acc + curr.diversity, 0) / data.length,
  );

  // Render the chart based on selected type
  const renderChart = () => {
    // In a real implementation, this would use a charting library like recharts
    // For this scaffolding, we'll create a visual representation with divs

    if (chartType === "line") {
      return (
        <div className="h-64 w-full bg-background border rounded-md p-4 relative">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <LineChart className="w-12 h-12 mr-2" />
            <span className="text-lg">
              Line Chart visualization for {metric}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2">
            {data.map((item) => (
              <div key={item.war} className="text-xs text-muted-foreground">
                {item.war}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (chartType === "bar") {
      return (
        <div className="h-64 w-full bg-background border rounded-md p-4 relative">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <BarChart className="w-12 h-12 mr-2" />
            <span className="text-lg">
              Bar Chart visualization for {metric}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2">
            {data.map((item) => (
              <div key={item.war} className="text-xs text-muted-foreground">
                {item.war}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (chartType === "pie") {
      return (
        <div className="h-64 w-full bg-background border rounded-md p-4 relative">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <PieChart className="w-12 h-12 mr-2" />
            <span className="text-lg">
              Pie Chart visualization for {metric}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Season Performance</CardTitle>
          <div className="flex space-x-2">
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>

            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Total Score</SelectItem>
                <SelectItem value="attackKills">Attack Kills</SelectItem>
                <SelectItem value="defenseKills">Defense Kills</SelectItem>
                <SelectItem value="diversity">Diversity %</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-[200px] grid-cols-2 mb-4">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            {renderChart()}

            <div className="text-sm text-muted-foreground mt-2">
              Showing performance data for {data.length} wars in season{" "}
              {seasonId}
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Avg Score</div>
                <div className="text-2xl font-bold">{averageScore}</div>
              </div>

              <div className="bg-background p-4 rounded-md">
                <div className="text-sm text-muted-foreground">
                  Avg Attack Kills
                </div>
                <div className="text-2xl font-bold">{averageAttackKills}</div>
              </div>

              <div className="bg-background p-4 rounded-md">
                <div className="text-sm text-muted-foreground">
                  Avg Defense Kills
                </div>
                <div className="text-2xl font-bold">{averageDefenseKills}</div>
              </div>

              <div className="bg-background p-4 rounded-md">
                <div className="text-sm text-muted-foreground">
                  Avg Diversity
                </div>
                <div className="text-2xl font-bold">{averageDiversity}%</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-background rounded-md">
              <div className="flex items-center text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>Performance Trend</span>
              </div>
              <p className="text-sm">
                Your alliance has shown{" "}
                {data[data.length - 1].score > data[0].score
                  ? "improvement"
                  : "decline"}{" "}
                in overall performance with a{" "}
                {Math.abs(
                  Math.round(
                    ((data[data.length - 1].score - data[0].score) /
                      data[0].score) *
                      100,
                  ),
                )}
                %
                {data[data.length - 1].score > data[0].score
                  ? "increase"
                  : "decrease"}{" "}
                in score from the first to the last war.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
