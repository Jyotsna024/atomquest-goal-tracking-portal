export const APP_NAME = "AtomQuest";
export const APP_DESCRIPTION = "Enterprise Goal Setting & Performance Tracking Portal";

export const QUARTERS = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026"];
export const CURRENT_QUARTER = "Q2 2026";

export const GOAL_CATEGORIES = [
  "Business Performance",
  "Technical Excellence",
  "Leadership & Management",
  "Innovation & Growth",
  "Customer Success",
  "Learning & Development",
  "Process Improvement",
  "Team Collaboration",
];

export const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
];

export const MAX_GOALS = 8;
export const MIN_WEIGHTAGE = 10;
export const TOTAL_WEIGHTAGE = 100;

export const ROLE_LABELS: Record<string, string> = {
  employee: "Employee",
  manager: "Manager",
  admin: "Administrator",
};

export const NAV_ITEMS = {
  employee: [
    { label: "Dashboard", href: "/employee", icon: "LayoutDashboard" },
    { label: "My Goals", href: "/employee/goals", icon: "Target" },
    { label: "Create Goal", href: "/employee/goals/new", icon: "PlusCircle" },
    { label: "Check-ins", href: "/employee/check-in", icon: "ClipboardCheck" },
    { label: "Analytics", href: "/analytics", icon: "BarChart3" },
    { label: "Notifications", href: "/notifications", icon: "Bell" },
  ],
  manager: [
    { label: "Dashboard", href: "/manager", icon: "LayoutDashboard" },
    { label: "Approvals", href: "/manager/approvals", icon: "CheckSquare" },
    { label: "Team Performance", href: "/manager/team", icon: "Users" },
    { label: "Analytics", href: "/analytics", icon: "BarChart3" },
    { label: "Notifications", href: "/notifications", icon: "Bell" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { label: "User Management", href: "/admin/users", icon: "UserCog" },
    { label: "Audit Logs", href: "/admin/audits", icon: "FileText" },
    { label: "Escalations", href: "/admin/escalations", icon: "AlertTriangle" },
    { label: "Goal Unlock", href: "/admin/unlock", icon: "Unlock" },
    { label: "Analytics", href: "/analytics", icon: "BarChart3" },
    { label: "Notifications", href: "/notifications", icon: "Bell" },
  ],
};
