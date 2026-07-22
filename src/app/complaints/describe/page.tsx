"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mic,
  Camera,
  FileText,
  X,
  Info,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function DescribeIssuePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const [description, setDescription] = useState("");
  const [voiceNotes, setVoiceNotes] = useState<string[]>(["VoiceNote_01.mp3"]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleRecordAudio = () => {
    const nextNum = voiceNotes.length + 1;
    setVoiceNotes((prev) => [...prev, `VoiceNote_0${nextNum}.mp3`]);
  };

  const handleUploadImages = () => {
    const nextNum = images.length + 1;
    setImages((prev) => [...prev, `Evidence_Photo_0${nextNum}.jpg`]);
  };

  const handleRemoveVoice = (name: string) => {
    setVoiceNotes((prev) => prev.filter((v) => v !== name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.length < 5) {
      alert("Please provide a detailed issue description.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedCode(`COMP-ETHICS-${Math.floor(1000 + Math.random() * 9000)}`);
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
          Grievance Registered!
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1 mb-6">
          Your complaint is protected under the HIPG HR Ethics Confidentiality Protocol.
        </p>

        <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 mb-8">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Confidential Case Reference
          </div>
          <div className="text-xl font-extrabold text-[#0B3C68] tracking-wider">
            {submittedCode}
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
    <div className="flex-1 flex flex-col bg-[#FBF9F9] min-h-full pb-8">
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
            {t.describeIssue.headerTitle}
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
      <main className="flex-1 px-5 pt-5 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preferred Language Preference Box */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="max-w-[60%]">
              <span className="text-xs font-bold text-slate-900 leading-tight block">
                {t.describeIssue.prefLangLabel}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === "en"
                    ? "bg-[#0B3C68] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("si")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === "si"
                    ? "bg-[#0B3C68] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                සිංහල
              </button>
            </div>
          </div>

          {/* Issue Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B3C68] uppercase tracking-wider block">
              {t.describeIssue.issueDescLabel}
            </label>

            <div className="relative">
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.describeIssue.descPlaceholder}
                className="w-full p-4 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] shadow-sm leading-relaxed"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium text-right block">
              {t.describeIssue.minCharsNote}
            </span>
          </div>

          {/* Supporting Evidence */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              {t.describeIssue.evidenceHeading}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Record Audio */}
              <div
                onClick={handleRecordAudio}
                className="bg-white rounded-2xl p-5 border-2 border-dashed border-slate-200/90 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0B3C68] transition-all touch-active"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 text-[#0B3C68] flex items-center justify-center mb-2">
                  <Mic className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="text-xs font-bold text-slate-800">
                  {t.describeIssue.recordAudio}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {t.describeIssue.audioSub}
                </p>
              </div>

              {/* Upload Images */}
              <div
                onClick={handleUploadImages}
                className="bg-white rounded-2xl p-5 border-2 border-dashed border-slate-200/90 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0B3C68] transition-all touch-active"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 text-[#0B3C68] flex items-center justify-center mb-2">
                  <Camera className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="text-xs font-bold text-slate-800">
                  {t.describeIssue.uploadImages}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {t.describeIssue.uploadSub}
                </p>
              </div>
            </div>

            {/* Attached Chips */}
            {(voiceNotes.length > 0 || images.length > 0) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {voiceNotes.map((v) => (
                  <div
                    key={v}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-200/80 rounded-full text-xs font-semibold text-slate-800 border border-slate-300/60"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>{v}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVoice(v)}
                      className="p-0.5 rounded-full hover:bg-slate-300 text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EBF5FF] rounded-full text-xs font-semibold text-[#0060A8] border border-sky-200"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#0060A8]" />
                    <span>{img}</span>
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-0.5 rounded-full hover:bg-sky-200 text-[#0060A8]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confidentiality Guarantee Info Card */}
          <div className="bg-[#E0F2FE] rounded-2xl p-4 border border-sky-200 flex items-start gap-3 text-sky-900">
            <Info className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5 stroke-[2]" />
            <div className="text-xs space-y-1">
              <h3 className="font-bold text-[#0369A1]">
                {t.describeIssue.confidentialTitle}
              </h3>
              <p className="font-normal text-sky-900/80 leading-relaxed text-[11px]">
                {t.describeIssue.confidentialBody}
              </p>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-13 py-3.5 bg-[#0B3C68] hover:bg-[#0F4C81] text-white font-semibold text-base rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-950/20 transition-all touch-active"
            >
              {isSubmitting ? (
                <span className="text-sm">Submitting...</span>
              ) : (
                <>
                  <span>{t.describeIssue.submitComplaint}</span>
                  <Send className="w-5 h-5 stroke-[2]" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
