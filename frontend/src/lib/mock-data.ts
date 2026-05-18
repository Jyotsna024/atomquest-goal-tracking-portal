import { User, Goal, CheckIn, Notification, AuditLog, Escalation, TeamMember, AnalyticsData, HeatmapCell } from "@/types";

export const mockUsers: Record<string, User> = {
  employee: {
    id: "emp-001", name: "Arjun Mehta", email: "arjun.mehta@atomquest.com",
    role: "employee", department: "Engineering", designation: "Senior Software Engineer",
    managerId: "mgr-001", managerName: "Priya Sharma", joinDate: "2023-03-15",
  },
  manager: {
    id: "mgr-001", name: "Priya Sharma", email: "priya.sharma@atomquest.com",
    role: "manager", department: "Engineering", designation: "Engineering Manager",
    joinDate: "2021-06-01",
  },
  admin: {
    id: "adm-001", name: "Rajesh Kumar", email: "rajesh.kumar@atomquest.com",
    role: "admin", department: "Human Resources", designation: "HR Director",
    joinDate: "2020-01-10",
  },
};

export const mockGoals: Goal[] = [
  {
    id: "g-001", title: "Increase API Response Time by 40%", description: "Optimize backend services to reduce average API response time from 500ms to 300ms across all critical endpoints.",
    category: "Technical Excellence", weightage: 25, progress: 72, status: "on-track",
    startDate: "2026-04-01", endDate: "2026-06-30", quarter: "Q2 2026",
    employeeId: "emp-001", employeeName: "Arjun Mehta", department: "Engineering",
    milestones: [
      { id: "m1", title: "Profile existing endpoints", completed: true, dueDate: "2026-04-15" },
      { id: "m2", title: "Implement caching layer", completed: true, dueDate: "2026-05-01" },
      { id: "m3", title: "Optimize database queries", completed: false, dueDate: "2026-05-30" },
      { id: "m4", title: "Load testing & validation", completed: false, dueDate: "2026-06-15" },
    ],
    comments: [
      { id: "c1", author: "Priya Sharma", authorRole: "manager", text: "Great progress on the caching layer. Let's discuss the DB optimization approach.", createdAt: "2026-05-10T10:30:00Z" },
    ],
    createdAt: "2026-03-28T09:00:00Z", updatedAt: "2026-05-15T14:00:00Z",
  },
  {
    id: "g-002", title: "Lead Microservices Migration", description: "Migrate 3 monolithic modules to microservices architecture with proper CI/CD pipelines.",
    category: "Innovation & Growth", weightage: 30, progress: 45, status: "at-risk",
    startDate: "2026-04-01", endDate: "2026-06-30", quarter: "Q2 2026",
    employeeId: "emp-001", employeeName: "Arjun Mehta", department: "Engineering",
    milestones: [
      { id: "m5", title: "Architecture design document", completed: true, dueDate: "2026-04-20" },
      { id: "m6", title: "Migrate auth service", completed: true, dueDate: "2026-05-10" },
      { id: "m7", title: "Migrate payment service", completed: false, dueDate: "2026-05-30" },
      { id: "m8", title: "Migrate notification service", completed: false, dueDate: "2026-06-20" },
    ],
    comments: [
      { id: "c2", author: "Priya Sharma", authorRole: "manager", text: "Payment service migration is behind schedule. Need a recovery plan.", createdAt: "2026-05-12T11:00:00Z" },
    ],
    createdAt: "2026-03-28T09:00:00Z", updatedAt: "2026-05-14T16:00:00Z",
  },
  {
    id: "g-003", title: "Mentor 2 Junior Engineers", description: "Provide structured mentorship to two junior team members through weekly 1:1s and code reviews.",
    category: "Leadership & Management", weightage: 15, progress: 85, status: "on-track",
    startDate: "2026-04-01", endDate: "2026-06-30", quarter: "Q2 2026",
    employeeId: "emp-001", employeeName: "Arjun Mehta", department: "Engineering",
    milestones: [
      { id: "m9", title: "Create mentorship plan", completed: true, dueDate: "2026-04-10" },
      { id: "m10", title: "Complete first month reviews", completed: true, dueDate: "2026-05-01" },
      { id: "m11", title: "Mid-quarter assessment", completed: true, dueDate: "2026-05-15" },
      { id: "m12", title: "Final evaluation", completed: false, dueDate: "2026-06-25" },
    ],
    comments: [], createdAt: "2026-03-28T09:00:00Z", updatedAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "g-004", title: "Achieve 95% Unit Test Coverage", description: "Increase test coverage across all critical services from 78% to 95%.",
    category: "Technical Excellence", weightage: 20, progress: 60, status: "on-track",
    startDate: "2026-04-01", endDate: "2026-06-30", quarter: "Q2 2026",
    employeeId: "emp-001", employeeName: "Arjun Mehta", department: "Engineering",
    milestones: [
      { id: "m13", title: "Audit current coverage", completed: true, dueDate: "2026-04-15" },
      { id: "m14", title: "Write tests for auth module", completed: true, dueDate: "2026-05-05" },
      { id: "m15", title: "Write tests for payment module", completed: false, dueDate: "2026-05-25" },
      { id: "m16", title: "Integration test suite", completed: false, dueDate: "2026-06-15" },
    ],
    comments: [], createdAt: "2026-03-28T09:00:00Z", updatedAt: "2026-05-10T11:00:00Z",
  },
  {
    id: "g-005", title: "Complete AWS Solutions Architect Certification", description: "Study and pass the AWS Solutions Architect Professional certification exam.",
    category: "Learning & Development", weightage: 10, progress: 30, status: "behind",
    startDate: "2026-04-01", endDate: "2026-06-30", quarter: "Q2 2026",
    employeeId: "emp-001", employeeName: "Arjun Mehta", department: "Engineering",
    milestones: [
      { id: "m17", title: "Complete online course", completed: true, dueDate: "2026-05-01" },
      { id: "m18", title: "Practice exams", completed: false, dueDate: "2026-05-20" },
      { id: "m19", title: "Schedule and pass exam", completed: false, dueDate: "2026-06-15" },
    ],
    comments: [
      { id: "c3", author: "Arjun Mehta", authorRole: "employee", text: "Behind schedule due to sprint priorities. Planning to catch up in June.", createdAt: "2026-05-14T09:00:00Z" },
    ],
    createdAt: "2026-03-28T09:00:00Z", updatedAt: "2026-05-14T09:00:00Z",
  },
];

