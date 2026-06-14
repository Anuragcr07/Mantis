"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Wrench, Calendar, AlertCircle, Plus, Activity, 
  ArrowLeft, Video, Image as ImageIcon, FileText, 
  LayoutDashboard, Hash, Gauge, Clock, CheckCircle2,
  ChevronRight, Loader2
} from "lucide-react";
import { DiscoveryHub } from "./discovery-hub";
import { S3UploadZone } from "../shared/s3-upload-zone";

export function CustomerGarage({ onStartRepair }: { onStartRepair: () => void }) {
  // --- 1. STATE MANAGEMENT ---
  const [view, setView] = useState<"garage" | "discovery" | "onboarding">("garage");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [reportMode, setReportMode] = useState<{ id: string, type: 'video' | 'image' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local Garage State (Initially contains hardcoded demo data, then synced with DB)
  const [myGarage, setMyGarage] = useState<any[]>([]);

  // Onboarding Form State
  const [onboardingForm, setOnboardingForm] = useState({
    purchaseDate: "",
    serialNumber: "",
    usage: "",
    lastService: ""
  });

  // --- 2. DATABASE SYNC (On Mount) ---
  useEffect(() => {
    async function fetchGarage() {
      try {
        const res = await fetch("/api/garage/fetch"); // You would create this API route
        const data = await res.json();
        if (data.success) setMyGarage(data.items);
      } catch (err) {
        console.log("Database sync failed, using local state.");
      }
    }
    fetchGarage();
  }, []);

  // --- 3. HANDLERS ---
  const handleCompleteIntegration = async () => {
    setIsSaving(true);
    try {
      // POST to your Next.js Auth Server / MongoDB API
      const response = await fetch("/api/garage/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...onboardingForm,
          name: selectedProduct.name,
          brand: selectedProduct.brand,
          category: selectedProduct.category,
          icon: selectedProduct.icon,
          userId: "ALEX_M_001" // This would come from your real Auth session
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state with the item returned from MongoDB
        setMyGarage([result.item, ...myGarage]);
        setView("garage");
        // Reset form
        setOnboardingForm({ purchaseDate: "", serialNumber: "", usage: "", lastService: "" });
      }
    } catch (error) {
      alert("Failed to sync with Database. Check your MongoDB connection.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- VIEW: TECHNICAL ONBOARDING FORM ---
  if (view === "onboarding") {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-canvas animate-in fade-in zoom-in-95 duration-300">
        <Card className="w-full max-w-2xl bg-surface border-line shadow-2xl overflow-hidden border-t-4 border-t-signal">
          <div className="bg-surface-2 p-3 text-[10px] text-text-muted font-mono flex justify-between items-center border-b border-line uppercase tracking-widest">
            <span>Unit_Config_Protocol // {selectedProduct?.brand}</span>
            <span className="text-signal animate-pulse">● Awaiting_Parameters</span>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-surface-2 rounded-2xl flex items-center justify-center text-signal border border-line shadow-inner">
                  {selectedProduct && <selectedProduct.icon size={28} />}
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-text">{selectedProduct?.name}</h2>
                  <p className="text-xs text-text-muted font-mono uppercase tracking-[0.2em]">Class: {selectedProduct?.category}</p>
                </div>
              </div>
              <Badge variant="outline" className="border-confirm/30 text-confirm font-mono bg-confirm/5">MFR_VERIFIED</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OnboardingInput 
                label="Date of Purchase" 
                type="date" 
                icon={<Calendar size={12} />} 
                value={onboardingForm.purchaseDate}
                onChange={(e:any) => setOnboardingForm({...onboardingForm, purchaseDate: e.target.value})}
              />
              <OnboardingInput 
                label="Serial Number (SN)" 
                placeholder="TRQ-RZ1-XXXX" 
                icon={<Hash size={12} />} 
                value={onboardingForm.serialNumber}
                onChange={(e:any) => setOnboardingForm({...onboardingForm, serialNumber: e.target.value})}
              />
              <OnboardingInput 
                label="Current Usage" 
                placeholder="e.g. 1500" 
                icon={<Gauge size={12} />} 
                value={onboardingForm.usage}
                onChange={(e:any) => setOnboardingForm({...onboardingForm, usage: e.target.value})}
              />
              <OnboardingInput 
                label="Last Full Service" 
                type="date" 
                icon={<Clock size={12} />} 
                value={onboardingForm.lastService}
                onChange={(e:any) => setOnboardingForm({...onboardingForm, lastService: e.target.value})}
              />
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-line">
              <Button variant="ghost" onClick={() => setView("discovery")} className="text-text-faint hover:text-text font-mono text-[10px]">← RE_SELECT_SOURCE</Button>
              <Button 
                onClick={handleCompleteIntegration} 
                disabled={isSaving}
                className="bg-signal text-canvas font-bold px-10 h-12 rounded-xl shadow-lg shadow-signal/20 gap-2 hover:scale-105 transition-all"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <>CONFIRM_INTEGRATION <ChevronRight size={16}/></>}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // --- VIEW: MARKETPLACE / DISCOVERY ---
  if (view === "discovery") {
    return (
      <div className="h-full overflow-y-auto bg-canvas">
        <div className="p-6 border-b border-line bg-surface/30 sticky top-0 z-10 backdrop-blur-md flex justify-between items-center">
          <button onClick={() => setView("garage")} className="flex items-center gap-2 text-xs text-text-muted hover:text-signal transition-colors font-mono uppercase tracking-widest">
            <ArrowLeft size={14} /> EXIT_CATALOG
          </button>
          <Badge variant="outline" className="font-mono text-[10px] text-signal border-signal/20">READY_FOR_ONBOARDING</Badge>
        </div>
        <DiscoveryHub onAddProduct={(p) => { setSelectedProduct(p); setView("onboarding"); }} />
      </div>
    );
  }

  // --- VIEW: MAIN GARAGE ---
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto h-full bg-canvas">
      
      {/* Fleet Command Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-2/50 p-6 rounded-3xl border border-line">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-signal">
            <LayoutDashboard size={20} />
            <h1 className="text-2xl font-display font-bold tracking-tight text-text">Fleet Command</h1>
          </div>
          <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">
            Nodes_Active: {myGarage.length} // DB_SYNC: OK
          </p>
        </div>
        
        <div className="flex items-center gap-6">
           <Button onClick={() => setView("discovery")} className="bg-signal text-canvas font-bold rounded-xl px-6 h-11 hover:scale-105 transition-all shadow-lg shadow-signal/20">
             <Plus size={18} className="mr-2" /> Register New Unit
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {myGarage.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-line rounded-3xl">
             <p className="text-text-muted font-mono text-sm uppercase">No units detected in local cluster. Register a product to begin.</p>
          </div>
        )}

        {myGarage.map((unit) => (
          <Card 
            key={unit._id || unit.id} 
            className={`bg-surface border-line overflow-hidden group border-l-4 transition-all hover:shadow-2xl hover:shadow-signal/5 ${
              unit.status === 'critical' ? 'border-l-alert' : 'border-l-confirm'
            }`}
          >
            <div className="flex flex-col lg:flex-row">
              <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-line space-y-4">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={unit.status === 'critical' ? 'alert' : 'confirm'} 
                    className="px-3 py-1 font-mono text-[9px] uppercase"
                  >
                    {unit.status?.toUpperCase() || "NOMINAL"}
                  </Badge>
                  <Activity size={18} className={unit.status === 'critical' ? 'text-alert animate-bounce' : 'text-confirm animate-pulse'} />
                </div>
                <h3 className="text-2xl font-display font-bold text-text">{unit.name || unit.productName}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase text-text-muted">
                    <span>Integrity_Index</span>
                    <span className="text-confirm">{unit.healthScore || unit.health}%</span>
                  </div>
                  <Progress value={unit.healthScore || unit.health} className="h-1.5" />
                </div>
              </div>

              <div className="p-6 flex-1 bg-surface-2/20 flex flex-col justify-between">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatBox label="Last Service" value={unit.lastService || unit.lastServiceDate || "N/A"} />
                    <StatBox label="Category" value={unit.category} />
                    <StatBox label="Serial Config" value={unit.serialNumber || unit.serial} />
                    <StatBox label="Health Status" value={unit.status?.toUpperCase() || "OK"} color={unit.status === 'critical' ? 'text-alert' : 'text-confirm'} />
                 </div>
                 
                 <div className="flex flex-wrap gap-3">
                    <Button 
                      className={`h-12 px-10 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${
                        unit.status === 'critical' ? 'bg-alert text-white' : 'border-line bg-transparent hover:border-signal text-text hover:text-signal'
                      }`} 
                      onClick={onStartRepair}
                    >
                      {unit.status === 'critical' ? 'Launch Emergency Repair' : 'Technical Audit'}
                    </Button>
                    <Button variant="outline" className="h-12 w-12 border-line hover:border-signal" onClick={() => setReportMode({id: unit.id, type: 'video'})}>
                      <Video size={18} />
                    </Button>
                 </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Multimodal Intake Modal */}
      {reportMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-canvas/90 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setReportMode(null)} />
            <Card className="relative w-full max-w-lg bg-surface border-line shadow-2xl overflow-hidden border-t-4 border-t-signal">
                <div className="p-8 space-y-6 text-center">
                    <div className="h-16 w-16 bg-signal/10 rounded-2xl flex items-center justify-center text-signal mx-auto mb-4 border border-signal/20">
                       {reportMode.type === 'video' ? <Video size={32} /> : <ImageIcon size={32} />}
                    </div>
                    <S3UploadZone 
                        role="customer" 
                        allowedTypes={reportMode.type === 'video' ? ["video/mp4"] : ["image/jpeg"]} 
                        onUploadComplete={(url) => { setReportMode(null); onStartRepair(); }} 
                    />
                    <Button variant="ghost" onClick={() => setReportMode(null)} className="text-xs text-text-faint font-mono uppercase">Cancel</Button>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
}

// Sub-components
function StatBox({ label, value, color = "text-text" }: any) {
    return (
        <div className="bg-canvas/50 p-4 rounded-xl border border-line">
            <p className="text-[10px] text-text-faint uppercase font-bold mb-1 tracking-tighter">{label}</p>
            <p className={`text-xs font-mono font-bold truncate ${color}`}>{value}</p>
        </div>
    );
}

function OnboardingInput({ label, icon, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase text-text-muted flex items-center gap-2 italic">
                {icon} {label}
            </label>
            <Input {...props} className="bg-surface-2 border-line h-11 focus:ring-signal rounded-xl" />
        </div>
    );
}