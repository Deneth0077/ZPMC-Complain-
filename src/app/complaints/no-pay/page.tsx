"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  Calculator,
  CreditCard,
  MinusCircle,
  Award,
  Upload,
  Send,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function NoPayIssuesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState("salary_not_received");
  const [explanation, setExplanation] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const categories = [
    {
      id: "salary_not_received",
      title: t.noPay.opt1Title,
      sub: t.noPay.opt1Sub,
      icon: Banknote,
      iconBg: "bg-red-100/70 text-red-600",
    },
    {
      id: "incorrect_salary",
      title: t.noPay.opt2Title,
      sub: t.noPay.opt2Sub,
      icon: Calculator,
      iconBg: "bg-sky-100/70 text-sky-600",
    },
    {
      id: "allowance_missing",
      title: t.noPay.opt3Title,
      sub: t.noPay.opt3Sub,
      icon: CreditCard,
      iconBg: "bg-amber-100/70 text-amber-600",
    },
    {
      id: "wrong_deduction",
      title: t.noPay.opt4Title,
      sub: t.noPay.opt4Sub,
      icon: MinusCircle,
      iconBg: "bg-slate-100 text-slate-600",
    },
    {
      id: "bonus_missing",
      title: t.noPay.opt5Title,
      sub: t.noPay.opt5Sub,
      icon: Award,
      iconBg: "bg-[#E0F2FE] text-[#0284C7]",
    },
  ];

  const handleSimulateFileSelect = () => {
    setAttachedFiles((prev) => [...prev, `Bank_Statement_${prev.length + 1}.pdf`]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) {
      alert("Please provide detailed explanation for HR investigation.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const code = `COMP-${Math.floor(4000 + Math.random() * 900)}`;
      setSubmittedCode(code);
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
          Grievance Submitted!
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1 mb-6">
          Your payment discrepancy report has been routed to HR Payroll & Compensation.
        </p>

        <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 mb-8">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Reference Number
          </div>
          <div className="text-xl font-extrabold text-[#0B3C68] tracking-wider">
            {submittedCode}
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Review Priority</span>
            <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 font-bold rounded-full">
              HIGH
            </span>
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
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 rounded-full text-slate-700 hover:bg-slate-100 transition-colors touch-active"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">
            {t.noPay.headerTitle}
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

      {/* Main Form Content */}
      <main className="flex-1 px-5 pt-5 space-y-6">
        {/* Hero Info */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.noPay.heroTitle}
          </h2>
          <p className="text-xs font-normal text-slate-500 leading-relaxed">
            {t.noPay.heroSub}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category of Issue */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
              {t.noPay.categoryHeading}
            </label>

            <div className="space-y-2.5">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? "border-[#0B3C68] ring-2 ring-[#0B3C68]/10 shadow-sm"
                        : "border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cat.iconBg}`}
                    >
                      <IconComponent className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {cat.title}
                      </h3>
                      <p className="text-xs font-normal text-slate-400 mt-0.5">
                        {cat.sub}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Explanation */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
              {t.noPay.explanationHeading}
            </label>

            <textarea
              rows={4}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={t.noPay.explanationPlaceholder}
              className="w-full p-4 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] shadow-sm"
            />
          </div>

          {/* Supporting Documents */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
              {t.noPay.supportingHeading}
            </label>

            <div className="w-full bg-white rounded-2xl border-2 border-dashed border-slate-200/90 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                <Upload className="w-5 h-5 stroke-[1.8]" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {t.noPay.uploadTitle}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t.noPay.uploadSub}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSimulateFileSelect}
                className="px-5 py-2 rounded-full bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all touch-active shadow-sm"
              >
                {t.noPay.selectFiles}
              </button>

              {attachedFiles.length > 0 && (
                <div className="w-full pt-2 space-y-1">
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-between"
                    >
                      <span>{file}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Attached</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
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
                  <Send className="w-5 h-5 stroke-[2]" />
                  <span>{t.noPay.submitGrievance}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[11px] font-medium text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.noPay.reviewedNote}</span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
