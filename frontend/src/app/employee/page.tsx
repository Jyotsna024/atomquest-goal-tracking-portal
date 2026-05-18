"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { Target, TrendingUp, Clock, CheckCircle2, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Goal, CheckIn, Notification } from "@/types";

const statusVariant = (s: string) => {
  if (s === "on-track" || s === "completed") return "success" as const;
  if (s === "at-risk") return "warning" as const;
  if (s === "behind") return "danger" as const;
  return "secondary" as const;
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [pendingCheckins, setPendingCheckins] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [goalsRes, checkinsRes] = await Promise.all([
          api.get("/goals"),
          api.get("/checkins")
        ]);
        
        setGoals(goalsRes.goals || []);
        
        const pending = (checkinsRes.checkins || []).filter((c: CheckIn) => c.status === "draft" || c.status === "submitted").length;
        setPendingCheckins(pending);
        
        // Real notifications not fully bound to employee side yet, use empty for now or fetch if API exists
        // setRecentNotifications(notificationsRes.notifications || []);
        
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard...</div>;
  }

  const avgProgress = goals.length ? Math.round(goals.reduce((a, g) => a + (g.progress || 0), 0) / goals.length) : 0;
  const onTrack = goals.filter((g) => g.status === "on-track").length;
  const atRisk = goals.filter((g) => g.status === "at-risk").length;
  const behind = goals.filter((g) => g.status === "behind").length;

  const stats = [
    { label: "Total Goals", value: goals.length, icon: Target, color: "text-primary", bg: "bg-primary/10" },
    { label: "Avg Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "On Track", value: onTrack, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "At Risk", value: atRisk + behind, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your goal progress overview for Q2 2026</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${s.bg}`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal progress list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Goals</h2>
            <Link href="/employee/goals">
              <Button variant="ghost" size="sm">View all <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>
          <div className="space-y-3">
            {goals.length === 0 ? (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="p-8 text-center">
                  <Target className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">No goals set for this quarter</p>
                  <Link href="/employee/goals/new">
                    <Button variant="outline" className="mt-4">Create Goal</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              goals.slice(0, 5).map((goal) => (
                <Card key={goal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm truncate">{goal.title}</h3>
                          <Badge variant={statusVariant(goal.status)} className="shrink-0">
                            {goal.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{goal.thrust_area || (goal as any).category} · {goal.weightage}% weightage</p>
                        <div className="flex items-center gap-3">
                          <Progress value={goal.progress || 0} className="flex-1 h-2" />
                          <span className="text-sm font-semibold text-muted-foreground w-10 text-right">{goal.progress || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Pending check-ins */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" /> Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Pending action</span>
                <Badge variant="warning">{pendingCheckins}</Badge>
              </div>
              <Link href="/employee/check-in">
                <Button variant="outline" size="sm" className="w-full">View Check-ins <ArrowRight className="w-4 h-4 ml-1" /></Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentNotifications.length === 0 ? (
                 <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
              ) : recentNotifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === "success" ? "bg-emerald-500" : n.type === "warning" ? "bg-amber-500" : n.type === "error" ? "bg-red-500" : "bg-blue-500"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.message}</p>
                  </div>
                </div>
              ))}
              <Link href="/notifications">
                <Button variant="ghost" size="sm" className="w-full mt-2">View all</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Weightage summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Weightage Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {goals.map((g) => (
                  <div key={g.id} className="flex items-center justify-between text-sm">
                    <span className="truncate text-muted-foreground flex-1 mr-2">{g.title}</span>
                    <span className="font-semibold">{g.weightage}%</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className={goals.reduce((a, g) => a + g.weightage, 0) === 100 ? "text-emerald-600" : "text-destructive"}>
                    {goals.reduce((a, g) => a + g.weightage, 0)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
