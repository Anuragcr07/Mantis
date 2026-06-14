"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { Wrench, Calendar, AlertCircle, Plus, Activity } from "lucide-react";

export function CustomerGarage({ onStartRepair }: { onStartRepair: () => void }) {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-text">My Garage</h1>
          <p className="text-text-muted">Manage your registered products and maintenance.</p>
        </div>
        <Button className="bg-signal text-canvas font-bold gap-2 hover:bg-signal/90">
          <Plus size={18} /> Add New Product
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Card: Scooter */}
        <Card className="bg-surface border-line p-6 group hover:border-signal/50 transition-all">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Badge variant="outline" className="text-confirm border-confirm/30 mb-2">Healthy</Badge>
              <h3 className="text-xl font-bold font-display text-text">Torque RZ-1 Scooter</h3>
              <p className="text-sm text-text-muted font-mono">SN: #TRQ-99021</p>
            </div>
            <Activity className="text-confirm/50" />
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-line pt-4">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Calendar size={14}/> Next: 12 Oct
            </div>
            <Button variant="outline" size="sm" onClick={onStartRepair}>
              Diagnostics
            </Button>
          </div>
        </Card>

        {/* Product Card: AC (With Issue) */}
        <Card className="bg-surface border-alert/30 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-alert" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Badge className="bg-alert text-white mb-2">Issue Detected</Badge>
              <h3 className="text-xl font-bold font-display text-text">Philix Arctic v2</h3>
              <p className="text-sm text-text-muted font-mono">SN: #PHL-0012</p>
            </div>
            <AlertCircle className="text-alert animate-pulse" />
          </div>
          <p className="mt-4 text-sm text-alert italic bg-alert/5 p-2 rounded">
            "Filter efficiency below 20%. Potential leakage."
          </p>
          <div className="mt-6">
            <Button className="w-full bg-alert text-white font-bold gap-2" onClick={onStartRepair}>
              <Wrench size={16} /> Start Repair Agent
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}