export const mockPendingGoals: Goal[] = [
  {
    id: "pg-001", title: "Implement Real-time Dashboard", description: "Build a real-time analytics dashboard using WebSocket for live metric updates.",
    category: "Technical Excellence", weightage: 25, progress: 0, status: "pending",
    startDate: "2026-04-01", endDate: "2026-06-30", quarter: "Q2 2026",
    employeeId: "emp-002", employeeName: "Sneha Patel", department: "Engineering",
    milestones: [], comments: [], createdAt: "2026-05-15T09:00:00Z", updatedAt: "2026-05-15T09:00:00Z",
  },
  {
    id: "pg-002", title: "Reduce Customer Churn by 15%", description: "Implement retention strategies and improve onboarding flow to reduce monthly churn rate.",
    category: "Customer Success", weightage: 30, progress: 0, status: "pending",
    startDate: "2026-04-01", endDate: "2026-06-30", quarter: "Q2 2026",
    employeeId: "emp-003", employeeName: "Vikram Singh", department: "Product",
    milestones: [], comments: [], createdAt: "2026-05-14T10:00:00Z", updatedAt: "2026-05-14T10:00:00Z",
  },
  {
    id: "pg-003", title: "Launch Design System v2", description: "Redesign and ship the updated component library with accessibility improvements.",
    category: "Innovation & Growth", weightage: 35, progress: 0, status: "pending",
    startDate: "2026-04-01", endDate: "2026-06-30", quarter: "Q2 2026",
    employeeId: "emp-004", employeeName: "Ananya Rao", department: "Design",
    milestones: [], comments: [], createdAt: "2026-05-13T14:00:00Z", updatedAt: "2026-05-13T14:00:00Z",
  },
];

