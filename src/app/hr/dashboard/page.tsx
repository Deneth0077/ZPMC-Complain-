"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Lock,
  ArrowLeft,
  RefreshCw,
  UserCheck,
  Building2,
  FileCheck2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface HRComplaint {
  id: string;
  complaintNo: string;
  employeeNo: string;
  employeeName: string;
  department: string;
  category: string;
  subType: string;
  description: string;
  preferredLanguage?: string;
  status: "PENDING" | "UNDER REVIEW" | "RESOLVED" | "REJECTED";
  openedBy?: {
    officerId: string;
    officerName: string;
    openedAt: string;
  };
  assignedOfficer?: {
    officerId: string;
    officerName: string;
  };
  comments?: Array<{
    sender: string;
    senderRole: string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsStats {
  total: number;
  pending: number;
  underReview: number;
  resolved: number;
  rejected: number;
  resolutionRate: number;
  avgResolutionHours: number;
  categories: {
    otIssues: number;
    hrisErrors: number;
    noPayIssues: number;
    otherIssues: number;
  };
  officers: Array<{
    name: string;
    handled: number;
    resolved: number;
  }>;
}

export default function HRDashboardPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [complaints, setComplaints] = useState<HRComplaint[]>([]);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedComplaint, setSelectedComplaint] = useState<HRComplaint | null>(null);
  const [commentInput, setCommentInput] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isManager = user?.role === "hr_manager" || user?.employeeNo === "HRM-001";
  const isOfficer = user?.role === "hr_officer" || (user?.employeeNo && user.employeeNo.startsWith("HR-"));

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("hip_hr_token") : null;
      const authHeaders = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Fetch Complaints
      const complaintsRes = await fetch("/api/complaints", { headers: authHeaders });
      const complaintsData = await complaintsRes.json();
      if (complaintsRes.ok && complaintsData.success) {
        setComplaints(complaintsData.complaints || []);
      }

      // Fetch Analytics if Manager or Officer
      const statsRes = await fetch("/api/hr/analytics", { headers: authHeaders });
      const statsData = await statsRes.json();
      if (statsRes.ok && statsData.success) {
        setStats(statsData.stats);
      }
    } catch (err) {
      console.error("Error loading HR dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleQuickRoleSwitch = async (roleType: "officer" | "manager") => {
    if (roleType === "manager") {
      await login("HRM-001", "1234", true);
    } else {
      await login("HR-001", "1234", true);
    }
  };

  const handleUpdateStatus = async (
    complaintId: string,
    newStatus: "UNDER REVIEW" | "RESOLVED" | "REJECTED",
    customComment?: string
  ) => {
    setUpdatingId(complaintId);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("hip_hr_token") : null;
      const res = await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: newStatus,
          commentMessage: customComment || `Status updated to ${newStatus} by ${user?.name || "HR Office"}`,
          assignOfficerName: user?.name || "HR Officer",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (selectedComplaint && selectedComplaint.id === complaintId) {
          setSelectedComplaint(data.complaint);
        }
        await loadDashboardData();
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !commentInput.trim()) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("hip_hr_token") : null;
      const res = await fetch(`/api/complaints/${selectedComplaint.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          commentMessage: commentInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCommentInput("");
        setSelectedComplaint(data.complaint);
        await loadDashboardData();
      }
    } catch (err) {
      console.error("Comment submit error:", err);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = filterStatus === "ALL" || c.status === filterStatus;
    const matchesQuery =
      c.complaintNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16">
      {/* Top HR Header */}
      <header className="bg-[#0B3C68] text-white px-5 py-4 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/home")}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-300" />
                <h1 className="text-base font-extrabold tracking-tight">
                  HR Portal & Complaint Management
                </h1>
              </div>
              <p className="text-[11px] text-sky-200">
                Hambantota International Port Group • HR Department
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Demo Role Selector Tabs */}
            <div className="bg-blue-950/60 p-1 rounded-xl flex items-center border border-white/10 text-xs">
              <button
                onClick={() => handleQuickRoleSwitch("officer")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  isOfficer && !isManager
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-sky-200 hover:text-white"
                }`}
              >
                HR Officer (HR-001)
              </button>
              <button
                onClick={() => handleQuickRoleSwitch("manager")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  isManager
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-sky-200 hover:text-white"
                }`}
              >
                HR Manager (HRM-001)
              </button>
            </div>

            <button
              onClick={loadDashboardData}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-5 pt-6 space-y-6 flex-1">
        {/* Role Badge Banner */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                isManager ? "bg-amber-500" : "bg-[#0B3C68]"
              }`}
            >
              {isManager ? (
                <ShieldAlert className="w-6 h-6 stroke-[2]" />
              ) : (
                <UserCheck className="w-6 h-6 stroke-[2]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Logged in as: {user?.name || (isManager ? "HR Manager (HRM-001)" : "HR Officer (HR-001)")}
                </h2>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    isManager ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
                  }`}
                >
                  {isManager ? "HR Manager Access" : "HR Officer Access"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isManager
                  ? "Full System Administrative Rights: Full Complaint Audit, Officer Assignments & Analytics enabled."
                  : "Officer Confidential Mode: Handle issues anonymously. Peer officer activities are masked for privacy."}
              </p>
            </div>
          </div>

          {/* Privacy Protocol Badge */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold shrink-0">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>HIPG Confidentiality Protocol Active</span>
          </div>
        </div>

        {/* HR Manager Analytics Section */}
        {isManager && stats && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#0B3C68]" />
                <span>HR Manager Executive Analytics</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">Real-time DB Telemetry</span>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Total Complaints</span>
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{stats.total}</div>
                <div className="text-[11px] text-slate-500">Across HR Department</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm space-y-1">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Pending Issues</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-extrabold text-amber-600">{stats.pending}</div>
                <div className="text-[11px] text-amber-700/80">Requires immediate review</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-sky-200 bg-sky-50/20 shadow-sm space-y-1">
                <div className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Under Investigation</span>
                  <AlertCircle className="w-4 h-4 text-sky-500" />
                </div>
                <div className="text-2xl font-extrabold text-sky-600">{stats.underReview}</div>
                <div className="text-[11px] text-sky-700/80">Active in process</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm space-y-1">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Resolved Issues</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-600">{stats.resolved}</div>
                <div className="text-[11px] text-emerald-700/80">
                  {stats.resolutionRate}% Success Rate
                </div>
              </div>
            </div>

            {/* Officer Activity Table for HR Manager */}
            {stats.officers && stats.officers.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#0B3C68]" />
                  HR Officers Workload & Resolution Tracking (Manager Confidential View)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="pb-2">HR Officer</th>
                        <th className="pb-2 text-center">Handled Cases</th>
                        <th className="pb-2 text-center">Resolved Cases</th>
                        <th className="pb-2 text-right">Performance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {stats.officers.map((officer, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 font-bold text-slate-900">{officer.name}</td>
                          <td className="py-2.5 text-center">{officer.handled}</td>
                          <td className="py-2.5 text-center text-emerald-600 font-bold">
                            {officer.resolved}
                          </td>
                          <td className="py-2.5 text-right">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                              Active Duty
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Complaints Listing & Management Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-slate-900">
              HR Complaints Processing Inbox ({filteredComplaints.length})
            </h2>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {["ALL", "PENDING", "UNDER REVIEW", "RESOLVED", "REJECTED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filterStatus === st
                      ? "bg-[#0B3C68] text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Complaint No, Employee Name, or Issue Subtype..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C68]"
            />
          </div>

          {/* Complaints Table/Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComplaints.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0B3C68] tracking-wide">
                      {item.complaintNo}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === "RESOLVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "UNDER REVIEW"
                          ? "bg-sky-100 text-[#0284C7]"
                          : item.status === "REJECTED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.subType}</h3>
                    <p className="text-[11px] font-semibold text-slate-400">
                      Category: {item.category} • Employee: {item.employeeName} ({item.employeeNo})
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{item.description}"
                  </p>

                  {/* Privacy / Officer Assignment Metadata */}
                  <div className="text-[11px] text-slate-400 space-y-1">
                    {isManager ? (
                      <div className="bg-amber-50 p-2 rounded-lg text-amber-900 border border-amber-200/60 font-medium text-[10px]">
                        <div>
                          <strong>Opened by:</strong>{" "}
                          {item.openedBy?.officerName || "Not opened yet"}
                        </div>
                        <div>
                          <strong>Assigned Officer:</strong>{" "}
                          {item.assignedOfficer?.officerName || "Unassigned"}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-400 italic text-[10px]">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        <span>Officer Privacy Shield Active (Handling Identity Masked)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedComplaint(item)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>View / Comment</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {item.status !== "RESOLVED" && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, "RESOLVED")}
                        disabled={updatingId === item.id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                      >
                        Resolve
                      </button>
                    )}
                    {item.status === "PENDING" && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, "UNDER REVIEW")}
                        disabled={updatingId === item.id}
                        className="px-3 py-1.5 bg-[#0B3C68] hover:bg-[#0F4C81] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modal / Drawer for Complaint Detail & Resolution Notes */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-extrabold text-[#0B3C68]">
                    {selectedComplaint.complaintNo}
                  </span>
                  <h2 className="text-base font-bold text-slate-900">
                    {selectedComplaint.subType}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                  <div className="font-bold text-slate-700">
                    Employee: {selectedComplaint.employeeName} ({selectedComplaint.employeeNo})
                  </div>
                  <div className="text-slate-500">Category: {selectedComplaint.category}</div>
                  <div className="text-slate-500">
                    Language: {selectedComplaint.preferredLanguage === "si" ? "සිංහල" : "English"}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Description
                  </label>
                  <p className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {selectedComplaint.description}
                  </p>
                </div>

                {/* Status Action Bar */}
                <div className="bg-slate-100 p-3 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Change Status:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedComplaint.id, "UNDER REVIEW")}
                      className="px-3 py-1 bg-sky-600 text-white rounded-lg text-xs font-bold"
                    >
                      Under Review
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedComplaint.id, "RESOLVED")}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedComplaint.id, "REJECTED")}
                      className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#0B3C68]" />
                    <span>Resolution Notes & Response History</span>
                  </h4>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedComplaint.comments && selectedComplaint.comments.length > 0 ? (
                      selectedComplaint.comments.map((cm, idx) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
                            <span>{cm.sender} ({cm.senderRole})</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1">{cm.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                    )}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Add an official HR response or resolution comment..."
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B3C68]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0B3C68] hover:bg-[#0F4C81] text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      Post Note
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
