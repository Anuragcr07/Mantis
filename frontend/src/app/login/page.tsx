"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wrench, ShieldCheck, UserCircle, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"customer" | "company">("customer");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enforce role-based routing
    // Once they log in here, the role is locked for that session
    router.push(`/?role=${role}&authenticated=true`);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 bg-grid">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-xl bg-signal flex items-center justify-center">
          <Wrench className="text-canvas" size={28} />
        </div>
        <h1 className="text-3xl font-display font-bold tracking-tighter text-text">TORQUE</h1>
      </div>

      <Card className="w-full max-w-md bg-surface border-line shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex bg-surface-2 p-1 rounded-xl border border-line w-full">
              <button
                onClick={() => setRole("customer")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  role === "customer" ? "bg-signal text-canvas" : "text-text-muted hover:text-text"
                }`}
              >
                <UserCircle size={14} /> Customer Login
              </button>
              <button
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

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input type="email" placeholder="Email Address" required className="h-12" />
            <Input type="password" placeholder="Password" required className="h-12" />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className={`w-full h-12 font-bold text-canvas gap-2 ${role === 'customer' ? 'bg-signal' : 'bg-confirm'}`}
            >
              Sign In to {role === "customer" ? "Garage" : "Dashboard"} <ArrowRight size={18} />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}