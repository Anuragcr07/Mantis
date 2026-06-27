"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wrench, ShieldCheck, UserCircle, ArrowRight, Loader2 } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "company">("customer");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mimic quick authentication processing before routing
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/?role=${role}&authenticated=true`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 bg-grid">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-xl bg-signal flex items-center justify-center">
          <Wrench className="text-canvas" size={28} />
        </div>
        <h1 className="text-3xl font-display font-bold tracking-tighter text-text">TORQUE</h1>
      </div>

      <Card className="w-full max-w-md bg-surface border-line shadow-2xl relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-signal" size={36} />
            <p className="text-sm font-mono text-text-muted uppercase tracking-widest">Verifying Identity...</p>
          </div>
        )}

        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex bg-surface-2 p-1 rounded-xl border border-line w-full">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  role === "customer" ? "bg-signal text-canvas" : "text-text-muted hover:text-text"
                }`}
              >
                <UserCircle size={14} /> Customer Login
              </button>
              <button
                type="button"
                onClick={() => setRole("company")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  role === "company" ? "bg-confirm text-canvas" : "text-text-muted hover:text-text"
                }`}
              >
                <ShieldCheck size={14} /> Admin Login
              </button>
            </div>
          </div>
          <CardTitle className="text-2xl font-display font-bold">
            {role === "customer" ? "User Portal" : "Manufacturer Admin"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="email" placeholder="Email Address" required className="h-12" />
            <Input type="password" placeholder="Password" required className="h-12" />
            <Button 
              type="submit" 
              className={`w-full h-12 font-bold text-canvas gap-2 ${role === 'customer' ? 'bg-signal' : 'bg-confirm'}`}
            >
              Sign In to {role === "customer" ? "Garage" : "Dashboard"} <ArrowRight size={18} />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}