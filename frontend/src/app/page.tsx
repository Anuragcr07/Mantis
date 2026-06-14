"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { CustomerGarage } from "@/components/customer/customer-garage";
import { CompanyDashboard } from "@/components/company/company-dashboard";
import { ShieldCheck, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const searchParams = useSearchParams();
  
  // Initial state based on URL parameters (simulating login redirect)
  const [role, setRole] = useState<"customer" | "company">("customer");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    const authParam = searchParams.get("authenticated");

    if (authParam === "true") {
      setIsLoggedIn(true);
      if (roleParam === "company") setRole("company");
    }
  }, [searchParams]);

  // If not logged in, show a simple landing view or redirect to login
  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-canvas flex flex-col items-center justify-center text-center p-6">
        <div className="bg-signal p-4 rounded-2xl mb-6">
          <ShieldCheck size={48} className="text-canvas" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4">Torque AI Mechanic</h1>
        <p className="text-text-muted mb-8 max-w-md">The universal troubleshooting and maintenance platform for all your physical products.</p>
        <Link href="/login">
          <button className="bg-signal text-canvas font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">
            Enter Platform
          </button>
        </Link>
      </div>
    );
  }

  // --- LOGGED IN VIEWS ---
  if (role === "customer") {
    return (
      <div className="flex h-screen flex-col bg-canvas text-text overflow-hidden">
        <header className="flex items-center justify-between border-b border-line px-6 py-3 bg-surface/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-signal text-canvas font-bold px-2 py-0.5 rounded text-sm tracking-tighter">TORQUE</div>
            <span className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] hidden sm:block border-l border-line pl-3">Customer Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setRole("company")} className="text-xs text-text-muted hover:text-signal transition-colors flex items-center gap-1.5"><ShieldCheck size={14} /> Admin Mode</button>
            <div className="flex items-center gap-2 text-sm font-medium border-l border-line pl-4">
              <UserCircle size={18} className="text-text-muted" />
              <button onClick={() => setIsLoggedIn(false)} className="hover:text-alert"><LogOut size={16}/></button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          {isRepairing ? (
            <AppShell onBack={() => setIsRepairing(false)} />
          ) : (
            <CustomerGarage onStartRepair={() => setIsRepairing(true)} />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-canvas text-text">
      <header className="flex items-center justify-between border-b border-line px-6 py-4 bg-surface shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-confirm text-canvas font-bold px-2 py-0.5 rounded text-sm italic tracking-tighter">PHILIX</div>
          <span className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] border-l border-line pl-3">Admin Console</span>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setRole("customer")} className="text-xs text-text-muted hover:text-text transition-colors">Switch to Customer</button>
           <button onClick={() => setIsLoggedIn(false)} className="text-alert"><LogOut size={18} /></button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <CompanyDashboard />
      </main>
    </div>
  );
}