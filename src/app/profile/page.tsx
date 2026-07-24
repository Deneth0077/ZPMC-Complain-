"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Building,
  Globe,
  Moon,
  Bell,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import UserAvatar from "@/components/UserAvatar";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage, setLanguage } = useLanguage();

  const handleLogout = () => {
    logout();
    router.push("/welcome");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F9] min-h-full pb-8">
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/home")}
            className="p-1 rounded-full text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-slate-900">{t.profile.headerTitle}</h1>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 space-y-5">
        {/* User Badge Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <UserAvatar name={user?.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate">
              {user?.name || "Deneth"}
            </h2>
            <p className="text-xs font-semibold text-[#0060A8]">
              {user?.employeeNo || "HMPT-1234"}
            </p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {user?.designation || "Senior Operations Assistant"}
            </p>
          </div>
        </div>

        {/* Info Items */}
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-sm">
          <div className="p-3.5 flex items-center gap-3">
            <Building className="w-5 h-5 text-slate-400" />
            <div className="flex-1 text-xs">
              <span className="text-slate-400 block font-medium">{t.profile.department}</span>
              <span className="font-semibold text-slate-800">
                {user?.department || "Port Logistics Operations"}
              </span>
            </div>
          </div>

          <div className="p-3.5 flex items-center gap-3">
            <Phone className="w-5 h-5 text-slate-400" />
            <div className="flex-1 text-xs">
              <span className="text-slate-400 block font-medium">{t.profile.phone}</span>
              <span className="font-semibold text-slate-800">
                {user?.phone || "+94 77 123 4567"}
              </span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {/* Interactive Dual Language Picker Row */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-800">{t.profile.language}</span>
            </div>
            
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setLanguage("si")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === "si"
                    ? "bg-[#0B3C68] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                සිංහල
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === "en"
                    ? "bg-[#0B3C68] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("zh")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === "zh"
                    ? "bg-[#0B3C68] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                中文
              </button>
            </div>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-800">{t.profile.darkMode}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">{t.profile.systemAuto}</span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-800">
                {t.profile.pushNotifications}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-600">{t.profile.enabled}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 border border-red-100 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.profile.logout}</span>
        </button>

        {/* Gateway Security Badge */}
        <div className="text-center pt-2 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.profile.securityBadge}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold">
            Port Mobile Gateway v1.0.0
          </p>
        </div>
      </main>
    </div>
  );
}
