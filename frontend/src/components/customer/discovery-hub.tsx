"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { Search, Plus, Bike, Wind, Cpu, CheckCircle2, Globe, Shield } from "lucide-react";

export function DiscoveryHub({ onAddProduct }: { onAddProduct: (p: any) => void }) {
  const [search, setSearch] = useState("");
  
  const catalog = [
    { id: '1', name: "Arctic v2 AC", brand: "Philix", category: "Appliance", icon: Wind, docs: 12 },
    { id: '2', name: "RZ-1 Scooter", brand: "Torque", category: "EV", icon: Bike, docs: 8 },
    { id: '3', name: "Wash-Master", brand: "Philix", category: "Appliance", icon: Cpu, docs: 5 },
    { id: '4', name: "Hydro-Pure", brand: "PureFlow", category: "Water", icon: Globe, docs: 3 },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-6 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-display font-bold tracking-tight text-text">Manufacturer Intelligence Catalog</h1>
        <p className="text-text-muted leading-relaxed">Search official support databases for scooters, household appliances, and industrial electronics. Select a model to begin technical onboarding.</p>
        <div className="relative mt-4">
          <Search className="absolute left-5 top-5 text-text-faint" size={24} />
          <Input 
            placeholder="Enter brand or model name (e.g. Philix Arctic)..." 
            className="pl-14 bg-surface border-line h-16 rounded-3xl text-lg shadow-inner ring-offset-canvas focus-visible:ring-signal"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {catalog.map((product) => (
          <Card key={product.id} className="bg-surface border-line p-8 hover:border-signal transition-all group relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-10">
                <div className="h-16 w-16 rounded-2xl bg-surface-2 flex items-center justify-center group-hover:bg-signal group-hover:text-canvas transition-all shadow-md border border-line">
                    <product.icon size={32} />
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-confirm mb-1">
                        <Shield size={12} /> VERIFIED_DOCS
                    </div>
                    <p className="text-[11px] font-mono text-text-faint uppercase">{product.docs} Source Assets</p>
                </div>
            </div>

            <div className="flex-1">
                <Badge variant="outline" className="mb-3 text-[10px] uppercase font-mono tracking-widest text-signal border-signal/20">{product.brand}</Badge>
                <h3 className="text-2xl font-bold font-display group-hover:text-signal transition-colors tracking-tight">{product.name}</h3>
                <p className="text-text-muted text-sm mt-4 leading-relaxed line-clamp-2 italic">
                    AI-Powered diagnostic engine trained on official repair blueprints and service records.
                </p>
            </div>
            
            <Button 
              onClick={() => onAddProduct(product)}
              className="w-full mt-10 bg-surface-2 hover:bg-signal hover:text-canvas border-line rounded-2xl font-bold h-12 shadow-sm transition-all"
            >
              <Plus size={18} className="mr-2" /> Initialize Registration
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}