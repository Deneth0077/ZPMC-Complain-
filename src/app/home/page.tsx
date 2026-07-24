"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  Clock,
  Monitor,
  Banknote,
  Fingerprint,
  UserCheck,
  HelpCircle,
  MoreHorizontal,
  PlusCircle,
  Headphones,
  FileQuestion,
  Image as ImageIcon,
  Globe,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import UserAvatar from "@/components/UserAvatar";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F9] min-h-full pb-6">
      {/* Top Header */}
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-slate-800 leading-tight">
            {t.home.greeting} {user?.name || "Deneth"}
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            {user?.employeeNo || "HMPT-1234"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 3-Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#0B3C68] transition-colors border border-slate-200 touch-active"
          >
            <Globe className="w-3.5 h-3.5 text-[#0B3C68]" />
            <span>
              {language === "si" ? "සිංහල" : language === "en" ? "English" : "中文"}
            </span>
          </button>

          {/* Notification Bell */}
          <Link
            href="/alerts"
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors touch-active"
          >
            <Bell className="w-6 h-6 stroke-[1.8]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-sky-500 rounded-full ring-2 ring-white" />
            )}
          </Link>

          {/* User Profile Avatar */}
          <Link href="/profile" className="touch-active">
            <UserAvatar name={user?.name} size="md" />
          </Link>
        </div>
      </header>

      {/* Main Page Scroll Area */}
      <main className="flex-1 px-5 pt-4 space-y-6">
        {/* Hero Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full rounded-2xl bg-gradient-to-r from-[#0F4C81] to-[#0B3C68] p-5 text-white shadow-lg shadow-blue-950/10 overflow-hidden"
        >
          {/* Background Watermark Clipboard Graphic */}
          <div className="absolute right-2 -bottom-2 opacity-15 pointer-events-none">
            <FileQuestion className="w-36 h-36 text-white stroke-[1]" />
          </div>

          <div className="relative z-10 space-y-2 max-w-[75%]">
            <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
              {t.home.complainBannerTitle}
            </h2>
            <p className="text-xs font-normal text-sky-100/90 leading-relaxed">
              {t.home.complainBannerSub}
            </p>
          </div>

          <div className="mt-4 relative z-10 flex items-center gap-2">
            <button
              onClick={() => router.push("/complaints/describe")}
              className="py-2.5 px-4 bg-[#38A1F3] hover:bg-sky-400 text-white font-semibold text-xs rounded-full flex items-center gap-2 shadow-sm transition-all touch-active"
            >
              <span>{t.home.startNewComplaint}</span>
              <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            </button>

            {(user?.role === "hr_officer" || user?.role === "hr_manager" || user?.employeeNo?.startsWith("HR")) && (
              <button
                onClick={() => router.push("/hr/dashboard")}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs rounded-full flex items-center gap-1.5 shadow-sm transition-all touch-active"
              >
                <span>HR Admin Portal</span>
              </button>
            )}
          </div>
        </motion.div>


        {/* Categories Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              {t.home.categoriesTitle}
            </h2>
            <button
              onClick={() => router.push("/complaints")}
              className="text-xs font-bold text-[#0060A8] hover:underline"
            >
              {t.home.viewAll}
            </button>
          </div>

          {/* 5 Grid Cards with Custom Icons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: 1. වැටුප් සම්බන්ධ ප්රශ්න */}
            <div
              onClick={() => router.push("/complaints/no-pay")}
              className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-sm hover:shadow-md transition-all cursor-pointer touch-active flex flex-col justify-between h-36"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                <Banknote className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {t.home.catSalaryTitle || t.home.catNoPayTitle}
                </h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5 line-clamp-1">
                  {t.home.catSalarySub || t.home.catNoPaySub}
                </p>
              </div>
            </div>

            {/* Card 2: 2. HRIS System සම්බන්ධව ප්රශ්න */}
            <div
              onClick={() => router.push("/complaints/describe?category=HRIS_ERRORS")}
              className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-sm hover:shadow-md transition-all cursor-pointer touch-active flex flex-col justify-between h-36"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <Monitor className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {t.home.catHrisTitle}
                </h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5 line-clamp-1">
                  {t.home.catHrisSub}
                </p>
              </div>
            </div>

            {/* Card 3: 3. Fingerprint Mashine සම්බන්ධ ප්රශ්න */}
            <div
              onClick={() => router.push("/complaints/describe?category=FINGERPRINT_ISSUES")}
              className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-sm hover:shadow-md transition-all cursor-pointer touch-active flex flex-col justify-between h-36"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                <Fingerprint className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {t.home.catFingerprintTitle}
                </h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5 line-clamp-1">
                  {t.home.catFingerprintSub}
                </p>
              </div>
            </div>

            {/* Card 4: 4. සේවක අවශ්යතා සම්බන්ධ ප්රශ්න */}
            <div
              onClick={() => router.push("/complaints/describe?category=EMPLOYEE_NEEDS")}
              className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-sm hover:shadow-md transition-all cursor-pointer touch-active flex flex-col justify-between h-36"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <UserCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {t.home.catEmployeeNeedsTitle}
                </h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5 line-clamp-1">
                  {t.home.catEmployeeNeedsSub}
                </p>
              </div>
            </div>

            {/* Card 5: 5. වෙනත් ප්රශ්න (Full Width Card for symmetry) */}
            <div
              onClick={() => router.push("/complaints/describe?category=OTHER_ISSUES")}
              className="col-span-2 bg-white rounded-2xl p-4 border border-slate-200/70 shadow-sm hover:shadow-md transition-all cursor-pointer touch-active flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {t.home.catOtherTitle}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    {t.home.catOtherSub}
                  </p>
                </div>
              </div>
              <div className="text-slate-300 pr-2">
                <MoreHorizontal className="w-5 h-5" />
              </div>
            </div>
          </div>
        </section>

        {/* Recent Complaints Empty State Section */}
        <section className="space-y-3 pb-8">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            {t.home.recentComplaintsTitle}
          </h2>

          <div className="w-full rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-1">
              <ImageIcon className="w-8 h-8 stroke-[1.4]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {t.home.noComplaintsFound}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {t.home.upToDate}
            </p>
          </div>
        </section>
      </main>

      {/* Floating HR Chat Button FAB (Links directly to Dedicated Chat Screen) */}
      <div className="fixed bottom-20 right-5 z-40">
        <button
          onClick={() => router.push("/chat")}
          aria-label="Floating HR Chat"
          className="w-14 h-14 rounded-full bg-[#0B3B60] hover:bg-[#0F4C81] text-white flex items-center justify-center shadow-floating transition-all transform hover:scale-105 active:scale-95 touch-active"
        >
          <Headphones className="w-7 h-7 stroke-[2]" />
        </button>
      </div>
    </div>
  );
}
