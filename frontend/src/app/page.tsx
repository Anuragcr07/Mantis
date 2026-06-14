"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CustomerGarage } from "@/components/customer/customer-garage";
import { CompanyDashboard } from "@/components/company/company-dashboard";
import { ShieldCheck, UserCircle, LogOut } from "lucide-react";

export default function Home() {
  // role can be 'customer' or 'company'
  const [role, setRole] = useState<"customer" | "company">("customer");
  
  // isRepairing determines if we are looking at the Garage or the AI Mechanic
  const [isRepairing, setIsRepairing] = useState(false);

  // --- 1. CUSTOMER VIEW LOGIC ---
  if (role === "customer") {
    return (
      <div className="flex h-screen flex-col bg-canvas text-text overflow-hidden">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-line px-6 py-3 bg-surface/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-signal text-canvas font-bold px-2 py-0.5 rounded text-sm tracking-tighter">TORQUE</div>
            <span className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] hidden sm:block border-l border-line pl-3">
              Customer Portal
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {!isRepairing && (
              <button 
                onClick={() => setRole("company")} 
                className="text-xs text-text-muted hover:text-signal transition-colors flex items-center gap-1.5 font-medium"
              >
                <ShieldCheck size={14} /> Switch to Philix Admin
              </button>
            )}
            <div className="flex items-center gap-2 text-sm font-medium border-l border-line pl-6">
              <UserCircle size={18} className="text-text-muted" />
              <span className="hidden sm:inline">Alex's Garage</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {isRepairing ? (
            // The AI Mechanic
            <AppShell onBack={() => setIsRepairing(false)} />
          ) : (
            // The Garage (Products List)
            <CustomerGarage onStartRepair={() => setIsRepairing(true)} />
          )}
        </main>
      </div>
    );
  }

  // --- 2. COMPANY (PHILIX) VIEW LOGIC ---
  return (
    <div className="flex h-screen flex-col bg-canvas text-text">
      {/* Admin Header */}
      <header className="flex items-center justify-between border-b border-line px-6 py-4 bg-surface shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-confirm text-canvas font-bold px-2 py-0.5 rounded text-sm italic tracking-tighter">PHILIX</div>
          <span className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] border-l border-line pl-3">
            Admin Command Center
          </span>
        </div>
        <button 
          onClick={() => setRole("customer")} 
          className="bg-surface-2 border border-line px-4 py-1.5 rounded-lg text-xs hover:bg-surface-3 transition-all flex items-center gap-2 font-semibold text-text"
        >
          <LogOut size={14} /> Exit Admin Mode
        </button>
      </header>

      {/* The Dashboard Component */}
      <main className="flex-1 overflow-y-auto bg-grid">
        <CompanyDashboard />
      </main>
    </div>
  );
}