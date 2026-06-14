"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { Search, Plus, Shield, Loader2 } from "lucide-react";
import { IconMap } from "@/lib/icons";
import { Input } from "../ui/input";

export function DiscoveryHub({ onAddProduct }: { onAddProduct: (p: any) => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/products/all");
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (e) { console.error("Marketplace Offline"); } finally { setLoading(false); }
    }
    loadCatalog();
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin text-signal" size={40} />
      <p className="font-mono text-xs text-text-muted italic">SYNCHRONIZING_GLOBAL_NODES...</p>
    </div>
  );

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-display font-bold text-text">Global Knowledge Catalog</h1>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-5 top-5 text-text-faint" size={24} />
          <Input placeholder="Search verified manufacturers..." className="pl-14 bg-surface border-line h-16 rounded-3xl text-lg" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((product) => {
          const Icon = IconMap[product.icon] || IconMap["Cpu"];
          return (
            <Card key={product._id} className="bg-surface border-line p-8 hover:border-signal transition-all group flex flex-col shadow-lg hover:shadow-signal/10">
              <div className="flex justify-between items-start mb-10">
                <div className="h-16 w-16 rounded-2xl bg-surface-2 flex items-center justify-center border border-line group-hover:bg-signal group-hover:text-canvas transition-all">
                  <Icon size={32} />
                </div>
                <Badge variant="outline" className="text-confirm border-confirm/20 bg-confirm/5 font-mono text-[10px]">AI_TRAINED</Badge>
              </div>
              <div className="flex-1">
                <Badge variant="outline" className="mb-2 text-[10px] uppercase font-mono text-signal border-signal/20">{product.brand}</Badge>
                <h3 className="text-2xl font-bold font-display text-text">{product.name}</h3>
                <p className="text-text-muted text-sm mt-4 italic line-clamp-2">Manufacturer support database indexed. Diagnostic engine status: Ready.</p>
              </div>
              <Button onClick={() => onAddProduct({ ...product, icon: Icon })} className="w-full mt-10 bg-surface-2 hover:bg-signal hover:text-canvas border-line rounded-2xl font-bold h-12 transition-all">
                <Plus size={18} className="mr-2" /> Register Unit to Garage
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}