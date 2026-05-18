export type UserRole = "employee" | "manager" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  designation: string;
  managerId?: string;
  managerName?: string;
  joinDate: string;
  created_at?: string;
}

export type GoalStatus = "draft" | "pending" | "approved" | "rejected" | "on-track" | "at-risk" | "behind" | "completed";

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  weightage: number;
  progress: number;
  status: GoalStatus;
  startDate: string;
  endDate: string;
  quarter: string;
  employeeId: string;
  employeeName: string;
  department: string;
  milestones: Milestone[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  thrust_area?: string;
  uom?: string;
  target?: number;
  achievement?: number;
  locked?: boolean;
  due_date?: string;
  user_id?: string;
  manager_comment?: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Comment {
  id: string;
  author: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface CheckIn {
  id: string;
  goalId: string;
  goalTitle: string;
  employeeId: string;
  employeeName: string;
  quarter: string;
  selfRating: number;
  managerRating?: number;
  selfComments: string;
  managerComments?: string;
  status: "pending" | "submitted" | "reviewed" | "draft";
  submittedAt: string;
  goal_id?: string;
  user_id?: string;
  employee_comment?: string;
  manager_comment?: string;
  self_rating?: number;
  manager_rating?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  performedByRole: UserRole;
  target: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface Escalation {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  raisedBy: string;
  assignedTo: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  resolvedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  avatar?: string;
  goalsCount: number;
  completionRate: number;
  status: "on-track" | "at-risk" | "behind";
  lastCheckIn?: string;
}

export interface TeamMemberStat {
  user_id: string;
  name: string;
  department: string;
  designation: string;
  goals_count: number;
  completion_rate: number;
  status: "on-track" | "at-risk" | "behind";
}

export interface AnalyticsData {
  completionRate: number;
  onTrackPercentage: number;
  atRiskPercentage: number;
  behindPercentage: number;
  totalGoals: number;
  totalEmployees: number;
  avgProgress: number;
  quarterlyTrends: QuarterlyTrend[];
  departmentStats: DepartmentStat[];
  categoryBreakdown: CategoryBreakdown[];
  monthlyProgress: MonthlyProgress[];
}

export interface QuarterlyTrend {
  quarter: string;
  completionRate: number;
  goalsSet: number;
  goalsCompleted: number;
}

export interface DepartmentStat {
  department: string;
  avgProgress: number;
  totalGoals: number;
  completionRate: number;
  employeeCount: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface MonthlyProgress {
  month: string;
  progress: number;
  target: number;
}

export interface HeatmapCell {
  day: string;
  week: number;
  value: number;
}
