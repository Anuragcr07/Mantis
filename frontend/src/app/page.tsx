"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { CustomerGarage } from "@/components/customer/customer-garage";
import { CompanyDashboard } from "@/components/company/company-dashboard";
import { UserCircle, LogOut, ShieldCheck, Lock } from "lucide-react";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [role, setRole] = useState<"customer" | "company" | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    const authParam = searchParams.get("authenticated");

    if (authParam === "true") {
      setIsLoggedIn(true);
      setRole(roleParam as any);
    }
  }, [searchParams]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
    router.push("/login"); // Forces them back to role selection
  };

  // --- UNAUTHENTICATED STATE ---
  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-canvas flex flex-col items-center justify-center text-center p-6">
        <div className="bg-surface-2 p-6 rounded-3xl border border-line mb-6">
            <Lock size={40} className="text-text-muted" />
        </div>
        <h1 className="text-2xl font-display font-bold text-text mb-2">Protected Gateway</h1>
        <p className="text-text-muted mb-8">Please authenticate to access your specialized dashboard.</p>
        <button 
          onClick={() => router.push("/login")}
          className="bg-signal text-canvas font-bold px-8 py-3 rounded-xl hover:bg-signal/90"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // --- CUSTOMER ROLE (Admin features are hidden) ---
  if (role === "customer") {
    return (
      <div className="flex h-screen flex-col bg-canvas text-text">
        <header className="flex items-center justify-between border-b border-line px-6 py-3 bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="bg-signal text-canvas font-bold px-2 py-0.5 rounded text-sm uppercase">Torque</div>
            <span className="text-text-muted text-xs font-mono uppercase tracking-widest hidden sm:block border-l border-line pl-3">Garage_Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-text-muted font-medium pr-4 border-r border-line">
              <UserCircle size={18} />
              <span>Alex M.</span>
            </div>
            <button onClick={handleLogout} className="text-text-muted hover:text-alert flex items-center gap-1 text-xs font-bold">
              <LogOut size={14} /> SIGN OUT
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {isRepairing ? (
            <AppShell onBack={() => setIsRepairing(false)} />
          ) : (
            <CustomerGarage onStartRepair={() => setIsRepairing(true)} />
          )}
        </main>
      </div>
    );
  }

  // --- COMPANY ADMIN ROLE (Customer features are hidden) ---
  if (role === "company") {
    return (
      <div className="flex h-screen flex-col bg-canvas text-text">
        <header className="flex items-center justify-between border-b border-line px-6 py-4 bg-surface">
          <div className="flex items-center gap-3">
            <div className="bg-confirm text-canvas font-bold px-2 py-0.5 rounded text-sm italic uppercase tracking-tighter">Philix</div>
            <span className="text-confirm text-[10px] font-mono uppercase tracking-[0.3em] border-l border-confirm/30 pl-3">Admin_HQ</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-confirm">
                <ShieldCheck size={14} /> System Encrypted
            </div>
            <button onClick={handleLogout} className="bg-alert/10 text-alert border border-alert/20 px-4 py-1 rounded-lg text-xs font-bold hover:bg-alert hover:text-white transition-all">
              SECURE LOGOUT
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <CompanyDashboard />
        </main>
      </div>
    );
  }

  return null;
}