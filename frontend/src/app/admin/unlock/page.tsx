"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { mockGoals } from "@/lib/mock-data";
import { Search, Unlock, Lock, AlertTriangle } from "lucide-react";

const lockedGoals = mockGoals.map((g) => ({ ...g, locked: g.status !== "draft" && g.status !== "pending" }));

export default function GoalUnlockPage() {
  const [search, setSearch] = useState("");
  const [unlockGoal, setUnlockGoal] = useState<typeof lockedGoals[0] | null>(null);
  const [reason, setReason] = useState("");
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  const filtered = lockedGoals.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) || g.employeeName.toLowerCase().includes(search.toLowerCase())
  );

  const handleUnlock = () => {
    if (unlockGoal) {
      setUnlocked((p) => new Set(p).add(unlockGoal.id));
      setUnlockGoal(null);
      setReason("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Goal Unlock Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Unlock goals for editing after the submission deadline</p>
      </div>

      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Administrative Action Required</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Unlocking a goal allows the employee to edit it after the lock period. All unlock actions are recorded in the audit log.</p>
          </div>
        </CardContent>
      </Card>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by goal or employee..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map((goal) => {
          const isUnlocked = unlocked.has(goal.id);
          return (
            <Card key={goal.id} className={isUnlocked ? "opacity-60" : "hover:shadow-md transition-shadow"}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className={`p-2 rounded-lg shrink-0 ${isUnlocked ? "bg-emerald-50 dark:bg-emerald-950" : goal.locked ? "bg-red-50 dark:bg-red-950" : "bg-muted"}`}>
                    {isUnlocked ? <Unlock className="w-5 h-5 text-emerald-600" /> : goal.locked ? <Lock className="w-5 h-5 text-red-600" /> : <Unlock className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-sm">{goal.title}</h3>
                      {isUnlocked && <Badge variant="success">Unlocked</Badge>}
                      {!isUnlocked && goal.locked && <Badge variant="danger">Locked</Badge>}
                      {!isUnlocked && !goal.locked && <Badge variant="secondary">Editable</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{goal.employeeName} · {goal.category} · {goal.quarter}</p>
                  </div>
                  {goal.locked && !isUnlocked && (
                    <Button size="sm" variant="outline" onClick={() => setUnlockGoal(goal)} className="shrink-0">
                      <Unlock className="w-4 h-4 mr-1" /> Unlock
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!unlockGoal} onOpenChange={() => setUnlockGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Goal for Editing</DialogTitle>
            <DialogDescription>This will allow the employee to modify &quot;{unlockGoal?.title}&quot;</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
              This action will be recorded in the audit log. The employee will be notified.
            </div>
            <div className="space-y-2">
              <Label>Reason for Unlock *</Label>
              <Textarea placeholder="Provide a reason for unlocking this goal..." value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setUnlockGoal(null)}>Cancel</Button>
            <Button onClick={handleUnlock} disabled={!reason.trim()}>Confirm Unlock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
