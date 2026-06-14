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
  LayoutDashboard, Hash, Gauge, Clock, ChevronRight, Loader2
} from "lucide-react";
import { DiscoveryHub } from "./discovery-hub";
import { S3UploadZone } from "../shared/s3-upload-zone";
import { IconMap } from "@/lib/icons";

// Helper for professional date formatting
const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
    });
};

interface GarageProps {
  onStartRepair: (unit: any) => void; // Parent function to open AI Shell
}

export function CustomerGarage({ onStartRepair }: GarageProps) {
  // --- 1. STATE MANAGEMENT ---
  const [view, setView] = useState<"garage" | "discovery" | "onboarding">("garage");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [reportMode, setReportMode] = useState<{ id: string, type: 'video' | 'image' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [myGarage, setMyGarage] = useState<any[]>([]);

  // Technical Form State
  const [onboardingForm, setOnboardingForm] = useState({
    purchaseDate: "",
    serialNumber: "",
    usage: "",
    lastService: ""
  });

  // --- 2. DATABASE SYNC ---
  useEffect(() => {
    async function fetchGarage() {
      try {
        const res = await fetch("/api/garage/fetch");
        const data = await res.json();
        if (data.success) {
            setMyGarage(data.items);
        }
      } catch (err) {
        console.error("Database connection refused. Ensure MongoDB is active.");
      }
    }
    fetchGarage();
  }, [view]); // Re-fetch when coming back to garage view

  // --- 3. HANDLERS ---
  const handleCompleteIntegration = async () => {
    if (!onboardingForm.serialNumber) return alert("Serial Number required for verification.");
    
    setIsSaving(true);
    try {
      const response = await fetch("/api/garage/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...onboardingForm,
          name: selectedProduct.name,
          brand: selectedProduct.brand,
          category: selectedProduct.category,
          iconName: selectedProduct.iconName || "Cpu",
          productId: selectedProduct.product_id // Linked to FastAPI ac/washing_machine IDs
        }),
      });

      const result = await response.json();
      if (result.success) {
        setView("garage");
        setOnboardingForm({ purchaseDate: "", serialNumber: "", usage: "", lastService: "" });
      }
    } catch (error) {
      alert("Failed to synchronize with Global Registry.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- VIEW: TECHNICAL ONBOARDING FORM ---
  if (view === "onboarding") {
    const ActiveIcon = IconMap[selectedProduct?.iconName] || IconMap["Cpu"];
    return (
      <div className="h-full flex items-center justify-center p-6 bg-canvas animate-in fade-in zoom-in-95 duration-300">
        <Card className="w-full max-w-2xl bg-surface border-line shadow-2xl overflow-hidden border-t-4 border-t-signal">
          <div className="bg-surface-2 p-3 text-[10px] text-text-muted font-mono flex justify-between items-center border-b border-line">
            <span>UNIT_CONFIG_PROTOCOL // {selectedProduct?.brand.toUpperCase()}</span>
            <span className="text-signal animate-pulse">● INITIALIZING_HANDSHAKE</span>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-surface-2 rounded-2xl flex items-center justify-center text-signal border border-line shadow-inner">
                <ActiveIcon size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-text">{selectedProduct?.name}</h2>
                <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Model_Ref: {selectedProduct?.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OnboardingInput label="Purchase Date" type="date" icon={<Calendar size={12}/>} value={onboardingForm.purchaseDate} onChange={(e:any) => setOnboardingForm({...onboardingForm, purchaseDate: e.target.value})} />
              <OnboardingInput label="Serial Number" placeholder="SN-RZ1-XXXX" icon={<Hash size={12}/>} value={onboardingForm.serialNumber} onChange={(e:any) => setOnboardingForm({...onboardingForm, serialNumber: e.target.value})} />
              <OnboardingInput label="Current Odometer/Usage" placeholder="e.g. 1500" icon={<Gauge size={12}/>} value={onboardingForm.usage} onChange={(e:any) => setOnboardingForm({...onboardingForm, usage: e.target.value})} />
              <OnboardingInput label="Last Official Service" type="date" icon={<Clock size={12}/>} value={onboardingForm.lastService} onChange={(e:any) => setOnboardingForm({...onboardingForm, lastService: e.target.value})} />
            </div>

            <div className="bg-surface-2/50 p-4 rounded-xl border border-line flex gap-4">
                <Wrench className="text-signal shrink-0" size={18} />
                <p className="text-[11px] text-text-muted leading-relaxed italic">
                    AI Note: This data allows the platform to predict component degradation and schedule maintenance windows automatically.
                </p>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-line">
              <Button variant="ghost" onClick={() => setView("discovery")} className="text-text-faint text-xs font-mono">← RE_SELECT_NODE</Button>
              <Button onClick={handleCompleteIntegration} disabled={isSaving} className="bg-signal text-canvas font-bold px-10 h-12 rounded-xl shadow-lg shadow-signal/20 gap-2">
                {isSaving ? <Loader2 className="animate-spin" /> : <>FINALIZE_LINKING <ChevronRight size={16}/></>}
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
        <div className="p-6 border-b border-line bg-surface/30 sticky top-0 z-10 backdrop-blur-md flex justify-between items-center text-xs font-mono">
          <button onClick={() => setView("garage")} className="flex items-center gap-2 text-text-muted hover:text-signal transition-colors uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Command
          </button>
          <Badge variant="outline" className="text-signal border-signal/20">MANUFACTURER_CATALOG_ACTIVE</Badge>
        </div>
        <DiscoveryHub onAddProduct={(p) => { setSelectedProduct(p); setView("onboarding"); }} />
      </div>
    );
  }

  // --- VIEW: MAIN FLEET COMMAND ---
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto h-full scrollbar-hide">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-2/50 p-6 rounded-3xl border border-line">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-signal">
            <LayoutDashboard size={20} />
            <h1 className="text-2xl font-display font-bold tracking-tight">Fleet Command</h1>
          </div>
          <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">
            Authenticated: User_Alex // DB_Sync: {myGarage.length > 0 ? 'Nominal' : 'Waiting...'}
          </p>
        </div>
        
        <Button onClick={() => setView("discovery")} className="bg-signal text-canvas font-bold rounded-xl px-6 h-11 hover:scale-105 transition-all shadow-lg shadow-signal/20">
          <Plus size={18} className="mr-2" /> Register New Unit
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-24">
        {myGarage.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed border-line rounded-3xl opacity-40">
             <Activity size={40} className="mx-auto mb-4" />
             <p className="text-sm font-mono uppercase tracking-widest">No active technical nodes. Register a unit to begin monitoring.</p>
          </div>
        )}

        {myGarage.map((unit) => (
          <Card 
            key={unit._id} 
            className={`bg-surface border-line overflow-hidden border-l-4 transition-all hover:shadow-2xl hover:shadow-signal/5 ${
                unit.healthScore < 60 ? 'border-l-alert' : 'border-l-confirm'
            }`}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Health and Progress Rail */}
              <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-line space-y-4 bg-canvas/20">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={unit.healthScore < 60 ? 'alert' : 'confirm'} 
                    className="px-3 py-1 font-mono text-[9px] uppercase tracking-tighter"
                  >
                    {unit.healthScore < 60 ? 'ACTION_REQUIRED' : 'STATUS_NOMINAL'}
                  </Badge>
                  <Activity size={18} className={unit.healthScore < 60 ? 'text-alert animate-bounce' : 'text-confirm animate-pulse'} />
                </div>
                <h3 className="text-2xl font-display font-bold text-text truncate">{unit.productName}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-text-muted">
                    <span>Structural_Integrity</span>
                    <span className={unit.healthScore < 60 ? 'text-alert' : 'text-confirm'}>{unit.healthScore}%</span>
                  </div>
                  <Progress value={unit.healthScore} className="h-1.5" />
                </div>
              </div>

              {/* Data Readout and Tools */}
              <div className="p-6 flex-1 bg-surface-2/10 flex flex-col justify-between">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatBox label="Commissioned" value={formatDate(unit.purchaseDate)} />
                    <StatBox label="Last Service" value={formatDate(unit.lastServiceDate)} />
                    <StatBox label="Serial Code" value={unit.serialNumber} />
                    <StatBox label="Backend_Ref" value={unit.productId?.toUpperCase()} color="text-signal" />
                 </div>
                 
                 <div className="flex flex-wrap gap-3">
                    <Button 
                      className={`h-12 px-10 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${
                        unit.healthScore < 60 
                        ? 'bg-alert text-white hover:bg-alert/90 shadow-lg shadow-alert/20' 
                        : 'border-line bg-transparent hover:border-signal text-text hover:text-signal'
                      }`} 
                      onClick={() => onStartRepair(unit)} 
                    >
                      {unit.healthScore < 60 ? 'Launch Emergency Repair' : 'Run Technical Audit'}
                    </Button>
                    <Button 
                        variant="outline" 
                        className="h-12 w-12 border-line hover:border-signal" 
                        onClick={() => setReportMode({id: unit._id, type: 'video'})}
                    >
                      <Video size={18} />
                    </Button>
                 </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Multimodal Report Overlay */}
      {reportMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-canvas/90 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setReportMode(null)} />
            <Card className="relative w-full max-w-lg bg-surface border-line shadow-2xl overflow-hidden border-t-4 border-t-signal">
                <div className="p-8 space-y-6 text-center">
                    <div className="h-16 w-16 bg-signal/10 rounded-2xl flex items-center justify-center text-signal mx-auto mb-4 border border-signal/20">
                       <Video size={32} />
                    </div>
                    <div>
                        <h4 className="font-display font-bold text-xl text-text uppercase tracking-tight">Diagnostic Stream</h4>
                        <p className="text-sm text-text-muted mt-2">Uploading audiovisual fault packets directly to secure S3 storage for AI analysis.</p>
                    </div>
                    
                    <S3UploadZone 
                        role="customer" 
                        allowedTypes={["video/mp4", "image/jpeg", "image/png"]} 
                        onUploadComplete={(url) => { 
                            setReportMode(null); 
                            const matchingUnit = myGarage.find(u => u._id === reportMode.id);
                            onStartRepair(matchingUnit); 
                        }} 
                    />

                    <button onClick={() => setReportMode(null)} className="text-[10px] text-text-faint hover:text-alert font-mono uppercase underline">Abort_Transmission</button>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
}

// Technical Readout Component
function StatBox({ label, value, color = "text-text" }: any) {
    return (
        <div className="bg-canvas/50 p-4 rounded-xl border border-line shadow-inner">
            <p className="text-[10px] text-text-faint uppercase font-bold mb-1 tracking-tighter">{label}</p>
            <p className={`text-xs font-mono font-bold truncate ${color}`}>{value}</p>
        </div>
    );
}

// Styled Onboarding Input
function OnboardingInput({ label, icon, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase text-text-muted flex items-center gap-2 italic">
                {icon} {label}
            </label>
            <Input {...props} className="bg-surface-2 border-line h-12 focus:ring-signal rounded-xl" />
        </div>
    );
}