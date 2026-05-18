"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, TrendingUp, AlertTriangle, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { mockEscalations, mockAuditLogs } from "@/lib/mock-data";

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [chartReady, setChartReady] = useState(false);
  const [summary, setSummary] = useState<any>({});
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { setChartReady(true); }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [sumRes, deptRes] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/departments")
        ]);
        setSummary(sumRes);
        setDepartments(deptRes || []);
      } catch (error) {
        toast.error("Failed to load admin data");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const openEscalations = mockEscalations.filter((e) => e.status === "open" || e.status === "in-progress").length;
  const criticalEscalations = mockEscalations.filter((e) => e.severity === "critical").length;

  const stats = [
    { label: "Total Employees", value: summary.total_employees || 0, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Goals", value: summary.total_goals || 0, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Completion Rate", value: `${summary.completion_rate || 0}%`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
    { label: "Open Escalations", value: openEscalations, icon: AlertTriangle, color: criticalEscalations > 0 ? "text-red-600" : "text-amber-600", bg: criticalEscalations > 0 ? "bg-red-50 dark:bg-red-950" : "bg-amber-50 dark:bg-amber-950" },
  ];

  const categoryBreakdown = [
    { category: "Process Automation", count: 12, percentage: 35 },
    { category: "Client Retention", count: 8, percentage: 25 },
    { category: "Upskilling", count: 7, percentage: 20 },
    { category: "Revenue Growth", count: 5, percentage: 15 },
    { category: "Team Building", count: 2, percentage: 5 },
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Organization-wide performance overview &amp; system health</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Department Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px]" style={{ minWidth: 0 }}>
              {chartReady && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departments} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="department" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                    <Bar dataKey="completion_rate" name="Completion %" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="avg_progress" name="Avg Progress %" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Goal Category Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px] flex items-center gap-4">
              <div className="w-1/2 h-full" style={{ minWidth: 0 }}>
                {chartReady && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryBreakdown} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="count" nameKey="category" stroke="none">
                        {categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="flex-1 space-y-2">
                {categoryBreakdown.map((cat, i) => (
                  <div key={cat.category} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground truncate flex-1">{cat.category}</span>
                    <span className="font-medium">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Escalations</CardTitle>
              <Link href="/admin/escalations"><Button variant="ghost" size="sm">View all <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockEscalations.slice(0, 3).map((esc) => (
              <div key={esc.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${esc.severity === "critical" ? "text-red-500" : esc.severity === "high" ? "text-amber-500" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="text-sm font-medium">{esc.type}</p>
                    <Badge variant={esc.severity === "critical" ? "danger" : esc.severity === "high" ? "warning" : "secondary"} className="text-[10px]">{esc.severity}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{esc.description}</p>
                </div>
                <Badge variant={esc.status === "open" ? "warning" : esc.status === "resolved" ? "success" : "info"} className="shrink-0 text-[10px]">{esc.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Link href="/admin/audits"><Button variant="ghost" size="sm">View all <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAuditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Activity className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{log.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{log.performedBy} · {log.target}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
