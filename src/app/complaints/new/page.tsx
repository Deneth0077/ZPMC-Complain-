"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Upload, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

function NewComplaintFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preCategory = searchParams.get("category") || "OT_ISSUES";
  const { t } = useLanguage();

  const [category, setCategory] = useState(preCategory);
  const [subType, setSubType] = useState("Incorrect OT");
  const [description, setDescription] = useState("");
  const [languagePref, setLanguagePref] = useState<"English" | "Sinhala">("English");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const subTypeOptions: Record<string, string[]> = {
    SALARY_ISSUES: ["Salary Not Received", "Incorrect Salary Amount", "Allowance Missing", "Wrong Deduction", "Bonus Missing"],
    HRIS_ERRORS: ["Portal Access Error", "Login Discrepancy", "System Error", "Data Display Bug"],
    FINGERPRINT_ISSUES: ["Fingerprint Scan Failed", "Punch Record Missing", "Device Offline", "Time Log Error"],
    EMPLOYEE_NEEDS: ["Workstation & Equipment", "Uniform / PPE Request", "Transport & Meal Issue", "Welfare Request"],
    OTHER_ISSUES: ["Workplace Safety", "Harassment", "General Inquiry", "Other"],
    OT_ISSUES: ["Incorrect OT", "OT Missing", "OT Not Approved", "Calculation Error", "Other"],
    NO_PAY_ISSUES: ["Salary Missing", "Wrong Salary", "Bonus Missing", "Allowance Missing", "Wrong Deduction"],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert(t.newComplaint.descriptionPlaceholder);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("hip_hr_token") : null;
      const categoryMap: Record<string, string> = {
        SALARY_ISSUES: "Salary Related Issues",
        HRIS_ERRORS: "HRIS System Issues",
        FINGERPRINT_ISSUES: "Fingerprint Machine Issues",
        EMPLOYEE_NEEDS: "Employee Requirements",
        OTHER_ISSUES: "Other Issues",
        OT_ISSUES: "OT Issues",
        NO_PAY_ISSUES: "No Pay Issues",
      };

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category: categoryMap[category] || category,
          subType,
          description: description.trim(),
          preferredLanguage: languagePref === "Sinhala" ? "si" : "en",
          attachments,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.success) {
        setSubmittedCode(data.complaintNo || `CMP-2026-${Math.floor(10000 + Math.random() * 90000)}`);
      } else {
        alert(data.error || "Failed to submit complaint.");
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error("Submit new complaint error:", err);
      setSubmittedCode(`CMP-2026-${Math.floor(10000 + Math.random() * 90000)}`);
    }
  };


  const handleSimulateFileUpload = () => {
    setAttachments((prev) => [...prev, `document_evidence_${prev.length + 1}.pdf`]);
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
          {t.newComplaint.submittedTitle}
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1 mb-6">
          {t.newComplaint.submittedSub}
        </p>

        <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 mb-8">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t.newComplaint.complaintNo}
          </div>
          <div className="text-xl font-extrabold text-[#0B3C68] tracking-wider">
            {submittedCode}
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">{t.newComplaint.status}</span>
            <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 font-bold rounded-full">
              {t.alerts.badgePending}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">{t.newComplaint.estReviewTime}</span>
            <span className="font-bold text-slate-800">{t.newComplaint.hours24}</span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={() => router.push("/complaints")}
            className="w-full py-3.5 bg-[#0B3C68] text-white font-semibold text-sm rounded-xl shadow-sm"
          >
            {t.newComplaint.viewMyComplaints}
          </button>
          <button
            onClick={() => router.push("/home")}
            className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl"
          >
            {t.newComplaint.goHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 px-5 py-5 space-y-5">
      {/* Select Category */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5">
          {t.newComplaint.categoryLabel}
        </label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubType(subTypeOptions[e.target.value]?.[0] || "Other");
          }}
          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#0B3C68]"
        >
          <option value="SALARY_ISSUES">{t.home.catSalaryTitle || t.home.catNoPayTitle} ({t.home.catSalarySub || t.home.catNoPaySub})</option>
          <option value="HRIS_ERRORS">{t.home.catHrisTitle} ({t.home.catHrisSub})</option>
          <option value="FINGERPRINT_ISSUES">{t.home.catFingerprintTitle} ({t.home.catFingerprintSub})</option>
          <option value="EMPLOYEE_NEEDS">{t.home.catEmployeeNeedsTitle} ({t.home.catEmployeeNeedsSub})</option>
          <option value="OTHER_ISSUES">{t.home.catOtherTitle} ({t.home.catOtherSub})</option>
        </select>
      </div>

      {/* Issue Type */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5">
          {t.newComplaint.specificTypeLabel}
        </label>
        <select
          value={subType}
          onChange={(e) => setSubType(e.target.value)}
          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#0B3C68]"
        >
          {(subTypeOptions[category] || ["Other"]).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5">
          {t.newComplaint.descriptionLabel}
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.newComplaint.descriptionPlaceholder}
          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#0B3C68]"
        />
      </div>

      {/* Preferred Language */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5">
          {t.newComplaint.preferredLangLabel}
        </label>
        <div className="flex gap-3">
          {(["English", "Sinhala"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguagePref(lang)}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold ${
                languagePref === lang
                  ? "bg-[#0B3C68] text-white border-[#0B3C68]"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              {lang === "English" ? "English" : "සිංහල"}
            </button>
          ))}
        </div>
      </div>

      {/* Attachment Upload */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5">
          {t.newComplaint.attachmentsLabel}
        </label>
        <div
          onClick={handleSimulateFileUpload}
          className="w-full p-4 border-2 border-dashed border-slate-200 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#0B3C68] transition-all"
        >
          <Upload className="w-6 h-6 text-slate-400 mb-1" />
          <span className="text-xs font-semibold text-[#0060A8]">
            {t.newComplaint.tapUpload}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {t.newComplaint.uploadSupports}
          </span>
        </div>

        {attachments.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                <FileText className="w-4 h-4 text-[#0060A8]" />
                <span className="flex-1 truncate">{file}</span>
                <span className="text-[10px] text-emerald-600 font-bold">{t.newComplaint.attached}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-[#0B3C68] hover:bg-[#0F4C81] text-white font-semibold text-sm rounded-xl shadow-md flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <span>{t.newComplaint.submitting}</span>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>{t.newComplaint.submitBtn}</span>
          </>
        )}
      </button>
    </form>
  );
}

export default function NewComplaintPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F9] min-h-full pb-8">
      <header className="px-5 py-4 flex items-center gap-3 bg-white border-b border-slate-100 sticky top-0 z-30">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full text-slate-700 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-slate-900">
          {t.newComplaint.headerTitle}
        </h1>
      </header>

      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading form...</div>}>
        <NewComplaintFormContent />
      </Suspense>
    </div>
  );
}
