"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Search, Sun, Moon, LogOut, Settings, User, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";
import { mockNotifications } from "@/lib/mock-data";
import { useTheme } from "@/hooks/use-theme";
import React from "react";

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    crumbs.push({ label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "), href: path });
  }
  return crumbs;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const breadcrumbs = getBreadcrumbs(pathname);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Home</span>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.href}>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={i === breadcrumbs.length - 1 ? "font-medium text-foreground" : ""}>{crumb.label}</span>
          </React.Fragment>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 w-[220px] h-9 text-sm bg-muted/50 border-0 focus-visible:ring-1" />
        </div>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => router.push("/notifications")}>
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-accent transition-colors cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{ROLE_LABELS[role]}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem>
            <DropdownMenuItem><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); router.push("/login"); }} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
