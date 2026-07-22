"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Anchor } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/welcome");
    }, 2400);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex-1 flex flex-col justify-between items-center px-6 py-12 bg-[#FBF9F9] min-h-full">
      <div className="w-full flex-1 flex flex-col items-center justify-center -mt-8">
        {/* Animated Port Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="w-28 h-28 rounded-2xl bg-white border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center p-3 text-center">
            {/* Maritime / Port Emblem Badge */}
            <div className="w-14 h-14 rounded-full border-2 border-[#0F4C81] flex items-center justify-center p-1 mb-1">
              <div className="w-full h-full rounded-full border border-sky-400/40 flex items-center justify-center bg-slate-50">
                <Anchor className="w-7 h-7 text-[#0F4C81]" />
              </div>
            </div>
            <span className="text-[7px] font-bold tracking-widest text-[#0F4C81] uppercase leading-tight">
              GLOBAL PORT AUTHORITY
            </span>
            <span className="text-[5px] font-medium tracking-tighter text-slate-400 uppercase">
              INTERNATIONAL SHIPPING & LOGISTICS
            </span>
          </div>
        </motion.div>

        {/* Title Block */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-1.5"
        >
          <h1 className="text-xl font-bold text-[#0B3C68] tracking-tight">
            {t.splash.title}
          </h1>
          <p className="text-base font-semibold text-[#0060A8]">
            {t.splash.subtitle}
          </p>
        </motion.div>

        {/* Progress & Initializing Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 w-full max-w-[200px] flex flex-col items-center"
        >
          <div className="w-24 h-[1px] bg-slate-200 mb-4" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0060A8] animate-ping" />
            <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
              {t.splash.initializing}
            </p>
          </div>

          {/* Smooth progress bar */}
          <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-[#0060A8] to-sky-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Footer Gateway Info */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col items-center justify-center space-y-1 text-slate-400 text-xs"
      >
        <div className="flex items-center gap-1.5 font-medium text-slate-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>{t.splash.gateway}</span>
        </div>
        <p className="text-[11px] font-semibold text-slate-500 tracking-wide">
          {t.splash.version}
        </p>
      </motion.div>
    </div>
  );
}
