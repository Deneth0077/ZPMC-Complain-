"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BottomNav } from "./BottomNav";

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <div className="mobile-app-shell no-scrollbar bg-[#FBF9F9]">
            <main className="flex-1 flex flex-col w-full relative overflow-y-auto no-scrollbar">
              {children}
            </main>
            <BottomNav />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};
