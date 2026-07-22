"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Anchor, Contact, Lock, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { t, toggleLanguage } = useLanguage();

  const [employeeNo, setEmployeeNo] = useState("HMPT-1234");
  const [pin, setPin] = useState("1234");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!employeeNo.trim()) {
      setErrorMsg("Please enter your Employee Number");
      return;
    }
    if (!pin.trim() || pin.length < 4) {
      setErrorMsg("Please enter a valid 4-digit PIN");
      return;
    }

    try {
      const success = await login(employeeNo, pin, rememberMe);
      if (success) {
        router.push("/home");
      }
    } catch {
      setErrorMsg("Invalid credentials. Please check your Employee No & PIN.");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FBF9F9] px-5 py-8 min-h-full">
      {/* Top Branding Section */}
      <div className="flex flex-col items-center mt-2 mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-14 h-14 rounded-2xl bg-[#0B3C68] flex items-center justify-center text-white shadow-md shadow-blue-950/20 mb-3"
        >
          <Anchor className="w-8 h-8 text-white stroke-[2]" />
        </motion.div>
        <h1 className="text-xl font-bold text-[#0B3C68] tracking-tight">
          {t.login.headerTitle}
        </h1>
        <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
          {t.login.headerSub}
        </p>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[400px] mx-auto bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(15,76,129,0.05)]"
      >
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.login.cardTitle}
          </h2>
          <p className="text-xs font-normal text-slate-500 mt-1">
            {t.login.cardSub}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Number Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.login.employeeNoLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Contact className="w-5 h-5 stroke-[1.8]" />
              </div>
              <input
                type="text"
                value={employeeNo}
                onChange={(e) => setEmployeeNo(e.target.value)}
                placeholder={t.login.employeeNoPlaceholder}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* 4-Digit PIN Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                {t.login.pinLabel}
              </label>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Forgot PIN service: Contact HR Desk at ext 4400 or visit HR Office.");
                }}
                className="text-xs font-semibold text-[#0060A8] hover:underline"
              >
                {t.login.forgotPin}
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5 stroke-[1.8]" />
              </div>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all tracking-widest"
              />
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center pt-1">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-[#0B3C68] border-slate-300 rounded focus:ring-[#0B3C68]"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-xs font-medium text-slate-600 select-none cursor-pointer"
            >
              {t.login.rememberMe}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 bg-[#0B3C68] hover:bg-[#0F4C81] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-900/15 transition-all touch-active disabled:opacity-70"
          >
            {isLoading ? (
              <span className="text-sm">{t.login.authenticating}</span>
            ) : (
              <>
                <span className="text-base">{t.login.loginBtn}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.2]" />
              </>
            )}
          </button>
        </form>

        <div className="w-full h-[1px] bg-slate-100 my-5" />

        {/* Register link callout */}
        <div className="text-center text-xs text-slate-600 font-medium">
          {t.login.newStaff}{" "}
          <button
            onClick={() => alert("Registration system checking port database for Employee No.")}
            className="font-bold text-[#0060A8] hover:underline"
          >
            {t.login.registerNow}
          </button>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="mt-6 text-center space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>{t.login.secureSsl}</span>
        </div>

        <div className="flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
          <button onClick={() => alert("HIP HR Support: Call +94 47 222 8800")} className="hover:underline">
            {t.login.support}
          </button>
          <span>•</span>
          <button onClick={() => alert("Privacy Policy: Enterprise Data Governance")} className="hover:underline">
            {t.login.privacyPolicy}
          </button>
          <span>•</span>
          {/* Interactive Language Selector */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 font-bold text-[#0060A8] hover:underline"
          >
            <Globe className="w-3.5 h-3.5 text-[#0060A8]" />
            <span>{t.login.languageLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
