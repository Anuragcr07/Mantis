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
  
  // Mock login handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd verify credentials here
    // For the demo, we redirect to the main page with a search param
    router.push(`/?role=${role}&authenticated=true`);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 bg-grid">
      {/* Branding */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-xl bg-signal flex items-center justify-center shadow-lg shadow-signal/20">
          <Wrench className="text-canvas" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tighter text-text">TORQUE</h1>
          <p className="text-xs font-mono text-text-muted uppercase tracking-[0.3em]">AI Product Expert</p>
        </div>
      </div>

      <Card className="w-full max-w-md bg-surface border-line shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex bg-surface-2 p-1 rounded-lg border border-line">
              <button
                onClick={() => setRole("customer")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                  role === "customer" ? "bg-signal text-canvas" : "text-text-muted hover:text-text"
                }`}
              >
                <UserCircle size={14} /> Customer
              </button>
              <button
                onClick={() => setRole("company")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                  role === "company" ? "bg-confirm text-canvas" : "text-text-muted hover:text-text"
                }`}
              >
                <ShieldCheck size={14} /> Manufacturer
              </button>
            </div>
          </div>
          <CardTitle className="text-2xl font-display font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <p className="text-sm text-text-muted">
            {role === "customer" 
              ? "Access your garage and troubleshoot products." 
              : "Manage product knowledge and customer health."}
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase">
                  {role === "customer" ? "Full Name" : "Company Name"}
                </label>
                <Input placeholder={role === "customer" ? "John Doe" : "Philix Electronics"} required />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-mono text-text-muted uppercase">Email Address</label>
              <Input type="email" placeholder="name@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono text-text-muted uppercase">Password</label>
                {isLogin && <button className="text-[10px] text-signal hover:underline">Forgot password?</button>}
              </div>
              <Input type="password" placeholder="••••••••" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className={`w-full h-12 font-bold text-canvas gap-2 ${role === 'customer' ? 'bg-signal hover:bg-signal/90' : 'bg-confirm hover:bg-confirm/90'}`}
            >
              {isLogin ? "Sign In" : "Register"} <ArrowRight size={18} />
            </Button>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-text-muted hover:text-text transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </CardFooter>
        </form>
      </Card>

      {/* Footer info */}
      <p className="mt-8 text-[10px] text-text-faint font-mono text-center max-w-[280px]">
        SECURE GATEWAY V4.0 // ENCRYPTED_SESSION_ACTIVE // TORQUE_DIAGNOSTICS_PRTCL
      </p>
    </div>
  );
}