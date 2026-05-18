"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAuditLogs } from "@/lib/mock-data";
import { Search, Filter, Download, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

const actionColors: Record<string, "success" | "warning" | "danger" | "info" | "secondary"> = {
  "Goal Created": "info",
  "Goal Approved": "success",
  "User Role Updated": "warning",
  "Check-in Submitted": "info",
  "Goal Unlocked": "warning",
  "Bulk Export": "secondary",
  "Password Reset": "secondary",
  "Login Attempt Failed": "danger",
};

export default function AuditsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const actions = [...new Set(mockAuditLogs.map((l) => l.action))];
  const filtered = mockAuditLogs.filter((l) => {
    const matchSearch = l.performedBy.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "all" || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground text-sm mt-1">Track all system activities and user actions</p>
        </div>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search logs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[200px]"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Action type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{filtered.length} Log Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"><FileText className="w-7 h-7 text-muted-foreground" /></div>
              <p className="font-medium">No logs found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead className="hidden md:table-cell">Target</TableHead>
                  <TableHead className="hidden lg:table-cell">Details</TableHead>
                  <TableHead className="hidden sm:table-cell">IP Address</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell><Badge variant={actionColors[log.action] || "secondary"}>{log.action}</Badge></TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{log.performedBy}</p>
                      <p className="text-xs text-muted-foreground capitalize">{log.performedByRole}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">{log.target}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[250px] truncate">{log.details}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground font-mono text-xs">{log.ipAddress}</TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(log.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
