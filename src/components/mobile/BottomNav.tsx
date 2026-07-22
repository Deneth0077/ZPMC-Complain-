"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Bell, User } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLanguage } from "@/contexts/LanguageContext";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const { t } = useLanguage();

  // Hide navigation on splash, welcome, and login pages
  const hideOn = ["/splash", "/welcome", "/login"];
  if (hideOn.includes(pathname)) {
    return null;
  }

  const navItems = [
    {
      label: t.nav.home,
      href: "/home",
      icon: Home,
      isActive: pathname === "/home" || pathname === "/",
    },
    {
      label: t.nav.myComplaints,
      href: "/complaints",
      icon: ClipboardList,
      isActive: pathname === "/complaints",
    },
    {
      label: t.nav.alerts,
      href: "/alerts",
      icon: Bell,
      isActive: pathname === "/alerts",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      label: t.nav.profile,
      href: "/profile",
      icon: User,
      isActive: pathname === "/profile",
    },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 w-full bg-white border-t border-slate-100 px-3 py-2 flex items-center justify-around z-50 rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center min-w-[70px] touch-active group"
          >
            <div
              className={`relative flex items-center justify-center px-5 py-1.5 rounded-full transition-all duration-200 ${
                item.isActive
                  ? "bg-[#0B3C68] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <IconComponent className="w-5 h-5 stroke-[1.8]" />
              {item.badge && !item.isActive && (
                <span className="absolute top-1 right-3 w-2 h-2 bg-sky-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </div>
            <span
              className={`text-[11px] font-medium mt-1 tracking-tight ${
                item.isActive ? "text-[#0B3C68] font-semibold" : "text-slate-600"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
