"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, ShieldCheck, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WelcomePage() {
  const router = useRouter();
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FBF9F9] min-h-full pb-6">
      {/* Top Bar Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <h1 className="text-xl font-bold tracking-tight text-[#0B3C68]">
          {t.welcome.header}
        </h1>

        {/* Dual Language Switcher Button */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#0B3C68] transition-colors touch-active border border-slate-200"
        >
          <Globe className="w-3.5 h-3.5 text-[#0B3C68]" />
          <span>{language === "en" ? "සිංහල" : "English"}</span>
        </button>
      </header>

      {/* Main Container Content */}
      <main className="px-5 py-4 flex-1 flex flex-col justify-center max-w-[420px] mx-auto w-full">
        {/* Graphic Illustration Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,76,129,0.06)] overflow-hidden mb-6"
        >
          <div className="relative w-full h-52 bg-gradient-to-b from-sky-50 to-blue-50/50 rounded-2xl flex flex-col items-center justify-center p-3 overflow-hidden border border-sky-100/60">
            {/* Custom SVG Vector Illustration representing Hambantota Port HR Office */}
            <svg
              className="w-full h-full text-[#0F4C81]"
              viewBox="0 0 400 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Office Window & Background Cargo Ship */}
              <rect x="30" y="20" width="340" height="150" rx="8" fill="#FFFFFF" stroke="#D1E5F7" strokeWidth="2"/>
              <line x1="140" y1="20" x2="140" y2="170" stroke="#E2EFF9" strokeWidth="2"/>
              <line x1="260" y1="20" x2="260" y2="170" stroke="#E2EFF9" strokeWidth="2"/>
              
              {/* Distant Port Cargo Ship & Containers in Window */}
              <path d="M40 100 L90 100 L85 112 L45 112 Z" fill="#0060A8"/>
              <rect x="50" y="88" width="12" height="12" fill="#38A1F3" rx="1"/>
              <rect x="65" y="88" width="12" height="12" fill="#0F4C81" rx="1"/>
              <path d="M100 70 L120 70 L115 112 M110 70 L110 40 L135 45" stroke="#94A3B8" strokeWidth="2"/>

              {/* Office Desk */}
              <rect x="70" y="140" width="260" height="45" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2"/>

              {/* Characters */}
              <circle cx="140" cy="95" r="18" fill="#1E293B"/>
              <path d="M125 90 C125 75 155 75 155 90 Z" fill="#475569"/>
              <path d="M120 140 C120 115 160 115 160 140 Z" fill="#0F4C81"/>
              
              <circle cx="260" cy="95" r="18" fill="#0B3C68"/>
              <path d="M240 140 C240 115 280 115 280 140 Z" fill="#1E293B"/>

              {/* Laptop on desk */}
              <path d="M180 135 L220 135 L225 145 L175 145 Z" fill="#64748B"/>
              <rect x="185" y="112" width="30" height="23" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5"/>
              <text x="190" y="126" fontSize="6" fill="#0060A8" fontWeight="bold">WELCOME</text>
              <rect x="192" y="129" width="16" height="4" rx="1" fill="#0F4C81"/>
            </svg>
          </div>

          <div className="text-center mt-5 mb-2 px-2">
            <h2 className="text-xl font-bold text-[#0B3C68] tracking-tight leading-snug">
              {t.welcome.title}
            </h2>
            <p className="text-sm font-normal text-slate-500 mt-2">
              {t.welcome.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-3"
        >
          <Link
            href="/login"
            className="w-full h-13 py-3.5 px-4 bg-[#0B3C68] hover:bg-[#0F4C81] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-900/10 transition-all touch-active"
          >
            <LogIn className="w-5 h-5 stroke-[2.2]" />
            <span className="text-base">{t.welcome.login}</span>
          </Link>

          <Link
            href="/login?tab=register"
            className="w-full h-13 py-3.5 px-4 bg-white border border-[#0B3C68] text-[#0B3C68] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-sky-50/50 transition-all touch-active"
          >
            <UserPlus className="w-5 h-5 stroke-[2.2]" />
            <span className="text-base">{t.welcome.register}</span>
          </Link>
        </motion.div>

        {/* Encrypted Note */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-slate-500 text-xs">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-600">{t.welcome.confidential}</span>
        </div>
      </main>

      {/* Footer Branding & Dots */}
      <footer className="text-center pt-2 px-4 space-y-2">
        <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          {t.welcome.poweredBy}
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
      </footer>
    </div>
  );
}
