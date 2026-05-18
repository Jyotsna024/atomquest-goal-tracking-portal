"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { Users, CheckSquare, AlertTriangle, TrendingUp, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TeamMemberStat, Goal } from "@/types";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMemberStat[]>([]);
  const [pendingGoals, setPendingGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, pendingRes] = await Promise.all([
          api.get("/analytics/team"),
          api.get("/goals/pending")
        ]);
        setTeamMembers(teamRes || []);
        setPendingGoals(pendingRes.goals || []);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard...</div>;
  }

  const teamOnTrack = teamMembers.filter((m) => m.status === "on-track").length;
  const teamAtRisk = teamMembers.filter((m) => m.status !== "on-track").length;
  const avgCompletion = teamMembers.length ? Math.round(teamMembers.reduce((a, m) => a + m.completion_rate, 0) / teamMembers.length) : 0;

  const stats = [
    { label: "Team Members", value: teamMembers.length, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending Approvals", value: pendingGoals.length, icon: CheckSquare, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
    { label: "Avg Completion", value: `${avgCompletion}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "At Risk / Behind", value: teamAtRisk, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Team overview and pending actions for {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${s.bg}`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team performance */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Team Performance</h2>
            <Link href="/manager/team"><Button variant="ghost" size="sm">View all <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
          </div>
          <div className="space-y-3">
            {teamMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg text-center">No team members found.</p>
            ) : (
              teamMembers.map((member) => (
                <Card key={member.user_id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{member.name}</p>
                          <Badge variant={member.status === "on-track" ? "success" : member.status === "at-risk" ? "warning" : "danger"} className="text-[10px]">
                            {member.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{member.designation} · {member.goals_count} goals</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold">{member.completion_rate}%</p>
                        <p className="text-xs text-muted-foreground">completion</p>
                      </div>
                    </div>
                    <Progress value={member.completion_rate} className="mt-3 h-1.5" />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Pending approvals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pending Approvals</h2>
            <Link href="/manager/approvals"><Button variant="ghost" size="sm">View all</Button></Link>
          </div>
          {pendingGoals.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg text-center">No pending approvals.</p>
          ) : (
            pendingGoals.slice(0, 4).map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <p className="font-medium text-sm truncate">{goal.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">User: {goal.user_id} · {goal.thrust_area}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{goal.weightage}% weightage</span>
                    <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/manager/approvals" className="w-full">
                      <Button size="sm" className="w-full h-8 text-xs">Review</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
