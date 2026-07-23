"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  RefreshCw,
  CheckCircle2,
  MessageSquare,
  Paperclip,
  Globe,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import UserAvatar from "@/components/UserAvatar";

export default function AlertsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  const { t, language, toggleLanguage } = useLanguage();

  // Auto-mark notifications as viewed/read on entering Notification Center, keeping them saved in history
  useEffect(() => {
    const timer = setTimeout(() => {
      markAllAsRead();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const hrRequested = notifications.filter((n) => n.group === "hr_requested_info");
  const statusChanged = notifications.filter((n) => n.group === "status_changed");
  const newUpdates = notifications.filter((n) => n.group === "new_updates");


  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F9] min-h-full pb-8">
      {/* Top Bar Navigation Header */}
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="p-1 rounded-full text-slate-700 hover:bg-slate-100 transition-colors touch-active"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-base font-bold text-[#0F172A] tracking-tight">
            {t.alerts.headerTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-bold text-[#0B3C68] border border-slate-200"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === "en" ? "සිං" : "EN"}</span>
          </button>

          <Link href="/profile" className="touch-active">
            <UserAvatar name={user?.name} size="md" />
          </Link>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 px-5 pt-5 space-y-6">
        {/* Section Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t.alerts.title}
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {t.alerts.subTitle}
            </p>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-[11px] font-bold text-[#0060A8] tracking-wider uppercase hover:underline pt-1"
          >
            {t.alerts.markAllRead}
          </button>
        </div>

        {/* Group 1: HR Requested More Information */}
        {hrRequested.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <span className="text-red-600 font-extrabold text-lg leading-none">!</span>
              <h3 className="text-sm font-bold tracking-tight">
                {t.alerts.groupHrRequested}
              </h3>
            </div>

            <div className="space-y-3">
              {hrRequested.map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => markAsRead(item.id)}
                  className={`relative bg-white rounded-2xl p-4 border ${
                    !item.isRead ? "border-slate-200 shadow-sm" : "border-slate-100"
                  } transition-all cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-red-100/70 text-red-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>{item.complaintId}</span>
                        <div className="flex items-center gap-1.5">
                          <span>{item.timeAgo}</span>
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                          )}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {language === "si" ? t.alerts.notif1Title : item.title}
                      </h4>
                      <p className="text-xs font-normal text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {language === "si" ? t.alerts.notif1Desc : item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Group 2: Complaint Status Changed */}
        {statusChanged.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <RefreshCw className="w-4 h-4 text-[#0B3C68] stroke-[2]" />
              <h3 className="text-sm font-bold tracking-tight">
                {t.alerts.groupStatusChanged}
              </h3>
            </div>

            <div className="space-y-3">
              {statusChanged.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => markAsRead(item.id)}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start gap-3">
                    {item.statusBadge === "UNDER REVIEW" ? (
                      <div className="w-11 h-11 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <RefreshCw className="w-5 h-5 stroke-[2.2]" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#0F4C81] text-white flex items-center justify-center shrink-0 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>{item.complaintId}</span>
                        <div className="flex items-center gap-1.5">
                          <span>{item.timeAgo}</span>
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {language === "si"
                          ? idx === 0
                            ? t.alerts.notif2Title
                            : t.alerts.notif3Title
                          : item.title}
                      </h4>
                      <p className="text-xs font-normal text-slate-500 mt-1 leading-relaxed">
                        {language === "si"
                          ? idx === 0
                            ? t.alerts.notif2Desc
                            : t.alerts.notif3Desc
                          : item.description}
                      </p>

                      {/* Status Badge Pill */}
                      {item.statusBadge === "UNDER REVIEW" && (
                        <div className="mt-3 inline-block">
                          <span className="px-3 py-1 bg-sky-100/80 text-[#0284C7] text-[10px] font-bold rounded-full uppercase tracking-wider">
                            {t.alerts.badgeUnderReview}
                          </span>
                        </div>
                      )}
                      {item.statusBadge === "RESOLVED" && (
                        <div className="mt-3 inline-block">
                          <span className="px-3 py-1 bg-[#FFEDD5] text-[#9A3412] text-[10px] font-bold rounded-full uppercase tracking-wider">
                            {t.alerts.badgeResolved}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Group 3: New Complaint Updates */}
        {newUpdates.length > 0 && (
          <section className="space-y-3 pb-6">
            <div className="flex items-center gap-2 text-slate-900">
              <MessageSquare className="w-4 h-4 text-[#0060A8] stroke-[2]" />
              <h3 className="text-sm font-bold tracking-tight">
                {t.alerts.groupNewUpdates}
              </h3>
            </div>

            <div className="space-y-3">
              {newUpdates.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => markAsRead(item.id)}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      {item.badgeType === "comment" ? (
                        <MessageSquare className="w-5 h-5 stroke-[1.8]" />
                      ) : (
                        <Paperclip className="w-5 h-5 stroke-[1.8]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>{item.complaintId}</span>
                        <div className="flex items-center gap-1.5">
                          <span>{item.dateStr}</span>
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {language === "si"
                          ? idx === 0
                            ? t.alerts.notif4Title
                            : t.alerts.notif5Title
                          : item.title}
                      </h4>
                      <p className="text-xs font-normal text-slate-500 mt-1 leading-relaxed">
                        {language === "si"
                          ? idx === 0
                            ? t.alerts.notif4Desc
                            : t.alerts.notif5Desc
                          : item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
