"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { GOAL_CATEGORIES, MAX_GOALS, MIN_WEIGHTAGE, TOTAL_WEIGHTAGE, CURRENT_QUARTER } from "@/lib/constants";
import { Plus, Trash2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const goalSchema = z.object({
  title: z.string().min(1, "Title is required").min(5, "Title must be at least 5 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  weightage: z.number().min(MIN_WEIGHTAGE, `Minimum weightage is ${MIN_WEIGHTAGE}%`).max(100, "Maximum weightage is 100%"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

const formSchema = z.object({
  goals: z
    .array(goalSchema)
    .min(1, "At least one goal is required")
    .max(MAX_GOALS, `Maximum ${MAX_GOALS} goals allowed`)
    .refine(
      (goals) => goals.reduce((sum, g) => sum + g.weightage, 0) === TOTAL_WEIGHTAGE,
      { message: `Total weightage must equal ${TOTAL_WEIGHTAGE}%` }
    ),
});

type FormValues = z.infer<typeof formSchema>;

const defaultGoal = {
  title: "",
  description: "",
  category: "",
  weightage: MIN_WEIGHTAGE,
  startDate: "2026-04-01",
  endDate: "2026-06-30",
};

export default function CreateGoalPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { goals: [defaultGoal] },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "goals" });

  const watchGoals = watch("goals");
  const totalWeightage = watchGoals?.reduce((sum, g) => sum + (Number(g.weightage) || 0), 0) ?? 0;
  const canAdd = fields.length < MAX_GOALS;

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Map frontend fields to backend schema
      const backendGoals = data.goals.map((g) => ({
        title: g.title,
        description: g.description,
        thrust_area: g.category,
        uom: "Percentage",
        target: 100,
        weightage: g.weightage,
        quarter: CURRENT_QUARTER,
        due_date: g.endDate,
      }));

      await api.post("/goals/batch", { goals: backendGoals });
      toast.success("Goals submitted successfully!");
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit goals");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold">Goals Submitted!</h2>
        <p className="text-muted-foreground mt-2 max-w-md">{fields.length} goal(s) have been submitted for manager approval for {CURRENT_QUARTER}.</p>
        <div className="flex gap-3 mt-6">
          <Link href="/employee/goals"><Button variant="outline">View My Goals</Button></Link>
          <Link href="/employee"><Button>Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  // Get the array-level refinement error
  const totalError = errors.goals?.root?.message;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/employee/goals"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold">Create Goals</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Set your performance goals for {CURRENT_QUARTER}</p>
        </div>
      </div>

      {/* Weightage indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Total Weightage</span>
            <span className={`text-sm font-bold ${totalWeightage === TOTAL_WEIGHTAGE ? "text-emerald-600" : totalWeightage > TOTAL_WEIGHTAGE ? "text-destructive" : "text-amber-600"}`}>
              {totalWeightage}% / {TOTAL_WEIGHTAGE}%
            </span>
          </div>
          <Progress value={Math.min(totalWeightage, 100)} className="h-2.5" indicatorClassName={totalWeightage === 100 ? "bg-emerald-500" : totalWeightage > 100 ? "bg-destructive" : "bg-amber-500"} />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{fields.length} of {MAX_GOALS} goals</span>
            {totalError && <span className="text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{totalError}</span>}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Goal forms */}
        <div className="space-y-4">
          {fields.map((field, idx) => (
            <Card key={field.id} className="animate-slide-in">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Goal {idx + 1}</CardTitle>
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Goal Title *</Label>
                    <Input
                      placeholder="e.g., Increase API performance by 40%"
                      {...register(`goals.${idx}.title`)}
                      className={errors.goals?.[idx]?.title ? "border-destructive" : ""}
                    />
                    {errors.goals?.[idx]?.title && <p className="text-xs text-destructive">{errors.goals[idx].title.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={watchGoals?.[idx]?.category || ""}
                      onValueChange={(v) => setValue(`goals.${idx}.category`, v, { shouldValidate: true })}
                    >
                      <SelectTrigger className={errors.goals?.[idx]?.category ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {GOAL_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.goals?.[idx]?.category && <p className="text-xs text-destructive">{errors.goals[idx].category.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Weightage (%) *</Label>
                    <Input
                      type="number"
                      min={MIN_WEIGHTAGE}
                      max={100}
                      {...register(`goals.${idx}.weightage`, { valueAsNumber: true })}
                      className={errors.goals?.[idx]?.weightage ? "border-destructive" : ""}
                    />
                    {errors.goals?.[idx]?.weightage && <p className="text-xs text-destructive">{errors.goals[idx].weightage.message}</p>}
                    <p className="text-xs text-muted-foreground">Minimum {MIN_WEIGHTAGE}%</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" {...register(`goals.${idx}.startDate`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" {...register(`goals.${idx}.endDate`)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Description *</Label>
                    <Textarea
                      placeholder="Describe the goal, expected outcomes, and success criteria..."
                      {...register(`goals.${idx}.description`)}
                      rows={3}
                      className={errors.goals?.[idx]?.description ? "border-destructive" : ""}
                    />
                    {errors.goals?.[idx]?.description && <p className="text-xs text-destructive">{errors.goals[idx].description.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          {canAdd && (
            <Button type="button" variant="outline" onClick={() => append(defaultGoal)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add Goal ({fields.length}/{MAX_GOALS})
            </Button>
          )}
          <div className="flex-1" />
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Submitting..." : "Submit for Approval"}
          </Button>
        </div>
      </form>
    </div>
  );
}
