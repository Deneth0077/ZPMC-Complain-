"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Filter, Plus } from "lucide-react";
import { Complaint } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

const mockUserComplaints: Complaint[] = [
  {
    id: "c-1",
    complaintNo: "COMP-4829",
    category: "OTHER_ISSUES",
    categoryTitle: "Medical Certificate Missing",
    subType: "Medical Policy",
    description: "Submitted sick leave medical slip was flagged missing in monthly payroll audit.",
    status: "PENDING",
    createdAt: "2026-07-22",
    updatedAt: "2h ago",
    employeeNo: "HMPT-1234",
  },
  {
    id: "c-2",
    complaintNo: "COMP-4712",
    category: "OTHER_ISSUES",
    categoryTitle: "Safety Equipment Delay",
    subType: "Workplace Safety",
    description: "Request for high-visibility port helmet replacement pending supervisor signature.",
    status: "UNDER REVIEW",
    createdAt: "2026-07-20",
    updatedAt: "5h ago",
    employeeNo: "HMPT-1234",
    assignedOfficer: "Senior HR Officer Silva",
  },
  {
    id: "c-3",
    complaintNo: "COMP-4501",
    category: "OT_ISSUES",
    categoryTitle: "Overtime Discrepancy",
    subType: "Incorrect OT",
    description: "Weekend shift hours on berth 3 not calculated in payroll system.",
    status: "RESOLVED",
    createdAt: "2026-07-15",
    updatedAt: "Yesterday",
    employeeNo: "HMPT-1234",
  },
];

export default function MyComplaintsPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filtered = mockUserComplaints.filter((c) => {
    const matchesSearch =
      c.complaintNo.toLowerCase().includes(search.toLowerCase()) ||
      c.categoryTitle.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "ALL" || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F9] min-h-full pb-20 relative">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/home")}
            className="p-1 rounded-full text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-slate-900">{t.myComplaints.headerTitle}</h1>
        </div>
      </header>

      <main className="flex-1 px-5 pt-4 space-y-4">
        {/* Statistics Bar */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
            <div className="text-xs text-slate-400 font-bold uppercase">{t.myComplaints.statActive}</div>
            <div className="text-lg font-bold text-[#0B3C68] mt-0.5">2</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
            <div className="text-xs text-slate-400 font-bold uppercase">{t.myComplaints.statResolved}</div>
            <div className="text-lg font-bold text-emerald-600 mt-0.5">1</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
            <div className="text-xs text-slate-400 font-bold uppercase">{t.myComplaints.statPending}</div>
            <div className="text-lg font-bold text-orange-600 mt-0.5">1</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.myComplaints.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
            />
          </div>
          <button
            onClick={() => {
              const next = filterStatus === "ALL" ? "UNDER REVIEW" : filterStatus === "UNDER REVIEW" ? "RESOLVED" : "ALL";
              setFilterStatus(next);
            }}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold flex items-center gap-1"
          >
            <Filter className="w-4 h-4 text-[#0060A8]" />
            <span>{filterStatus}</span>
          </button>
        </div>

        {/* Complaints List */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => alert(`Viewing full details for ${item.complaintNo}`)}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B3C68]">
                  {item.complaintNo}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.status === "RESOLVED"
                      ? "bg-[#FFEDD5] text-[#9A3412]"
                      : item.status === "UNDER REVIEW"
                      ? "bg-sky-100 text-[#0284C7]"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {item.status === "UNDER REVIEW" ? t.alerts.badgeUnderReview : item.status === "RESOLVED" ? t.alerts.badgeResolved : t.alerts.badgePending}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {item.categoryTitle}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {item.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>{t.myComplaints.updated}: {item.updatedAt}</span>
                <span className="text-[#0060A8] font-bold">{t.myComplaints.viewDetails}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Add FAB */}
      <Link
        href="/complaints/new"
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-[#0B3C68] text-white flex items-center justify-center shadow-lg"
      >
        <Plus className="w-7 h-7" />
      </Link>
    </div>
  );
}
