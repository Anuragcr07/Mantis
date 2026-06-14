"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Activity, AlertTriangle, FileText, Database } from "lucide-react";


export function CompanyDashboard() {
  return (
    <div className="p-8 space-y-8 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold">Philix Analytics Dashboard</h1>
        <div className="flex gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 bg-surface-2 px-2 py-1 rounded border border-line">
            <Database size={12} /> Knowledge Base: 100% Synced
          </span>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AnalyticsCard title="Total Customers" value="1,284" icon={<Users size={16}/>} />
        <AnalyticsCard title="AI Success Rate" value="94.2%" icon={<Activity className="text-confirm" size={16}/>} />
        <AnalyticsCard title="Pending Escalations" value="12" icon={<AlertTriangle className="text-alert" size={16}/>} />
        <AnalyticsCard title="Docs Ingested" value="42" icon={<FileText size={16}/>} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer Issues Log */}
        <Card className="bg-surface border-line">
          <CardHeader>
            <CardTitle className="text-sm font-display uppercase tracking-widest text-text-muted">Recent Troubleshooting Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {[
                  { id: "C-102", product: "RZ-1 Scooter", issue: "Horn Relay Failure", date: "2m ago", status: "Resolved (AI)" },
                  { id: "C-104", product: "Arctic v2", issue: "Compressor Vibration", date: "15m ago", status: "Escalated" },
                  { id: "C-105", product: "RZ-1 Scooter", issue: "Battery Drain", date: "1h ago", status: "Resolved (AI)" },
                ].map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-line text-sm">
                    <div>
                      <p className="font-bold">{log.product}</p>
                      <p className="text-xs text-text-muted">{log.issue}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={log.status.includes('Resolved') ? 'text-confirm border-confirm/30' : 'text-alert border-alert/30'}>
                        {log.status}
                      </Badge>
                      <p className="text-[10px] text-text-faint mt-1">{log.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Knowledge Management */}
        <Card className="bg-surface border-line">
          <CardHeader>
             <CardTitle className="text-sm font-display uppercase tracking-widest text-text-muted">Product Knowledge Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 rounded-xl border border-line bg-surface-2 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 bg-signal/10 flex items-center justify-center rounded text-signal">PDF</div>
                    <div>
                        <p className="text-sm font-bold">Arctic_v2_Service_Manual.pdf</p>
                        <p className="text-xs text-text-muted">Last indexed: Today, 08:00 AM</p>
                    </div>
                </div>
                <Badge className="bg-confirm">Sync OK</Badge>
             </div>
             <div className="p-4 rounded-xl border border-line bg-surface-2 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 bg-info/10 flex items-center justify-center rounded text-info">MP4</div>
                    <div>
                        <p className="text-sm font-bold">Compressor_Repair_Guide.mp4</p>
                        <p className="text-xs text-text-muted">Timestamped: 12 segments extracted</p>
                    </div>
                </div>
                <Badge className="bg-confirm">Sync OK</Badge>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="bg-surface border-line p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted font-display uppercase tracking-wider">{title}</p>
        <div className="text-text-muted opacity-50">{icon}</div>
      </div>
      <p className="text-2xl font-bold font-display mt-2">{value}</p>
    </Card>
  );
}