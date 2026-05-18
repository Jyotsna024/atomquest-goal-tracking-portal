"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { TeamMemberStat, Goal, CheckIn } from "@/types";
import { Search, MessageSquare, Eye, TrendingUp, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function TeamPage() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMemberStat[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMemberStat | null>(null);
  const [memberGoals, setMemberGoals] = useState<Goal[]>([]);
  const [memberCheckins, setMemberCheckins] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get("/analytics/team");
        setTeamMembers(res || []);
      } catch (error) {
        toast.error("Failed to load team data");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchTeam();
    }
  }, [user]);

  const loadMemberDetails = async (member: TeamMemberStat) => {
    setSelectedMember(member);
    try {
      // Typically there would be a manager endpoint to fetch a specific user's goals. 
      // Using an admin/general endpoint if accessible, or falling back.
      const goalsRes = await api.get("/goals", { user_id: member.user_id });
      const checkinsRes = await api.get("/checkins"); // Would filter by user_id in real app
      setMemberGoals(goalsRes.goals || []);
      setMemberCheckins(checkinsRes.checkins?.filter((c: any) => c.user_id === member.user_id) || []);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.department.toLowerCase().includes(search.toLowerCase())
  );

  const avgCompletion = teamMembers.length ? Math.round(teamMembers.reduce((a, m) => a + m.completion_rate, 0) / teamMembers.length) : 0;
  const onTrack = teamMembers.filter((m) => m.status === "on-track").length;

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading team data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Team Performance</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor your team&apos;s goal progress and check-in status</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10"><Users className="w-5 h-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Team Size</p><p className="text-2xl font-bold">{teamMembers.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
            <div><p className="text-sm text-muted-foreground">Avg Completion</p><p className="text-2xl font-bold">{avgCompletion}%</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950"><Eye className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-sm text-muted-foreground">On Track</p><p className="text-2xl font-bold">{onTrack}/{teamMembers.length}</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search team members..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Team table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>Goals</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                 <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No team members found</TableCell></TableRow>
              ) : (
                filtered.map((member) => (
                  <TableRow key={member.user_id} className="cursor-pointer" onClick={() => loadMemberDetails(member)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{member.designation}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{member.department}</TableCell>
                    <TableCell className="text-sm font-medium">{member.goals_count}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress value={member.completion_rate} className="flex-1 h-2" />
                        <span className="text-xs font-semibold w-8 text-right">{member.completion_rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === "on-track" ? "success" : member.status === "at-risk" ? "warning" : "danger"}>
                        {member.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Member detail dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMember.name}</DialogTitle>
                <DialogDescription>{selectedMember.designation} · {selectedMember.department}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="goals" className="mt-2">
                <TabsList>
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                  <TabsTrigger value="checkins">Check-ins</TabsTrigger>
                </TabsList>
                <TabsContent value="goals" className="space-y-3 mt-4 max-h-[50vh] overflow-y-auto">
                  {memberGoals.length === 0 ? <p className="text-sm text-muted-foreground">No goals found for this member.</p> : 
                  memberGoals.map((goal) => (
                    <div key={goal.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{goal.title}</p>
                        <Badge variant={goal.status === "on-track" ? "success" : "warning"}>{goal.status.replace("-"," ")}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={goal.progress || 0} className="flex-1 h-1.5" />
                        <span className="text-xs font-semibold">{goal.progress || 0}%</span>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="checkins" className="space-y-3 mt-4 max-h-[50vh] overflow-y-auto">
                  {memberCheckins.length === 0 ? <p className="text-sm text-muted-foreground">No check-ins found.</p> :
                  memberCheckins.map((ci) => (
                    <div key={ci.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Goal ID: {ci.goal_id}</p>
                        <Badge variant={ci.status === "reviewed" ? "success" : "warning"}>{ci.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{ci.employee_comment}</p>
                      {ci.manager_comment && (
                        <div className="mt-2 p-2 rounded bg-primary/5 border border-primary/10">
                          <p className="text-xs"><MessageSquare className="w-3 h-3 inline mr-1" />Manager: {ci.manager_comment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
