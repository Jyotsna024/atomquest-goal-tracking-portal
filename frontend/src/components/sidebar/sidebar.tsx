"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import {
  LayoutDashboard, Target, PlusCircle, ClipboardCheck, BarChart3,
  Bell, CheckSquare, Users, UserCog, FileText, AlertTriangle,
  Unlock, ChevronLeft, ChevronRight, Atom,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Target, PlusCircle, ClipboardCheck, BarChart3,
  Bell, CheckSquare, Users, UserCog, FileText, AlertTriangle, Unlock,
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { role } = useAuth();

  const items = NAV_ITEMS[role] || NAV_ITEMS.employee;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border", collapsed ? "justify-center" : "gap-3")}>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shrink-0">
            <Atom className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-foreground tracking-tight">{APP_NAME}</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href.split("/").length <= pathname.split("/").length);

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return <React.Fragment key={item.href}>{linkContent}</React.Fragment>;
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 cursor-pointer",
              collapsed && "justify-center px-2"
            )}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
