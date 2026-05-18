"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Goal } from "@/types";
import { CheckCircle2, XCircle, Edit3, MessageSquare, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function ApprovalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [comment, setComment] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editWeightage, setEditWeightage] = useState(0);
  const [search, setSearch] = useState("");
  const [actionDone, setActionDone] = useState<Record<string, "approved" | "rejected">>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get("/goals/pending");
        setGoals(res.goals || []);
      } catch (error) {
        toast.error("Failed to load pending goals");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchPending();
    }
  }, [user]);

  const filtered = goals.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.user_id?.toLowerCase().includes(search.toLowerCase())
  );

  const processAction = async (id: string, approved: boolean, data: any = {}) => {
    try {
      await api.post(`/goals/${id}/approve`, { approved, ...data });
      setActionDone((p) => ({ ...p, [id]: approved ? "approved" : "rejected" }));
      toast.success(`Goal ${approved ? "approved" : "rejected"} successfully`);
    } catch (error: any) {
      toast.error(error.message || `Failed to process goal`);
    }
  };

  const handleApprove = (id: string) => processAction(id, true);
  const handleReject = (id: string) => processAction(id, false);

  const openEdit = (goal: Goal) => {
    setEditGoal(goal);
    setEditTitle(goal.title);
    setEditWeightage(goal.weightage);
    setComment("");
  };

  const saveEdit = async () => {
    if (editGoal) {
      await processAction(editGoal.id, true, {
        title: editTitle,
        weightage: editWeightage,
        manager_comment: comment,
      });
      setGoals((prev) => prev.map((g) => g.id === editGoal.id ? { ...g, title: editTitle, weightage: editWeightage } : g));
      setEditGoal(null);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading pending goals...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pending Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve team goal submissions</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by goal or employee..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <p className="font-medium">All caught up!</p>
            <p className="text-sm text-muted-foreground mt-1">No pending approvals at the moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((goal) => (
            <Card key={goal.id} className={`transition-all duration-300 ${actionDone[goal.id] ? "opacity-60" : "hover:shadow-md"}`}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{goal.title}</h3>
                      {actionDone[goal.id] && (
                        <Badge variant={actionDone[goal.id] === "approved" ? "success" : "danger"}>
                          {actionDone[goal.id]}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                      <span><strong className="text-foreground">User ID: {goal.user_id}</strong></span>
                      <span>{goal.thrust_area}</span>
                      <span>Weightage: {goal.weightage}%</span>
                      <span>{goal.quarter}</span>
                    </div>
                  </div>
                  {!actionDone[goal.id] && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" onClick={() => handleApprove(goal.id)} className="gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEdit(goal)} className="gap-1">
                        <Edit3 className="w-4 h-4" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(goal.id)} className="gap-1 text-destructive hover:text-destructive">
                        <XCircle className="w-4 h-4" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editGoal} onOpenChange={() => setEditGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit & Approve Goal</DialogTitle>
            <DialogDescription>Make changes before approving this goal.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Goal Title</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Weightage (%)</Label>
              <Input type="number" value={editWeightage} onChange={(e) => setEditWeightage(parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Comment for Employee</Label>
              <Textarea placeholder="Add feedback or suggestions..." value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditGoal(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save & Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
