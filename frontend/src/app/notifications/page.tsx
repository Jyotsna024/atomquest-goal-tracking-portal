"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/lib/mock-data";
import { Notification } from "@/types";
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

const typeIcon = (type: string) => {
  if (type === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (type === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  if (type === "error") return <XCircle className="w-4 h-4 text-red-500" />;
  return <Info className="w-4 h-4 text-blue-500" />;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4 mr-2" /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-medium">No notifications</p>
            <p className="text-sm text-muted-foreground mt-1">You&apos;re all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card key={n.id} className={`transition-all duration-200 hover:shadow-md ${!n.read ? "border-l-4 border-l-primary" : "opacity-75"}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{typeIcon(n.type)}</div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => markRead(n.id)}>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1.5">{formatDate(n.createdAt)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => deleteNotification(n.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
