"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CURRENT_QUARTER } from "@/lib/constants";
import { Star, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Goal, CheckIn } from "@/types";
import { toast } from "sonner";

export default function CheckInPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [pastCheckins, setPastCheckins] = useState<CheckIn[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [achievements, setAchievements] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsRes, checkinsRes] = await Promise.all([
          api.get("/goals", { status: "approved" }),
          api.get("/checkins")
        ]);
        
        const approvedGoals = goalsRes.goals || [];
        setGoals(approvedGoals);
        setPastCheckins(checkinsRes.checkins || []);
        
        // Init states
        const initialAch: Record<string, number> = {};
        approvedGoals.forEach((g: Goal) => initialAch[g.id] = (g as any).achievement || 0);
        setAchievements(initialAch);

      } catch (error) {
        toast.error("Failed to load check-in data");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleRating = (goalId: string, rating: number) => {
    setRatings((p) => ({ ...p, [goalId]: rating }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const promises = goals.map((goal) => {
        return api.post("/checkins", {
          goal_id: goal.id,
          quarter: CURRENT_QUARTER,
          achievement: achievements[goal.id] || 0,
          self_rating: ratings[goal.id] || null,
          employee_comment: comments[goal.id] || "",
        });
      });
      await Promise.all(promises);
      toast.success("Check-ins submitted successfully");
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit check-ins");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading check-ins...</div>;
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold">Check-in Submitted!</h2>
        <p className="text-muted-foreground mt-2">Your quarterly self-assessment has been sent to your manager for review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Quarterly Check-in</h1>
        <p className="text-muted-foreground text-sm mt-1">Self-assess your goal progress for {CURRENT_QUARTER}</p>
      </div>

      {/* Previous check-ins */}
      {pastCheckins.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Previous Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastCheckins.map((ci) => {
                const matchedGoal = goals.find(g => g.id === ci.goal_id);
                return (
                  <div key={ci.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{matchedGoal?.title || "Goal"}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">Self: {ci.self_rating || "N/A"}/5</span>
                        {ci.manager_rating && <span className="text-xs text-muted-foreground">Manager: {ci.manager_rating}/5</span>}
                      </div>
                    </div>
                    <Badge variant={ci.status === "reviewed" ? "success" : ci.status === "submitted" ? "warning" : "secondary"}>
                      {ci.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current check-in forms */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Current Quarter Assessment</h2>
        {goals.length === 0 ? (
          <p className="text-muted-foreground p-4 text-center border rounded-lg bg-muted/50">You have no approved goals to check in on.</p>
        ) : (
          goals.map((goal) => (
            <Card key={goal.id} className="animate-slide-in">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    <CardDescription className="mt-1">{goal.thrust_area || (goal as any).category} · {goal.weightage}% weightage</CardDescription>
                  </div>
                  <Badge variant={goal.status === "on-track" ? "success" : goal.status === "at-risk" ? "warning" : "danger"}>
                    {goal.status.replace("-", " ")}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <Progress value={goal.progress || 0} className="flex-1 h-2" />
                  <span className="text-sm font-semibold">{goal.progress || 0}%</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Update Achievement (Current: {goal.achievement} / Target: {goal.target})</Label>
                  <Input 
                    type="number" 
                    value={achievements[goal.id] || 0} 
                    onChange={(e) => setAchievements(p => ({ ...p, [goal.id]: parseInt(e.target.value) || 0 }))}
                    max={goal.target}
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Self Rating (Optional)</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => handleRating(goal.id, star)} className="cursor-pointer p-0.5 transition-transform hover:scale-110">
                        <Star className={`w-6 h-6 ${(ratings[goal.id] || 0) >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                      </button>
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">{ratings[goal.id] || 0}/5</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Self Assessment Comments</Label>
                  <Textarea placeholder="Describe your progress, challenges, and achievements..." value={comments[goal.id] || ""} onChange={(e) => setComments((p) => ({ ...p, [goal.id]: e.target.value }))} rows={3} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={handleSubmit} disabled={isSubmitting || goals.length === 0}>
          {isSubmitting ? "Submitting..." : "Submit Check-in"}
        </Button>
      </div>
    </div>
  );
}