export const mockTeamMembers: TeamMember[] = [
  { id: "emp-001", name: "Arjun Mehta", email: "arjun@atomquest.com", department: "Engineering", designation: "Senior Software Engineer", goalsCount: 5, completionRate: 72, status: "on-track", lastCheckIn: "2026-05-10" },
  { id: "emp-002", name: "Sneha Patel", email: "sneha@atomquest.com", department: "Engineering", designation: "Software Engineer", goalsCount: 4, completionRate: 88, status: "on-track", lastCheckIn: "2026-05-12" },
  { id: "emp-003", name: "Vikram Singh", email: "vikram@atomquest.com", department: "Product", designation: "Product Manager", goalsCount: 6, completionRate: 45, status: "at-risk", lastCheckIn: "2026-05-08" },
  { id: "emp-004", name: "Ananya Rao", email: "ananya@atomquest.com", department: "Design", designation: "Lead Designer", goalsCount: 3, completionRate: 92, status: "on-track", lastCheckIn: "2026-05-14" },
  { id: "emp-005", name: "Karan Desai", email: "karan@atomquest.com", department: "Engineering", designation: "DevOps Engineer", goalsCount: 4, completionRate: 35, status: "behind", lastCheckIn: "2026-04-28" },
  { id: "emp-006", name: "Meera Joshi", email: "meera@atomquest.com", department: "Marketing", designation: "Marketing Lead", goalsCount: 5, completionRate: 67, status: "on-track", lastCheckIn: "2026-05-11" },
];

export const mockCheckIns: CheckIn[] = [
  { id: "ci-001", goalId: "g-001", goalTitle: "Increase API Response Time by 40%", employeeId: "emp-001", employeeName: "Arjun Mehta", quarter: "Q2 2026", selfRating: 4, managerRating: 4, selfComments: "Caching layer is delivering significant improvements. On track for the target.", managerComments: "Strong execution. Keep the momentum.", status: "reviewed", submittedAt: "2026-05-10T10:00:00Z" },
  { id: "ci-002", goalId: "g-002", goalTitle: "Lead Microservices Migration", employeeId: "emp-001", employeeName: "Arjun Mehta", quarter: "Q2 2026", selfRating: 3, selfComments: "Auth service migration complete. Payment service facing integration challenges.", status: "submitted", submittedAt: "2026-05-12T14:00:00Z" },
  { id: "ci-003", goalId: "g-003", goalTitle: "Mentor 2 Junior Engineers", employeeId: "emp-001", employeeName: "Arjun Mehta", quarter: "Q2 2026", selfRating: 5, managerRating: 5, selfComments: "Both mentees showing strong progress. Weekly 1:1s are productive.", managerComments: "Excellent mentorship. Both juniors have improved significantly.", status: "reviewed", submittedAt: "2026-05-08T09:00:00Z" },
];

export const mockNotifications: Notification[] = [
  { id: "n-001", title: "Goal Approved", message: "Your goal 'Increase API Response Time' has been approved by Priya Sharma.", type: "success", read: false, createdAt: "2026-05-17T08:00:00Z", link: "/employee/goals" },
  { id: "n-002", title: "Check-in Reminder", message: "Q2 2026 quarterly check-in is due in 3 days.", type: "warning", read: false, createdAt: "2026-05-16T10:00:00Z", link: "/employee/check-in" },
  { id: "n-003", title: "New Comment", message: "Priya Sharma commented on 'Microservices Migration'.", type: "info", read: false, createdAt: "2026-05-15T14:30:00Z", link: "/employee/goals" },
  { id: "n-004", title: "Goal At Risk", message: "Your goal 'AWS Certification' is flagged as behind schedule.", type: "error", read: true, createdAt: "2026-05-14T09:00:00Z", link: "/employee/goals" },
  { id: "n-005", title: "Team Update", message: "2 new goals submitted for your review.", type: "info", read: true, createdAt: "2026-05-13T11:00:00Z", link: "/manager/approvals" },
  { id: "n-006", title: "System Update", message: "AtomQuest v2.4 released with new analytics features.", type: "info", read: true, createdAt: "2026-05-12T16:00:00Z" },
];

