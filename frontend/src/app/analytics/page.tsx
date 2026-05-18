"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Users, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend,
} from "recharts";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { mockHeatmapData } from "@/lib/mock-data"; // Keeping heatmap mock as backend doesn't have it yet

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const heatmapColor = (v: number) => {
  if (v >= 8) return "bg-emerald-600";
  if (v >= 6) return "bg-emerald-500";
  if (v >= 4) return "bg-emerald-400";
  if (v >= 2) return "bg-emerald-300";
  if (v >= 1) return "bg-emerald-200";
  return "bg-muted";
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [chartReady, setChartReady] = useState(false);
  const [activeTab, setActiveTab] = useState("trends");
  
  const [summary, setSummary] = useState<any>({});
  const [departments, setDepartments] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setChartReady(true);
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [sumRes, deptRes, trendsRes] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/departments"),
          api.get("/analytics/trends")
        ]);
        setSummary(sumRes);
        setDepartments(deptRes || []);
        
        // Format trends for charts if needed
        const formattedTrends = (trendsRes || []).map((t: any) => ({
          quarter: t.quarter,
          completionRate: t.completion_rate,
          goalsSet: t.goals_set,
          goalsCompleted: t.goals_completed,
        }));
        setTrends(formattedTrends);
        
      } catch (error) {
        toast.error("Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  // Force re-render charts when tab changes so ResponsiveContainer recalculates
  const [chartKey, setChartKey] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setChartKey((k) => k + 1), 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const stats = [
    { label: "Completion Rate", value: `${summary.completion_rate || 0}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Total Goals", value: summary.total_goals || 0, icon: Target, color: "text-primary", bg: "bg-primary/10" },
    { label: "Employees", value: summary.total_employees || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
    { label: "Avg Progress", value: `${summary.avg_progress || 0}%`, icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
  ];

  // Dummy category and monthly data to maintain UI richness since backend is MVP
  const categoryBreakdown = [
    { category: "Process Automation", count: 12, percentage: 35 },
    { category: "Client Retention", count: 8, percentage: 25 },
    { category: "Upskilling", count: 7, percentage: 20 },
    { category: "Revenue Growth", count: 5, percentage: 15 },
    { category: "Team Building", count: 2, percentage: 5 },
  ];
  const monthlyProgress = [
    { month: "Apr", target: 33, progress: 30 },
    { month: "May", target: 66, progress: 55 },
    { month: "Jun", target: 100, progress: 85 },
  ];

  const weeks = [...new Set(mockHeatmapData.map((d) => d.week))].sort((a, b) => a - b);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Organization-wide goal analytics and performance insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div>
                <div className={`p-3 rounded-xl ${s.bg}`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">QoQ Trends</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="heatmap">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" forceMount className={activeTab !== "trends" ? "hidden" : ""}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Quarter-over-Quarter Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[350px]" style={{ minWidth: 0 }}>
                {chartReady && (
                  <ResponsiveContainer key={`trends-${chartKey}`} width="100%" height="100%">
                    <LineChart data={trends} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="quarter" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                      <Legend />
                      <Line type="monotone" dataKey="completionRate" name="Completion %" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="goalsSet" name="Goals Set" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="goalsCompleted" name="Goals Completed" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" forceMount className={activeTab !== "departments" ? "hidden" : ""}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Department Performance Comparison</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[350px]" style={{ minWidth: 0 }}>
                {chartReady && (
                  <ResponsiveContainer key={`dept-${chartKey}`} width="100%" height="100%">
                    <BarChart data={departments} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="department" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                      <Legend />
                      <Bar dataKey="completion_rate" name="Completion %" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="avg_progress" name="Avg Progress %" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" forceMount className={activeTab !== "categories" ? "hidden" : ""}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Goal Distribution by Category</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[320px]" style={{ minWidth: 0 }}>
                  {chartReady && (
                    <ResponsiveContainer key={`cat-${chartKey}`} width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryBreakdown} cx="50%" cy="50%" outerRadius={120} innerRadius={60} dataKey="count" nameKey="category" stroke="none"
                          label={({ percent }: { percent?: number }) => `${Math.round((percent || 0) * 100)}%`}>
                          {categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Category Details</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  {categoryBreakdown.map((cat, i) => (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-sm font-medium">{cat.category}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{cat.count} goals ({cat.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" forceMount className={activeTab !== "monthly" ? "hidden" : ""}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Progress vs Target</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[350px]" style={{ minWidth: 0 }}>
                {chartReady && (
                  <ResponsiveContainer key={`monthly-${chartKey}`} width="100%" height="100%">
                    <AreaChart data={monthlyProgress} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                      <Legend />
                      <Area type="monotone" dataKey="target" name="Target" stroke="#e2e8f0" fill="hsl(var(--muted))" strokeWidth={2} />
                      <Area type="monotone" dataKey="progress" name="Actual" stroke="#4f46e5" fill="hsl(var(--primary) / 0.15)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Goal Activity Heatmap (Q2 2026)</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="flex gap-1 min-w-[600px]">
                  <div className="flex flex-col gap-1 mr-2 pt-6">
                    {days.map((d) => <div key={d} className="h-5 flex items-center text-xs text-muted-foreground">{d}</div>)}
                  </div>
                  {weeks.map((week) => (
                    <div key={week} className="flex flex-col gap-1">
                      <div className="text-[10px] text-muted-foreground text-center h-5 flex items-center justify-center">W{week}</div>
                      {days.map((day) => {
                        const cell = mockHeatmapData.find((c) => c.week === week && c.day === day);
                        return (
                          <div key={`${week}-${day}`} className={`w-5 h-5 rounded-sm ${heatmapColor(cell?.value || 0)} transition-colors`} title={`${day} W${week}: ${cell?.value || 0} activities`} />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                  <span>Less</span>
                  {["bg-muted", "bg-emerald-200", "bg-emerald-300", "bg-emerald-400", "bg-emerald-500", "bg-emerald-600"].map((c) => (
                    <div key={c} className={`w-4 h-4 rounded-sm ${c}`} />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
