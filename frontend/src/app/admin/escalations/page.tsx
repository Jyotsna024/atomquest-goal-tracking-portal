"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockEscalations } from "@/lib/mock-data";
import { Escalation } from "@/types";
import { AlertTriangle, Search, Filter, CheckCircle2, Clock, ArrowUpCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const severityVariant = (s: string) => {
  if (s === "critical") return "danger" as const;
  if (s === "high") return "warning" as const;
  if (s === "medium") return "info" as const;
  return "secondary" as const;
};

const statusVariant = (s: string) => {
  if (s === "resolved" || s === "closed") return "success" as const;
  if (s === "in-progress") return "info" as const;
  return "warning" as const;
};

export default function EscalationsPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selected, setSelected] = useState<Escalation | null>(null);
  const [resolution, setResolution] = useState("");

  const filtered = mockEscalations.filter((e) => {
    const matchSearch = e.type.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "all" || e.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const openCount = mockEscalations.filter((e) => e.status === "open").length;
  const criticalCount = mockEscalations.filter((e) => e.severity === "critical").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Escalation Monitoring</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor and resolve system-generated escalations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950"><Clock className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-sm text-muted-foreground">Open</p><p className="text-2xl font-bold">{openCount}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
            <div><p className="text-sm text-muted-foreground">Critical</p><p className="text-2xl font-bold">{criticalCount}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
            <div><p className="text-sm text-muted-foreground">Resolved</p><p className="text-2xl font-bold">{mockEscalations.filter((e) => e.status === "resolved").length}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search escalations..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-[160px]"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-4"><CheckCircle2 className="w-7 h-7 text-emerald-600" /></div>
            <p className="font-medium">No escalations found</p><p className="text-sm text-muted-foreground mt-1">All clear!</p>
          </CardContent></Card>
        ) : (
          filtered.map((esc) => (
            <Card key={esc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className={`p-2 rounded-lg shrink-0 ${esc.severity === "critical" ? "bg-red-50 dark:bg-red-950" : "bg-amber-50 dark:bg-amber-950"}`}>
                    <ArrowUpCircle className={`w-5 h-5 ${esc.severity === "critical" ? "text-red-600" : "text-amber-600"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{esc.type}</h3>
                      <Badge variant={severityVariant(esc.severity)}>{esc.severity}</Badge>
                      <Badge variant={statusVariant(esc.status)}>{esc.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{esc.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Raised by: {esc.raisedBy}</span>
                      <span>Assigned to: {esc.assignedTo}</span>
                      <span>{formatDate(esc.createdAt)}</span>
                    </div>
                  </div>
                  {(esc.status === "open" || esc.status === "in-progress") && (
                    <Button size="sm" variant="outline" onClick={() => setSelected(esc)} className="shrink-0">Resolve</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Escalation</DialogTitle>
            <DialogDescription>{selected?.type} — {selected?.severity} severity</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="p-3 rounded-lg bg-muted/50 text-sm">{selected?.description}</div>
            <div className="space-y-2">
              <Label>Resolution Notes</Label>
              <Textarea placeholder="Describe the resolution..." value={resolution} onChange={(e) => setResolution(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={() => { setSelected(null); setResolution(""); }}>Mark as Resolved</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