export const mockAuditLogs: AuditLog[] = [
  { id: "al-001", action: "Goal Created", performedBy: "Arjun Mehta", performedByRole: "employee", target: "Increase API Response Time", details: "New goal created for Q2 2026", timestamp: "2026-05-17T08:30:00Z", ipAddress: "192.168.1.45" },
  { id: "al-002", action: "Goal Approved", performedBy: "Priya Sharma", performedByRole: "manager", target: "Increase API Response Time", details: "Goal approved with comments", timestamp: "2026-05-17T09:15:00Z", ipAddress: "192.168.1.22" },
  { id: "al-003", action: "User Role Updated", performedBy: "Rajesh Kumar", performedByRole: "admin", target: "Sneha Patel", details: "Role changed from Employee to Manager", timestamp: "2026-05-16T14:00:00Z", ipAddress: "192.168.1.10" },
  { id: "al-004", action: "Check-in Submitted", performedBy: "Arjun Mehta", performedByRole: "employee", target: "Q2 2026 Check-in", details: "Self-assessment submitted for review", timestamp: "2026-05-16T10:30:00Z", ipAddress: "192.168.1.45" },
  { id: "al-005", action: "Goal Unlocked", performedBy: "Rajesh Kumar", performedByRole: "admin", target: "Reduce Customer Churn", details: "Goal unlocked for editing after escalation", timestamp: "2026-05-15T16:45:00Z", ipAddress: "192.168.1.10" },
  { id: "al-006", action: "Bulk Export", performedBy: "Rajesh Kumar", performedByRole: "admin", target: "Q1 2026 Reports", details: "Exported performance reports for all departments", timestamp: "2026-05-15T11:00:00Z", ipAddress: "192.168.1.10" },
  { id: "al-007", action: "Password Reset", performedBy: "System", performedByRole: "admin", target: "vikram.singh@atomquest.com", details: "Password reset link sent via email", timestamp: "2026-05-14T08:20:00Z", ipAddress: "10.0.0.1" },
  { id: "al-008", action: "Login Attempt Failed", performedBy: "Unknown", performedByRole: "employee", target: "meera.joshi@atomquest.com", details: "3 failed login attempts detected", timestamp: "2026-05-13T22:10:00Z", ipAddress: "203.45.67.89" },
];

export const mockEscalations: Escalation[] = [
  { id: "e-001", type: "Goal Deadline Breach", severity: "high", description: "Karan Desai has missed 2 goal milestones with no check-in for 3 weeks.", raisedBy: "System", assignedTo: "Priya Sharma", status: "open", createdAt: "2026-05-16T08:00:00Z" },
  { id: "e-002", type: "Weightage Violation", severity: "medium", description: "Marketing department has 3 employees with total goal weightage below 100%.", raisedBy: "System", assignedTo: "Rajesh Kumar", status: "in-progress", createdAt: "2026-05-14T10:00:00Z" },
  { id: "e-003", type: "Approval Delay", severity: "low", description: "5 goals pending approval for more than 7 days in Sales department.", raisedBy: "System", assignedTo: "Rajesh Kumar", status: "resolved", createdAt: "2026-05-10T09:00:00Z", resolvedAt: "2026-05-12T15:00:00Z" },
  { id: "e-004", type: "Policy Violation", severity: "critical", description: "Unauthorized goal modification detected for employee emp-008 after lock period.", raisedBy: "System", assignedTo: "Rajesh Kumar", status: "open", createdAt: "2026-05-17T06:00:00Z" },
];

