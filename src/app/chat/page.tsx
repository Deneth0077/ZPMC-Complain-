"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Info,
  Plus,
  Paperclip,
  Send,
  Download,
  FileText,
  CheckCheck,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function ChatPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [messages, setMessages] = useState([
    {
      id: "m-1",
      sender: "hr",
      senderName: "HR Support",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      text: "Hello! I'm reviewing your grievance regarding the overtime calculation (Ref: #HP-4421). I have your attendance logs open. Could you clarify the specific dates that seem incorrect?",
      time: "10:45 AM",
    },
    {
      id: "m-2",
      sender: "user",
      text: "Thanks for looking into this. It's mainly for the week of Oct 12th-16th. I worked late shifts during the vessel docking, but they show as standard 8-hour blocks.",
      time: "10:48 AM",
    },
    {
      id: "m-3",
      sender: "hr",
      senderName: "HR Support",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      text: "Understood. I see the logs here. Let me cross-reference this with the Terminal Operating System log. I'm attaching the current summary I have.",
      attachment: {
        title: "Attendance_Summary...",
        size: "1.2 MB • PDF Document",
      },
      time: "10:52 AM",
    },
  ]);

  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMsg = {
      id: `m-${Date.now()}`,
      sender: "user",
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const textSent = inputMsg;
    setInputMsg("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `m-reply-${Date.now()}`,
          sender: "hr",
          senderName: "HR Support",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
          text: `Thank you. I have added "${textSent}" to your official HR complaint case file.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F9] min-h-full pb-20 relative">
      {/* Top Header Bar */}
      <header className="px-4 py-3 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 rounded-full text-slate-700 hover:bg-slate-100 transition-colors touch-active"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#0B3C68] tracking-tight leading-tight">
              {t.chatPage.headerTitle}
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.chatPage.statusOnline}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Grievance Case Info: Ref #HP-4421")}
            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100"
          >
            <Info className="w-5 h-5" />
          </button>

          {/* User Initials Avatar Badge */}
          <div className="w-9 h-9 rounded-full bg-[#0B3C68] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            JD
          </div>
        </div>
      </header>

      {/* Date Divider */}
      <div className="px-5 py-4 flex items-center justify-center gap-4">
        <div className="flex-1 h-[1px] bg-slate-200" />
        <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
          {t.chatPage.today}
        </span>
        <div className="flex-1 h-[1px] bg-slate-200" />
      </div>

      {/* Messages Scroll Body */}
      <main className="flex-1 px-4 space-y-4 overflow-y-auto pb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            {msg.sender === "hr" ? (
              <div className="flex items-start gap-2.5 max-w-[85%]">
                <div className="w-7 h-7 rounded-full overflow-hidden relative shrink-0 mt-1 border border-slate-200">
                  <Image
                    src={msg.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"}
                    alt="HR Officer"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#0B3C68] block">
                    {msg.senderName}
                  </span>

                  <div className="bg-white rounded-2xl rounded-tl-none p-3.5 border border-slate-200/90 shadow-sm text-xs font-medium text-slate-800 leading-relaxed space-y-2.5">
                    <p>{msg.text}</p>

                    {/* PDF Attachment Card */}
                    {msg.attachment && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2 mt-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 stroke-[2]" />
                          </div>
                          <div className="truncate text-left">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {msg.attachment.title}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {msg.attachment.size}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => alert("Downloading Attendance_Summary.pdf...")}
                          className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium block">
                    {msg.time}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-end space-y-1 ml-auto max-w-[85%]">
                <div className="bg-[#0B3C68] text-white rounded-2xl rounded-tr-none p-3.5 shadow-sm text-xs font-medium leading-relaxed">
                  {msg.text}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <span>{msg.time}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-sky-600 stroke-[2.2]" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium italic pt-1 pl-9">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            <span className="ml-1 text-[11px] font-semibold text-slate-400">{t.chatPage.hrTyping}</span>
          </div>
        )}
      </main>

      {/* Bottom Chat Input Bar */}
      <form
        onSubmit={handleSend}
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-slate-100 p-3 flex items-center gap-2 z-40"
      >
        <button
          type="button"
          onClick={() => alert("Attach options: Photo, Document, Audio")}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 touch-active"
        >
          <Plus className="w-6 h-6 stroke-[2]" />
        </button>

        <div className="flex-1 bg-slate-100/90 rounded-full px-4 py-2.5 flex items-center justify-between border border-slate-200/60">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={t.chatPage.typeMessage}
            className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none placeholder-slate-400"
          />
          <button
            type="button"
            onClick={() => alert("Attaching document...")}
            className="text-slate-400 hover:text-slate-600 ml-1"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-[#0B3C68] hover:bg-[#0F4C81] text-white flex items-center justify-center shadow-md touch-active shrink-0"
        >
          <Send className="w-4 h-4 stroke-[2]" />
        </button>
      </form>
    </div>
  );
}
