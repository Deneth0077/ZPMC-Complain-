"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Clock,
  CheckSquare,
  CalendarCheck,
  Calculator,
  MoreHorizontal,
  Camera,
  FileText,
  Crop,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function OtIssuesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("incorrect_hours");
  const [details, setDetails] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const otOptions = [
    { id: "incorrect_hours", label: t.otIssuesPage.opt1, icon: Clock },
    { id: "not_approved", label: t.otIssuesPage.opt2, icon: CheckSquare },
    { id: "ot_missing", label: t.otIssuesPage.opt3, icon: CalendarCheck },
    { id: "calculation_error", label: t.otIssuesPage.opt4, icon: Calculator },
    { id: "other_ot", label: t.otIssuesPage.opt5, icon: MoreHorizontal },
  ];

  const filteredOptions = otOptions.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSimulateAttach = (type: string) => {
    setAttachments((prev) => [...prev, `${type}_Attachment_${prev.length + 1}`]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      alert("Please provide issue details.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedCode(`CMP-OT-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 1200);
  };

  if (submittedCode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FBF9F9] min-h-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-md"
        >
          <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
        </motion.div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          OT Complaint Submitted!
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1 mb-6">
          Your complaint has been routed directly to HR Compensation.
        </p>

        <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 mb-8">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Complaint Code
          </div>
          <div className="text-xl font-extrabold text-[#0B3C68] tracking-wider">
            {submittedCode}
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Routed Department</span>
            <span className="font-bold text-[#0B3C68]">HR Compensation</span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={() => router.push("/complaints")}
            className="w-full py-3.5 bg-[#0B3C68] text-white font-semibold text-sm rounded-xl shadow-sm"
          >
            View My Complaints
          </button>
          <button
            onClick={() => router.push("/home")}
            className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F9] min-h-full pb-24">
      {/* Top Header */}
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 rounded-full text-slate-700 hover:bg-slate-100 transition-colors touch-active"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">
            {t.otIssuesPage.headerTitle}
          </h1>
        </div>

        <Link href="/profile" className="touch-active">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-sm relative bg-slate-200">
            <Image
              src={
                user?.avatarUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
              }
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-4 space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.otIssuesPage.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] shadow-sm"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Issue Type */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                {t.otIssuesPage.selectIssueType}
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t.otIssuesPage.requiredTag}
              </span>
            </div>

            <div className="space-y-2.5">
              {filteredOptions.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = selectedType === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedType(opt.id)}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? "border-[#0B3C68] ring-2 ring-[#0B3C68]/10 shadow-sm"
                        : "border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0060A8] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {opt.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Issue Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                {t.otIssuesPage.issueDetailsHeading}
              </h2>
              <span className="px-2 py-0.5 bg-sky-50 text-[#0060A8] text-[9px] font-bold rounded-md uppercase tracking-wider">
                {t.otIssuesPage.bilingualTag}
              </span>
            </div>

            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t.otIssuesPage.detailsPlaceholder}
              className="w-full p-4 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] shadow-sm leading-relaxed"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2.5">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              {t.otIssuesPage.attachmentsHeading}
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSimulateAttach("Photo")}
                className="p-4 bg-white rounded-2xl border-2 border-dashed border-slate-200/90 flex flex-col items-center justify-center hover:border-[#0B3C68] transition-all touch-active"
              >
                <Camera className="w-6 h-6 text-slate-500 mb-1.5" />
                <span className="text-xs font-bold text-slate-700">{t.otIssuesPage.photoCard}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulateAttach("PDF")}
                className="p-4 bg-white rounded-2xl border-2 border-dashed border-slate-200/90 flex flex-col items-center justify-center hover:border-[#0B3C68] transition-all touch-active"
              >
                <FileText className="w-6 h-6 text-slate-500 mb-1.5" />
                <span className="text-xs font-bold text-slate-700">{t.otIssuesPage.pdfCard}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulateAttach("Screenshot")}
                className="p-4 bg-white rounded-2xl border-2 border-dashed border-slate-200/90 flex flex-col items-center justify-center hover:border-[#0B3C68] transition-all touch-active"
              >
                <Crop className="w-6 h-6 text-slate-500 mb-1.5" />
                <span className="text-xs font-bold text-slate-700">{t.otIssuesPage.screenshotCard}</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              {t.otIssuesPage.fileConstraintNote}
            </p>

            {attachments.length > 0 && (
              <div className="space-y-1 pt-1">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-between"
                  >
                    <span>{file}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Attached</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-13 py-3.5 bg-[#0B3C68] hover:bg-[#0F4C81] text-white font-semibold text-base rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-950/20 transition-all touch-active"
            >
              {isSubmitting ? (
                <span className="text-sm">Submitting...</span>
              ) : (
                <>
                  <span>{t.otIssuesPage.submitComplaint}</span>
                  <Send className="w-5 h-5 stroke-[2]" />
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-400 font-medium">
              {t.otIssuesPage.routingNote}
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