export const mockAnalytics: AnalyticsData = {
  completionRate: 68, onTrackPercentage: 58, atRiskPercentage: 25, behindPercentage: 17,
  totalGoals: 156, totalEmployees: 42, avgProgress: 62,
  quarterlyTrends: [
    { quarter: "Q1 2025", completionRate: 72, goalsSet: 130, goalsCompleted: 94 },
    { quarter: "Q2 2025", completionRate: 68, goalsSet: 142, goalsCompleted: 97 },
    { quarter: "Q3 2025", completionRate: 75, goalsSet: 138, goalsCompleted: 104 },
    { quarter: "Q4 2025", completionRate: 71, goalsSet: 145, goalsCompleted: 103 },
    { quarter: "Q1 2026", completionRate: 78, goalsSet: 150, goalsCompleted: 117 },
    { quarter: "Q2 2026", completionRate: 62, goalsSet: 156, goalsCompleted: 97 },
  ],
  departmentStats: [
    { department: "Engineering", avgProgress: 68, totalGoals: 45, completionRate: 72, employeeCount: 12 },
    { department: "Product", avgProgress: 55, totalGoals: 28, completionRate: 60, employeeCount: 7 },
    { department: "Design", avgProgress: 78, totalGoals: 18, completionRate: 82, employeeCount: 5 },
    { department: "Marketing", avgProgress: 62, totalGoals: 25, completionRate: 65, employeeCount: 6 },
    { department: "Sales", avgProgress: 50, totalGoals: 22, completionRate: 55, employeeCount: 6 },
    { department: "HR", avgProgress: 70, totalGoals: 18, completionRate: 75, employeeCount: 6 },
  ],
  categoryBreakdown: [
    { category: "Technical Excellence", count: 42, percentage: 27 },
    { category: "Business Performance", count: 35, percentage: 22 },
    { category: "Leadership", count: 25, percentage: 16 },
    { category: "Innovation", count: 22, percentage: 14 },
    { category: "Customer Success", count: 18, percentage: 12 },
    { category: "Learning", count: 14, percentage: 9 },
  ],
  monthlyProgress: [
    { month: "Jan", progress: 15, target: 20 },
    { month: "Feb", progress: 30, target: 35 },
    { month: "Mar", progress: 48, target: 50 },
    { month: "Apr", progress: 55, target: 65 },
    { month: "May", progress: 62, target: 80 },
    { month: "Jun", progress: 0, target: 100 },
  ],
};

export const mockHeatmapData: HeatmapCell[] = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const data: HeatmapCell[] = [];
  for (let week = 1; week <= 12; week++) {
    for (const day of days) {
      data.push({ day, week, value: Math.floor(Math.random() * 10) });
    }
  }
  return data;
})();

export const mockAllUsers: User[] = [
  { id: "emp-001", name: "Arjun Mehta", email: "arjun.mehta@atomquest.com", role: "employee", department: "Engineering", designation: "Senior Software Engineer", managerId: "mgr-001", managerName: "Priya Sharma", joinDate: "2023-03-15" },
  { id: "emp-002", name: "Sneha Patel", email: "sneha.patel@atomquest.com", role: "employee", department: "Engineering", designation: "Software Engineer", managerId: "mgr-001", managerName: "Priya Sharma", joinDate: "2024-01-10" },
  { id: "emp-003", name: "Vikram Singh", email: "vikram.singh@atomquest.com", role: "employee", department: "Product", designation: "Product Manager", managerId: "mgr-002", managerName: "Neha Gupta", joinDate: "2022-08-20" },
  { id: "emp-004", name: "Ananya Rao", email: "ananya.rao@atomquest.com", role: "employee", department: "Design", designation: "Lead Designer", managerId: "mgr-001", managerName: "Priya Sharma", joinDate: "2023-06-01" },
  { id: "emp-005", name: "Karan Desai", email: "karan.desai@atomquest.com", role: "employee", department: "Engineering", designation: "DevOps Engineer", managerId: "mgr-001", managerName: "Priya Sharma", joinDate: "2024-03-15" },
  { id: "emp-006", name: "Meera Joshi", email: "meera.joshi@atomquest.com", role: "employee", department: "Marketing", designation: "Marketing Lead", managerId: "mgr-003", managerName: "Amit Verma", joinDate: "2022-11-01" },
  { id: "mgr-001", name: "Priya Sharma", email: "priya.sharma@atomquest.com", role: "manager", department: "Engineering", designation: "Engineering Manager", joinDate: "2021-06-01" },
  { id: "mgr-002", name: "Neha Gupta", email: "neha.gupta@atomquest.com", role: "manager", department: "Product", designation: "Product Director", joinDate: "2021-03-15" },
  { id: "mgr-003", name: "Amit Verma", email: "amit.verma@atomquest.com", role: "manager", department: "Marketing", designation: "Marketing Director", joinDate: "2020-09-01" },
  { id: "adm-001", name: "Rajesh Kumar", email: "rajesh.kumar@atomquest.com", role: "admin", department: "Human Resources", designation: "HR Director", joinDate: "2020-01-10" },
];
