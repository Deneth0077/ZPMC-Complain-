"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Anchor,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Hash,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function ForgotPinPage() {
  const router = useRouter();
  const { forgotPinVerify, forgotPinReset, isLoading } = useAuth();

  // Form State
  const [step, setStep] = useState<"verify" | "reset" | "success">("verify");
  const [employeeNo, setEmployeeNo] = useState("");
  const [phone, setPhone] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");

  const [verifiedName, setVerifiedName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleEmpNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeNo(e.target.value.replace(/\D/g, ""));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value.replace(/[^\d+]/g, ""));
  };

  // Step 1: Verify Mobile Number
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!employeeNo.trim()) {
      setErrorMsg("Please enter your Employee Number (Numbers only)");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Please enter your Contact Mobile Number");
      return;
    }

    const res = await forgotPinVerify(employeeNo, phone);
    if (res.success) {
      setVerifiedName(res.employeeName || "");
      setStep("reset");
    } else {
      setErrorMsg(
        res.error ||
          "Entered Mobile Number does NOT match the contact number registered for this Employee."
      );
    }
  };

  // Step 2: Reset PIN
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newPin.trim() || newPin.length < 4) {
      setErrorMsg("Please enter a valid 4-digit PIN");
      return;
    }
    if (newPin !== confirmNewPin) {
      setErrorMsg("New PIN and Confirm PIN do not match");
      return;
    }

    const res = await forgotPinReset(employeeNo, phone, newPin);
    if (res.success) {
      setSuccessMsg("Your 4-Digit PIN has been updated successfully!");
      setStep("success");
    } else {
      setErrorMsg(res.error || "Failed to update PIN. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FBF9F9] px-4 py-8 min-h-full">
      {/* Top Header */}
      <div className="flex flex-col items-center mt-2 mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-14 h-14 rounded-2xl bg-[#0B3C68] flex items-center justify-center text-white shadow-md shadow-blue-950/20 mb-3"
        >
          <Anchor className="w-8 h-8 text-white stroke-[2]" />
        </motion.div>
        <h1 className="text-xl font-bold text-[#0B3C68] tracking-tight">
          Hambantota Port
        </h1>
        <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
          HUMAN RESOURCES • PIN RECOVERY
        </p>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[400px] mx-auto bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(15,76,129,0.05)]"
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === "verify"
                  ? "bg-[#0B3C68] text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {step === "verify" ? "1" : "✓"}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              Verify Number
            </span>
          </div>
          <div className="w-8 h-[2px] bg-slate-200" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === "reset"
                  ? "bg-[#0B3C68] text-white"
                  : step === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              2
            </span>
            <span
              className={`text-xs font-semibold ${
                step === "reset" || step === "success"
                  ? "text-slate-700"
                  : "text-slate-400"
              }`}
            >
              Change PIN
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: VERIFY MOBILE NUMBER */}
        {step === "verify" && (
          <div>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Forgot PIN / Password?
              </h2>
              <p className="text-xs font-normal text-slate-500 mt-1">
                Enter your Employee Number and Contact Mobile Number to verify your identity.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Employee Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={employeeNo}
                    onChange={handleEmpNoChange}
                    placeholder="e.g. 1234"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registered Contact Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="e.g. 0771234567"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-2 bg-[#0B3C68] hover:bg-[#0F4C81] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-900/15 transition-all cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="text-sm">Verifying Mobile Number...</span>
                ) : (
                  <>
                    <span className="text-sm font-bold">Verify & Proceed</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.2]" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: RESET PIN */}
        {step === "reset" && (
          <div>
            <div className="mb-4">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl mb-3 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Verified Employee: <strong>{verifiedName || "Port Employee"}</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Create New 4-Digit PIN
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set a new 4-digit PIN for logging into your HR portal account.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  New 4-Digit PIN <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all tracking-widest"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm New 4-Digit PIN <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmNewPin}
                    onChange={(e) =>
                      setConfirmNewPin(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all tracking-widest"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-2 bg-[#0B3C68] hover:bg-[#0F4C81] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-900/15 transition-all cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="text-sm">Updating PIN...</span>
                ) : (
                  <>
                    <span className="text-sm font-bold">Update PIN Now</span>
                    <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === "success" && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">PIN Changed Successfully!</h2>
              <p className="text-xs text-slate-500 mt-1">
                {successMsg || "Your account PIN has been updated in the database."}
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full h-12 bg-[#0B3C68] hover:bg-[#0F4C81] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>Back to Employee Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="w-full h-[1px] bg-slate-100 my-5" />

        {/* Back to Login link */}
        <div className="text-center text-xs text-slate-600 font-medium">
          Remember your PIN?{" "}
          <Link href="/login" className="font-bold text-[#0060A8] hover:underline">
            Login Here
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Hambantota International Port Group • HR PIN Recovery</span>
        </div>
      </div>
    </div>
  );
}
