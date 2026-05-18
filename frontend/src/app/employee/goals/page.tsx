"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Goal } from "@/types";
import { Search, Plus, Filter, Eye, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const statusVariant = (s: string) => {
  if (s === "on-track" || s === "completed" || s === "approved") return "success" as const;
  if (s === "at-risk" || s === "pending") return "warning" as const;
  if (s === "behind" || s === "rejected") return "danger" as const;
  return "secondary" as const;
};

export default function GoalsListPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await api.get("/goals");
        setGoals(res.goals || []);
      } catch (error) {
        toast.error("Failed to load goals");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const filtered = goals.filter((g) => {
    const cat = g.thrust_area || (g as any).category || "";
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) || cat.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading goals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Goals</h1>
          <p className="text-muted-foreground text-sm mt-1">Track and manage your performance goals</p>
        </div>
        <Link href="/employee/goals/new">
          <Button><Plus className="w-4 h-4 mr-2" /> Create Goal</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search goals..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="behind">Behind</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Goals table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{filtered.length} Goals</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-medium">No goals found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Goal</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Weightage</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((goal) => (
                  <TableRow key={goal.id} className="cursor-pointer" onClick={() => setSelected(goal)}>
                    <TableCell>
                      <p className="font-medium text-sm">{goal.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 md:hidden">{goal.thrust_area || (goal as any).category}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{goal.thrust_area || (goal as any).category}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm font-medium">{goal.weightage}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={goal.progress || 0} className="flex-1 h-2" />
                        <span className="text-xs font-semibold w-8 text-right">{goal.progress || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(goal.status)}>{goal.status.replace("-", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Goal detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.thrust_area || (selected as any).category} · {selected.weightage}% weightage</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={selected.progress || 0} className="flex-1 h-3" />
                  <span className="text-lg font-bold">{selected.progress || 0}%</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selected.due_date && <div><span className="text-muted-foreground">Due Date</span><p className="font-medium mt-0.5">{formatDate(selected.due_date)}</p></div>}
                  <div><span className="text-muted-foreground">Quarter</span><p className="font-medium mt-0.5">{selected.quarter}</p></div>
                  <div><span className="text-muted-foreground">Status</span><p className="mt-0.5"><Badge variant={statusVariant(selected.status)}>{selected.status.replace("-", " ")}</Badge></p></div>
                  <div><span className="text-muted-foreground">Locked</span><p className="font-medium mt-0.5">{selected.locked ? "Yes" : "No"}</p></div>
                </div>
                {selected.manager_comment && (
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Manager Feedback</h4>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">{selected.manager_comment}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
