"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Building2,
  Lock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Hash,
  Check,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const WORKING_SITES = [
  { id: "CICT", label: "CICT" },
  { id: "HIPG", label: "HIPG" },
  { id: "SAGT", label: "SAGT" },
  { id: "SWIT", label: "SWIT" },
  { id: "ECT", label: "ECT" },
  { id: "OVERSEAS", label: "OVERSEAS" },
  { id: "OTHER", label: "OTHER" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  // Form State
  const [employeeNo, setEmployeeNo] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [workingSite, setWorkingSite] = useState("HIPG");
  const [nic, setNic] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [agreed, setAgreed] = useState(false);

  // UI state
  const [errorMsg, setErrorMsg] = useState("");
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);

  // Enforce numbers-only for Employee Number
  const handleEmpNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ""); // strip non-numeric characters
    setEmployeeNo(val);
  };

  // Enforce numbers-only for Phone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d+]/g, "");
    setPhone(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!employeeNo.trim()) {
      setErrorMsg("Please enter your Employee Number (Numbers only)");
      return;
    }
    if (!name.trim()) {
      setErrorMsg("Please enter your Employee Name");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Please enter your Contact Mobile Number");
      return;
    }
    if (!workingSite) {
      setErrorMsg("Please select your Currently Working Site");
      return;
    }
    if (!pin.trim() || pin.length < 4) {
      setErrorMsg("Please enter a valid 4-digit PIN");
      return;
    }
    if (pin !== confirmPin) {
      setErrorMsg("PIN and Confirm PIN do not match");
      return;
    }
    if (!agreed) {
      setErrorMsg("You must agree to continue before registering");
      return;
    }

    const res = await register({
      employeeNo,
      name,
      phone,
      workingSite,
      nic,
      pin,
    });

    if (res.success) {
      router.push("/home");
    } else {
      setErrorMsg(res.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FBF9F9] px-4 py-6 min-h-full">
      {/* Top Branding Header */}
      <div className="flex flex-col items-center mt-1 mb-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-14 h-14 rounded-2xl overflow-hidden bg-[#0B3C68] shadow-md shadow-blue-950/20 mb-2"
        >
          <Image
            src="/zpmc-hr-icon.png"
            alt="ZPMC LANKA HR App Icon"
            width={56}
            height={56}
            priority
            className="w-full h-full object-cover rounded-2xl"
          />
        </motion.div>
        <h1 className="text-lg font-bold text-[#0B3C68] tracking-tight">
          Hambantota Port
        </h1>
        <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">
          HUMAN RESOURCES • PORTAL REGISTRATION
        </p>
      </div>

      {/* Main Form Card */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px] mx-auto bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_8px_30px_rgba(15,76,129,0.05)]"
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Staff Registration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create your HR portal account to submit complaints & track issues.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* 1. Employee Number Input (Numbers ONLY) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Employee Number <span className="text-red-500">*</span>
              <span className="text-[10px] font-normal text-slate-400 ml-1">
                (Numbers only)
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-4 h-4 stroke-[2]" />
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={employeeNo}
                onChange={handleEmpNoChange}
                placeholder="e.g. 12345"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* 2. Employee Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              NAME (Employee Name) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4 stroke-[2]" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chathura Perera"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* 3. Contact Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4 stroke-[2]" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="e.g. 0771234567"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* 4. Currently Working Site (Dropdown list) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Currently working Site <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSiteDropdownOpen(!isSiteDropdownOpen)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#0B3C68] transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 stroke-[2] absolute left-3.5 pointer-events-none" />
                  <span>{workingSite}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    isSiteDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Custom Animated Site Selector */}
              {isSiteDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl py-1 max-h-48 overflow-y-auto">
                  {WORKING_SITES.map((site) => (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => {
                        setWorkingSite(site.id);
                        setIsSiteDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors ${
                        workingSite === site.id
                          ? "bg-[#0B3C68]/10 text-[#0B3C68]"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{site.label}</span>
                      {workingSite === site.id && (
                        <Check className="w-4 h-4 text-[#0B3C68]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 5. NIC NUMBER */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              NIC NUMBER
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <CreditCard className="w-4 h-4 stroke-[2]" />
              </div>
              <input
                type="text"
                value={nic}
                onChange={(e) => setNic(e.target.value.toUpperCase())}
                placeholder="e.g. 199283746501 or 928374650V"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* 6. 4-Digit PIN */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                4-Digit PIN <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 stroke-[2]" />
                </div>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all tracking-widest text-center"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm PIN <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 stroke-[2]" />
                </div>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68] focus:bg-white transition-all tracking-widest text-center"
                  required
                />
              </div>
            </div>
          </div>

          {/* 7. Agreement Checkbox */}
          <div className="flex items-start pt-2">
            <div className="flex items-center h-5">
              <input
                id="agreed-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 text-[#0B3C68] border-slate-300 rounded focus:ring-[#0B3C68] cursor-pointer mt-0.5"
                required
              />
            </div>
            <label
              htmlFor="agreed-checkbox"
              className="ml-2 block text-xs font-medium text-slate-700 leading-tight select-none cursor-pointer"
            >
              I Agree to continue on this (Terms & HR Policy Guidelines)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !agreed}
            className="w-full h-11 mt-3 bg-[#0B3C68] hover:bg-[#0F4C81] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-900/15 transition-all touch-active disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="text-sm">Creating Account...</span>
            ) : (
              <>
                <span className="text-sm font-bold">Register Account</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </>
            )}
          </button>
        </form>

        <div className="w-full h-[1px] bg-slate-100 my-4" />

        {/* Back to Login */}
        <div className="text-center text-xs text-slate-600 font-medium">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-bold text-[#0060A8] hover:underline"
          >
            Login Here
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Hambantota International Port Group • HR System</span>
        </div>
      </div>
    </div>
  );
}
