import React, { useState } from "react";
import {
  Home, Users, CreditCard, Wallet, Layers, ShieldCheck, BarChart2,
  Repeat, Shield, Bell, Settings, UserCog, FileText, Search,
  ChevronDown, Calendar, DollarSign, AlertTriangle, RefreshCw,
  Landmark, Smartphone, Check, Clock, X, ChevronRight, LogOut, User,
  Plus, Trash2, Ban, Pencil, Save, Download, UserPlus, Monitor,
  CheckCircle2, XCircle, Globe,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Line, BarChart, Bar,
} from "recharts";

// ================================================================
// Mock data (swap for real API data later)
// ================================================================

const chartDataByRange = {
  "This Week": [
    { label: "Mon", volume: 17000000 },
    { label: "Tue", volume: 27000000 },
    { label: "Wed", volume: 39000000 },
    { label: "Thu", volume: 45000000 },
    { label: "Fri", volume: 31000000 },
    { label: "Sat", volume: 18000000 },
    { label: "Sun", volume: 25000000 },
  ],
  "This Month": [
    { label: "Wk 1", volume: 142000000 },
    { label: "Wk 2", volume: 168000000 },
    { label: "Wk 3", volume: 121000000 },
    { label: "Wk 4", volume: 189000000 },
  ],
  "This Year": [
    { label: "Jan", volume: 410000000 },
    { label: "Feb", volume: 388000000 },
    { label: "Mar", volume: 452000000 },
    { label: "Apr", volume: 476000000 },
    { label: "May", volume: 501000000 },
    { label: "Jun", volume: 468000000 },
    { label: "Jul", volume: 512000000 },
    { label: "Aug", volume: 495000000 },
    { label: "Sep", volume: 534000000 },
    { label: "Oct", volume: 0 },
    { label: "Nov", volume: 0 },
    { label: "Dec", volume: 0 },
  ],
};

const chartMaxByRange = {
  "This Week": 50000000,
  "This Month": 200000000,
  "This Year": 600000000,
};

const navItems = [
  { label: "Overview", icon: Home },
  { label: "Users", icon: Users },
  { label: "Payments", icon: CreditCard },
  { label: "Wallets", icon: Wallet },
  { label: "Cards", icon: Layers },
  { label: "KYC", icon: ShieldCheck },
  { label: "Analytics", icon: BarChart2 },
  { label: "Exchange", icon: Repeat },
  { label: "Security", icon: Shield },
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings },
  { label: "Admin Roles", icon: UserCog },
  { label: "Logs", icon: FileText },
];

const languages = [
  { code: "EN", label: "English" },
  { code: "FR", label: "Français" },
  { code: "ZH", label: "中文" },
];

const statCards = [
  {
    title: "Total Balance", value: "\u20a348.2M", sub: "\u2248 \u00a5512,300.00",
    subColor: "text-slate-400", icon: Wallet, iconBg: "bg-violet-600",
  },
  {
    title: "Total Users", value: "8,492", sub: "\u2191 12.5% this week",
    subColor: "text-emerald-500", icon: Users, iconBg: "bg-blue-500",
  },
  {
    title: "Total Transactions", value: "1,284", sub: "\u2191 8.3% this week",
    subColor: "text-emerald-500", icon: Repeat, iconBg: "bg-emerald-500",
  },
  {
    title: "Today's Volume", value: "\u20a33.28M", sub: "\u2191 18.7% vs yesterday",
    subColor: "text-emerald-500", icon: DollarSign, iconBg: "bg-orange-500",
  },
  {
    title: "Failed Transactions", value: "24", sub: "\u2193 4.2% vs yesterday",
    subColor: "text-rose-500", icon: AlertTriangle, iconBg: "bg-pink-500",
  },
];

const methodBadge = {
  MTN: { bg: "bg-amber-100", fg: "text-amber-600", label: "MTN" },
  Orange: { bg: "bg-orange-100", fg: "text-orange-600", label: "Orange" },
  Alipay: { bg: "bg-blue-100", fg: "text-blue-600", label: "Alipay" },
  WeChat: { bg: "bg-green-100", fg: "text-green-600", label: "WeChat" },
  Bank: { bg: "bg-indigo-100", fg: "text-indigo-600", label: "Bank" },
  Card: { bg: "bg-slate-200", fg: "text-slate-600", label: "Card" },
};

const liveTransactions = [
  { name: "Amina T.", method: "MTN", amount: "+50,000 FCFA", positive: true, time: "02:44 AM", avatar: "bg-slate-700" },
  { name: "David K.", method: "Orange", amount: "+25,000 FCFA", positive: true, time: "02:43 AM", avatar: "bg-rose-400" },
  { name: "Wei L.", method: "Alipay", amount: "-120 \u00a5", positive: false, time: "02:42 AM", avatar: "bg-blue-400" },
  { name: "John D.", method: "Orange", amount: "+20,000 FCFA", positive: true, time: "02:41 AM", avatar: "bg-orange-400" },
  { name: "Zhang R.", method: "WeChat", amount: "-300 \u00a5", positive: false, time: "02:40 AM", avatar: "bg-lime-400" },
];

const kycApps = [
  { label: "Pending", value: 24, color: "text-orange-500", icon: Clock, iconBg: "bg-orange-100" },
  { label: "Under Review", value: 18, color: "text-blue-500", icon: RefreshCw, iconBg: "bg-blue-100" },
  { label: "Verified", value: "1,248", color: "text-emerald-500", icon: Check, iconBg: "bg-emerald-100" },
  { label: "Rejected", value: 12, color: "text-rose-500", icon: X, iconBg: "bg-rose-100" },
];

const systemStatus = [
  { label: "MTN Service", icon: Smartphone, iconBg: "bg-amber-100", iconFg: "text-amber-600" },
  { label: "Orange Service", icon: Smartphone, iconBg: "bg-orange-100", iconFg: "text-orange-600" },
  { label: "Alipay Service", icon: Smartphone, iconBg: "bg-blue-100", iconFg: "text-blue-600" },
  { label: "WeChat Service", icon: Smartphone, iconBg: "bg-green-100", iconFg: "text-green-600" },
];

const paymentsOverview = [
  { method: "MTN Mobile Money", success: "98.5%", amount: "\u20a31.25M", badge: "MTN", trendUp: true },
  { method: "Orange Money", success: "97.8%", amount: "\u20a3842K", badge: "Orange", trendUp: true },
  { method: "Alipay", success: "99.2%", amount: "\u00a5210,300", badge: "Alipay", trendUp: true },
  { method: "WeChat Pay", success: "98.9%", amount: "\u00a5185,220", badge: "WeChat", trendUp: true },
  { method: "Bank Transfer", success: "96.3%", amount: "\u20a3392K", badge: "Bank", trendUp: false },
  { method: "Card Payments", success: "97.1%", amount: "\u20a3512K", badge: "Card", trendUp: true },
];

const exchangeRates = [
  { channel: "Alipay", rate: "91.40 FCFA", updated: "02:40 AM", icon: Smartphone, iconBg: "bg-blue-100", iconFg: "text-blue-600" },
  { channel: "WeChat", rate: "91.30 FCFA", updated: "02:40 AM", icon: Smartphone, iconBg: "bg-green-100", iconFg: "text-green-600" },
  { channel: "Cash RMB", rate: "90.80 FCFA", updated: "02:40 AM", icon: DollarSign, iconBg: "bg-emerald-100", iconFg: "text-emerald-600" },
  { channel: "Bank Transfer", rate: "91.60 FCFA", updated: "02:40 AM", icon: Landmark, iconBg: "bg-indigo-100", iconFg: "text-indigo-600" },
];

const recentTransactions = [
  { user: "Amina T.", method: "MTN", amount: "+50,000 FCFA", type: "Top-up", status: "Success", time: "02:44 AM" },
  { user: "Wei L.", method: "Alipay", amount: "-120 \u00a5", type: "Payment", status: "Success", time: "02:42 AM" },
  { user: "John D.", method: "Orange", amount: "+20,000 FCFA", type: "Top-up", status: "Pending", time: "02:41 AM" },
  { user: "David K.", method: "Orange", amount: "+25,000 FCFA", type: "Top-up", status: "Success", time: "02:43 AM" },
];

const securityAlerts = [
  { text: "Suspicious login attempt", time: "2 min ago", icon: AlertTriangle, iconBg: "bg-rose-100", iconFg: "text-rose-500" },
  { text: "Unusual transaction detected", time: "5 min ago", icon: AlertTriangle, iconBg: "bg-orange-100", iconFg: "text-orange-500" },
  { text: "New device login", time: "12 min ago", icon: Shield, iconBg: "bg-blue-100", iconFg: "text-blue-500" },
  { text: "KYC verified for user Zhang R.", time: "15 min ago", icon: ShieldCheck, iconBg: "bg-emerald-100", iconFg: "text-emerald-500" },
];

// ---- Users page ----
const initialUsers = [
  { id: "U-1042", name: "Amina Traor\u00e9", email: "amina.t@example.com", phone: "+237 690 000 001", balance: "\u20a3128,400", status: "Active", kyc: "Verified", joined: "Jan 14, 2024" },
  { id: "U-1043", name: "David Kamdem", email: "david.k@example.com", phone: "+237 690 000 002", balance: "\u20a354,200", status: "Active", kyc: "Verified", joined: "Feb 02, 2024" },
  { id: "U-1044", name: "Wei Lin", email: "wei.lin@example.com", phone: "+86 138 0000 1234", balance: "\u00a58,940", status: "Active", kyc: "Pending", joined: "Feb 20, 2024" },
  { id: "U-1045", name: "John Doumbe", email: "john.d@example.com", phone: "+237 690 000 004", balance: "\u20a312,000", status: "Suspended", kyc: "Verified", joined: "Mar 03, 2024" },
  { id: "U-1046", name: "Zhang Rui", email: "zhang.r@example.com", phone: "+86 138 0000 5678", balance: "\u00a53,150", status: "Active", kyc: "Rejected", joined: "Mar 18, 2024" },
  { id: "U-1047", name: "Fatou Ndiaye", email: "fatou.n@example.com", phone: "+237 690 000 006", balance: "\u20a367,800", status: "Active", kyc: "Verified", joined: "Apr 05, 2024" },
  { id: "U-1048", name: "Li Wei", email: "li.wei@example.com", phone: "+86 138 0000 9012", balance: "\u00a515,200", status: "Suspended", kyc: "Verified", joined: "Apr 22, 2024" },
  { id: "U-1049", name: "Emmanuel Fon", email: "emmanuel.f@example.com", phone: "+237 690 000 008", balance: "\u20a39,400", status: "Active", kyc: "Pending", joined: "May 09, 2024" },
];

// ---- Payments page (full ledger) ----
const allPayments = [
  { user: "Amina T.", method: "MTN", amount: "+50,000 FCFA", type: "Top-up", status: "Success", time: "02:44 AM" },
  { user: "Wei L.", method: "Alipay", amount: "-120 \u00a5", type: "Payment", status: "Success", time: "02:42 AM" },
  { user: "John D.", method: "Orange", amount: "+20,000 FCFA", type: "Top-up", status: "Pending", time: "02:41 AM" },
  { user: "David K.", method: "Orange", amount: "+25,000 FCFA", type: "Top-up", status: "Success", time: "02:43 AM" },
  { user: "Zhang R.", method: "WeChat", amount: "-300 \u00a5", type: "Payment", status: "Success", time: "02:40 AM" },
  { user: "Fatou N.", method: "Bank", amount: "+150,000 FCFA", type: "Top-up", status: "Success", time: "02:35 AM" },
  { user: "Li W.", method: "Card", amount: "-42,000 FCFA", type: "Payment", status: "Failed", time: "02:30 AM" },
  { user: "Emmanuel F.", method: "MTN", amount: "+8,000 FCFA", type: "Top-up", status: "Pending", time: "02:22 AM" },
  { user: "Grace A.", method: "Alipay", amount: "-560 \u00a5", type: "Payment", status: "Success", time: "02:15 AM" },
  { user: "Paul E.", method: "Orange", amount: "+33,000 FCFA", type: "Top-up", status: "Success", time: "02:05 AM" },
];

// ---- Wallets page ----
const initialWallets = [
  { id: "W-501", owner: "Amina Traor\u00e9", currency: "FCFA", balance: 128400, status: "Active" },
  { id: "W-502", owner: "David Kamdem", currency: "FCFA", balance: 54200, status: "Active" },
  { id: "W-503", owner: "Wei Lin", currency: "RMB", balance: 8940, status: "Active" },
  { id: "W-504", owner: "John Doumbe", currency: "FCFA", balance: 12000, status: "Frozen" },
  { id: "W-505", owner: "Zhang Rui", currency: "RMB", balance: 3150, status: "Active" },
  { id: "W-506", owner: "Fatou Ndiaye", currency: "FCFA", balance: 67800, status: "Active" },
  { id: "W-507", owner: "Li Wei", currency: "RMB", balance: 15200, status: "Frozen" },
];

// ---- Cards page ----
const initialCards = [
  { id: "C-2201", holder: "Amina Traor\u00e9", last4: "4821", type: "Virtual", status: "Active", limit: 500000 },
  { id: "C-2202", holder: "David Kamdem", last4: "1190", type: "Physical", status: "Active", limit: 250000 },
  { id: "C-2203", holder: "Wei Lin", last4: "7734", type: "Virtual", status: "Blocked", limit: 100000 },
  { id: "C-2204", holder: "Fatou Ndiaye", last4: "3305", type: "Physical", status: "Active", limit: 400000 },
  { id: "C-2205", holder: "Li Wei", last4: "9982", type: "Virtual", status: "Active", limit: 150000 },
];

// ---- KYC page ----
const initialKycQueue = [
  { id: "K-901", name: "Wei Lin", submitted: "May 28, 2024", docType: "Passport", status: "Pending" },
  { id: "K-902", name: "Emmanuel Fon", submitted: "May 27, 2024", docType: "National ID", status: "Pending" },
  { id: "K-903", name: "Zhang Rui", submitted: "May 25, 2024", docType: "Passport", status: "Under Review" },
  { id: "K-904", name: "Grace Ateba", submitted: "May 24, 2024", docType: "National ID", status: "Under Review" },
  { id: "K-905", name: "Amina Traor\u00e9", submitted: "Apr 02, 2024", docType: "Passport", status: "Verified" },
  { id: "K-906", name: "Li Wei", submitted: "Mar 30, 2024", docType: "National ID", status: "Rejected" },
];

// ---- Analytics page ----
const userGrowthData = [
  { label: "Jan", users: 5200 },
  { label: "Feb", users: 5860 },
  { label: "Mar", users: 6510 },
  { label: "Apr", users: 7220 },
  { label: "May", users: 7940 },
  { label: "Jun", users: 8492 },
];

const volumeByMethod = [
  { method: "MTN", volume: 1250000 },
  { method: "Orange", volume: 842000 },
  { method: "Alipay", volume: 1920000 },
  { method: "WeChat", volume: 1690000 },
  { method: "Bank", volume: 392000 },
  { method: "Card", volume: 512000 },
];

// ---- Exchange page ----
const initialExchangeChannels = [
  { channel: "Alipay", rate: 91.40, icon: Smartphone, iconBg: "bg-blue-100", iconFg: "text-blue-600" },
  { channel: "WeChat", rate: 91.30, icon: Smartphone, iconBg: "bg-green-100", iconFg: "text-green-600" },
  { channel: "Cash RMB", rate: 90.80, icon: DollarSign, iconBg: "bg-emerald-100", iconFg: "text-emerald-600" },
  { channel: "Bank Transfer", rate: 91.60, icon: Landmark, iconBg: "bg-indigo-100", iconFg: "text-indigo-600" },
];

// ---- Security page ----
const initialSessions = [
  { id: "S-1", device: "MacBook Pro \u00b7 Chrome", location: "Douala, CM", lastActive: "Active now" },
  { id: "S-2", device: "iPhone 15 \u00b7 App", location: "Douala, CM", lastActive: "10 min ago" },
  { id: "S-3", device: "Windows PC \u00b7 Edge", location: "Yaound\u00e9, CM", lastActive: "Yesterday" },
];

// ---- Notifications page ----
const notificationChannels = ["Email", "SMS", "Push", "In-app"];
const notificationCategories = ["Transaction alerts", "Security alerts", "KYC updates", "Marketing"];
const initialNotifMatrix = {
  "Transaction alerts": { Email: true, SMS: true, Push: true, "In-app": true },
  "Security alerts": { Email: true, SMS: true, Push: false, "In-app": true },
  "KYC updates": { Email: true, SMS: false, Push: false, "In-app": true },
  Marketing: { Email: false, SMS: false, Push: false, "In-app": true },
};

const sentNotifications = [
  { text: "Payout of \u20a31.25M processed for MTN Mobile Money", time: "10 min ago" },
  { text: "Security alert email sent to all admins", time: "1 hour ago" },
  { text: "KYC reminder sent to 14 pending users", time: "3 hours ago" },
];

// ---- Admin roles page ----
const initialAdmins = [
  { id: "A-01", name: "You (Admin)", email: "admin@rmbpay.africa", role: "Super Admin", lastActive: "Just now" },
  { id: "A-02", name: "Sarah Mballa", email: "sarah.m@rmbpay.africa", role: "Admin", lastActive: "1 hour ago" },
  { id: "A-03", name: "Paul Etoundi", email: "paul.e@rmbpay.africa", role: "Support", lastActive: "3 hours ago" },
  { id: "A-04", name: "Chen Yu", email: "chen.y@rmbpay.africa", role: "Support", lastActive: "Yesterday" },
];

// ---- Logs page ----
const auditLogs = [
  { time: "02:44 AM", admin: "Sarah Mballa", action: "Approved KYC", target: "Amina Traor\u00e9", ip: "41.202.1.10" },
  { time: "02:20 AM", admin: "You (Admin)", action: "Updated exchange rate", target: "Alipay to FCFA", ip: "197.234.5.2" },
  { time: "01:58 AM", admin: "Paul Etoundi", action: "Suspended user", target: "John Doumbe", ip: "41.202.1.44" },
  { time: "01:30 AM", admin: "Chen Yu", action: "Blocked card", target: "C-2203", ip: "223.104.9.7" },
  { time: "12:55 AM", admin: "You (Admin)", action: "Invited admin", target: "chen.y@rmbpay.africa", ip: "197.234.5.2" },
  { time: "12:10 AM", admin: "Sarah Mballa", action: "Rejected KYC", target: "Li Wei", ip: "41.202.1.10" },
  { time: "11:45 PM", admin: "You (Admin)", action: "Enabled maintenance mode", target: "Platform settings", ip: "197.234.5.2" },
];

// ================================================================
// Small building blocks
// ================================================================

function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-2xl text-white font-bold text-lg shrink-0"
        style={{
          background: "linear-gradient(135deg,#7058EE,#4E36D4)",
          boxShadow: "0 4px 10px -2px rgba(78,54,212,0.45)",
        }}
      >
        ¥
      </div>
      <span className="text-[19px] font-bold tracking-tight">
        <span className="text-slate-900">RMB</span>
        <span className="text-violet-600">pay</span>
      </span>
    </div>
  );
}

function MethodTag({ name }) {
  const m = methodBadge[name] || { bg: "bg-slate-100", fg: "text-slate-600", label: name };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${m.bg} ${m.fg}`}>
      {m.label}
    </span>
  );
}

function MiniTrend({ up }) {
  const pts = up
    ? "0,18 10,15 20,16 30,10 40,11 50,4 60,2"
    : "0,4 10,8 20,6 30,12 40,10 50,16 60,18";
  return (
    <svg viewBox="0 0 60 20" className="h-5 w-16">
      <polyline
        points={pts}
        fill="none"
        stroke={up ? "#10b981" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusBadge({ status }) {
  const positive = ["Success", "Active", "Verified", "Approved"].includes(status);
  const neutral = ["Pending", "Under Review"].includes(status);
  const negative = ["Failed", "Suspended", "Rejected", "Blocked", "Frozen"].includes(status);
  const styles = positive
    ? "bg-emerald-100 text-emerald-600"
    : neutral
    ? "bg-orange-100 text-orange-600"
    : negative
    ? "bg-rose-100 text-rose-600"
    : "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
}

function fmtY(v) {
  if (v === 0) return "0";
  return `${v / 1000000}M`;
}

function parseAmount(str) {
  const m = String(str).replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  if (!m) return 0;
  let n = parseFloat(m[0]);
  if (/m\b/i.test(str)) n *= 1000000;
  if (/k\b/i.test(str)) n *= 1000;
  return n;
}

function parsePercent(str) {
  const m = String(str).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

function toggleSort(setter, current, key) {
  setter({ key, dir: current.key === key && current.dir === "asc" ? "desc" : "asc" });
}

function SortHeader({ label, active, dir, onClick, align = "left" }) {
  return (
    <th
      className={`cursor-pointer select-none pb-2 font-medium hover:text-slate-600 ${align === "right" ? "text-right" : ""}`}
      onClick={onClick}
    >
      <span className={`inline-flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : ""}`}>
        {label}
        <ChevronDown
          size={11}
          className={`transition-transform ${active ? "text-violet-500" : "text-slate-300"} ${
            active && dir === "asc" ? "rotate-180" : ""
          }`}
        />
      </span>
    </th>
  );
}

function ToggleSwitch({ checked, onChange, label, sub }) {
  return (
    <div className="flex items-center justify-between gap-3">
      {(label || sub) && (
        <div>
          {label && <div className="text-[13px] font-medium text-slate-700">{label}</div>}
          {sub && <div className="text-[12px] text-slate-400">{sub}</div>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-violet-600" : "bg-slate-200"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

function PageHeader({ title, subtitle, actionLabel, onAction, actionIcon: ActionIcon }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-[22px] font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-slate-500">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-violet-700"
        >
          {ActionIcon && <ActionIcon size={15} />}
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function EmptyRow({ colSpan, text = "No results found" }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-8 text-center text-[13px] text-slate-400">{text}</td>
    </tr>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
      <Search size={13} className="text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[12.5px] text-slate-600 placeholder:text-slate-400 outline-none"
      />
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[12.5px] text-slate-600 outline-none"
    >
      {options.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

// ================================================================
// Overview page
// ================================================================

function OverviewPage({ setSelectedTx, setActiveNav }) {
  const [rangeOpen, setRangeOpen] = useState(false);
  const [range, setRange] = useState("This Week");
  const [dateOpen, setDateOpen] = useState(false);
  const [txQuery, setTxQuery] = useState("");
  const [txStatusFilter, setTxStatusFilter] = useState("All");
  const [txSort, setTxSort] = useState({ key: "time", dir: "desc" });
  const [paySort, setPaySort] = useState({ key: null, dir: "asc" });

  const visibleTransactions = React.useMemo(() => {
    const q = txQuery.trim().toLowerCase();
    let rows = recentTransactions.filter((t) => {
      const matchesQuery =
        !q ||
        t.user.toLowerCase().includes(q) ||
        t.method.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q);
      const matchesStatus = txStatusFilter === "All" || t.status === txStatusFilter;
      return matchesQuery && matchesStatus;
    });
    const { key, dir } = txSort;
    if (key) {
      rows = [...rows].sort((a, b) => {
        let av, bv;
        if (key === "amount") { av = parseAmount(a.amount); bv = parseAmount(b.amount); }
        else { av = a[key]; bv = b[key]; }
        if (av < bv) return dir === "asc" ? -1 : 1;
        if (av > bv) return dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [txQuery, txStatusFilter, txSort]);

  const visiblePayments = React.useMemo(() => {
    const { key, dir } = paySort;
    if (!key) return paymentsOverview;
    return [...paymentsOverview].sort((a, b) => {
      const av = key === "success" ? parsePercent(a.success) : parseAmount(a.amount);
      const bv = key === "success" ? parsePercent(b.success) : parseAmount(b.amount);
      return dir === "asc" ? av - bv : bv - av;
    });
  }, [paySort]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[22px] font-bold text-slate-900">Good morning, Admin \ud83d\udc4b</h1>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12.5px] font-medium text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> System Online
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-[12.5px] font-medium text-violet-600">
            <Repeat size={13} /> Transactions processing
          </span>
          <div className="relative">
            <button
              onClick={() => setDateOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-600 hover:bg-slate-50"
            >
              May 25, 2024 <Calendar size={14} className="text-slate-400" />
            </button>
            {dateOpen && (
              <div className="absolute right-0 top-9 z-20 rounded-xl border border-slate-200 bg-white p-3 text-[12.5px] text-slate-500 shadow-lg">
                Date picker placeholder
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-5 gap-4">
        {statCards.map((c) => (
          <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${c.iconBg} text-white`}>
              <c.icon size={18} />
            </div>
            <div className="text-[12.5px] text-slate-500">{c.title}</div>
            <div className="mt-0.5 text-[19px] font-bold text-slate-900">{c.value}</div>
            <div className={`mt-1 text-[12px] font-medium ${c.subColor}`}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-800">Transaction Volume</h2>
            <div className="relative">
              <button
                onClick={() => setRangeOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[12.5px] font-medium text-slate-600 hover:bg-slate-50"
              >
                {range} <ChevronDown size={13} className="text-slate-400" />
              </button>
              {rangeOpen && (
                <div className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                  {["This Week", "This Month", "This Year"].map((r) => (
                    <button
                      key={r}
                      onClick={() => { setRange(r); setRangeOpen(false); }}
                      className="block w-full rounded-lg px-3 py-1.5 text-left text-[12.5px] text-slate-600 hover:bg-slate-50"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataByRange[range]} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f1f4" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={fmtY}
                  domain={[0, chartMaxByRange[range]]}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip formatter={(v) => `\u20a3${(v / 1000000).toFixed(1)}M`} />
                <Area type="monotone" dataKey="volume" stroke="none" fill="url(#volFill)" />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-800">Live Transactions</h2>
            <button onClick={() => setActiveNav("Payments")} className="text-[12.5px] font-medium text-violet-600 hover:underline">View all</button>
          </div>
          <div className="space-y-1">
            {liveTransactions.map((t, i) => (
              <button
                key={i}
                onClick={() => setSelectedTx(t)}
                className="flex w-full items-center gap-3 rounded-xl px-1.5 py-2 text-left hover:bg-slate-50"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${t.avatar} text-[11px] font-semibold text-white shrink-0`}>
                  {t.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-slate-700">{t.name}</div>
                  <MethodTag name={t.method} />
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-[13px] font-semibold ${t.positive ? "text-emerald-500" : "text-slate-700"}`}>
                    {t.amount}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400">
                    {t.time} <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setActiveNav("Payments")} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-violet-50 py-2.5 text-[13px] font-semibold text-violet-600 hover:bg-violet-100">
            View all transactions <ChevronRight size={14} />
          </button>

          <div className="mt-5 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-slate-800">KYC Applications</h3>
            <button onClick={() => setActiveNav("KYC")} className="text-[12px] font-medium text-violet-600 hover:underline">View all</button>
          </div>
          <div className="mt-2 space-y-2.5">
            {kycApps.map((k) => (
              <div key={k.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] text-slate-600">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${k.iconBg} ${k.color}`}>
                    <k.icon size={12} />
                  </span>
                  {k.label}
                </div>
                <span className="text-[13px] font-semibold text-slate-800">{k.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-slate-800">System Status</h3>
            <button onClick={() => setActiveNav("Security")} className="text-[12px] font-medium text-violet-600 hover:underline">View all</button>
          </div>
          <div className="mt-2 space-y-2.5">
            {systemStatus.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] text-slate-600">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${s.iconBg} ${s.iconFg}`}>
                    <s.icon size={12} />
                  </span>
                  {s.label}
                </div>
                <span className="text-[12.5px] font-medium text-emerald-500">Operational</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-800">Payments Overview</h2>
            <button onClick={() => setActiveNav("Payments")} className="text-[12.5px] font-medium text-violet-600 hover:underline">View all</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11.5px] text-slate-400">
                <th className="pb-2 font-medium">Method</th>
                <SortHeader label="Success" active={paySort.key === "success"} dir={paySort.dir} onClick={() => toggleSort(setPaySort, paySort, "success")} />
                <SortHeader label="Amount" active={paySort.key === "amount"} dir={paySort.dir} onClick={() => toggleSort(setPaySort, paySort, "amount")} />
                <th className="pb-2 font-medium text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {visiblePayments.map((p) => (
                <tr key={p.method} className="border-t border-slate-100">
                  <td className="py-2.5 pr-2 text-[13px] text-slate-700">
                    <MethodTag name={p.badge} />
                  </td>
                  <td className="py-2.5 text-[13px] text-slate-600">{p.success}</td>
                  <td className="py-2.5 text-[13px] font-medium text-slate-800">{p.amount}</td>
                  <td className="py-2.5 text-right"><div className="flex justify-end"><MiniTrend up={p.trendUp} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-800">RMB Exchange Rates</h2>
            <button onClick={() => setActiveNav("Exchange")} className="text-[12.5px] font-medium text-violet-600 hover:underline">Manage Rates</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11.5px] text-slate-400">
                <th className="pb-2 font-medium">Channel</th>
                <th className="pb-2 font-medium">Rate (1 RMB)</th>
                <th className="pb-2 font-medium text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {exchangeRates.map((r) => (
                <tr key={r.channel} className="border-t border-slate-100">
                  <td className="py-2.5 text-[13px] text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${r.iconBg} ${r.iconFg}`}>
                        <r.icon size={12} />
                      </span>
                      {r.channel}
                    </div>
                  </td>
                  <td className="py-2.5 text-[13px] font-medium text-slate-800">{r.rate}</td>
                  <td className="py-2.5 text-right text-[12.5px] text-slate-400">{r.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setActiveNav("Exchange")} className="mt-3 w-full rounded-xl bg-violet-50 py-2.5 text-[13px] font-semibold text-violet-600 hover:bg-violet-100">
            Update Exchange Rates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-semibold text-slate-800">Recent Transactions</h2>
            <button onClick={() => setActiveNav("Payments")} className="text-[12.5px] font-medium text-violet-600 hover:underline">View all</button>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <SearchBox value={txQuery} onChange={setTxQuery} placeholder="Filter by user, method, type..." />
            <FilterSelect value={txStatusFilter} onChange={setTxStatusFilter} options={["All", "Success", "Pending"]} />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11.5px] text-slate-400">
                <SortHeader label="User" active={txSort.key === "user"} dir={txSort.dir} onClick={() => toggleSort(setTxSort, txSort, "user")} />
                <th className="pb-2 font-medium">Method</th>
                <SortHeader label="Amount" active={txSort.key === "amount"} dir={txSort.dir} onClick={() => toggleSort(setTxSort, txSort, "amount")} />
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Status</th>
                <SortHeader label="Time" active={txSort.key === "time"} dir={txSort.dir} onClick={() => toggleSort(setTxSort, txSort, "time")} align="right" />
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.length === 0 ? (
                <EmptyRow colSpan={6} text="No transactions match your filters" />
              ) : (
                visibleTransactions.map((t, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedTx(t)}
                    className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-2.5 text-[13px] text-slate-700">{t.user}</td>
                    <td className="py-2.5"><MethodTag name={t.method} /></td>
                    <td className="py-2.5 text-[13px] font-medium text-slate-800">{t.amount}</td>
                    <td className="py-2.5 text-[13px] text-slate-500">{t.type}</td>
                    <td className="py-2.5"><StatusBadge status={t.status} /></td>
                    <td className="py-2.5 text-right text-[12.5px] text-slate-400">{t.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-800">Security Alerts</h2>
            <button onClick={() => setActiveNav("Security")} className="text-[12.5px] font-medium text-violet-600 hover:underline">View all</button>
          </div>
          <div className="space-y-1">
            {securityAlerts.map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-1.5 py-2.5 hover:bg-slate-50">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${a.iconBg} ${a.iconFg} shrink-0`}>
                  <a.icon size={15} />
                </span>
                <span className="flex-1 text-[13px] text-slate-700">{a.text}</span>
                <span className="text-[12px] text-slate-400 shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ================================================================
// Users page
// ================================================================

function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [selectedUser, setSelectedUser] = useState(null);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = users.filter((u) => {
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
    const { key, dir } = sort;
    if (key) {
      rows = [...rows].sort((a, b) => {
        const av = key === "balance" ? parseAmount(a.balance) : a[key];
        const bv = key === "balance" ? parseAmount(b.balance) : b[key];
        if (av < bv) return dir === "asc" ? -1 : 1;
        if (av > bv) return dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [users, query, statusFilter, sort]);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u))
    );
    setSelectedUser((cur) => (cur && cur.id === id ? { ...cur, status: cur.status === "Active" ? "Suspended" : "Active" } : cur));
  };

  return (
    <>
      <PageHeader title="Users" subtitle={`${users.length} registered users`} actionLabel="Add User" actionIcon={Plus} onAction={() => {}} />
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <SearchBox value={query} onChange={setQuery} placeholder="Search by name or email..." />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={["All", "Active", "Suspended"]} />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11.5px] text-slate-400">
              <SortHeader label="Name" active={sort.key === "name"} dir={sort.dir} onClick={() => toggleSort(setSort, sort, "name")} />
              <th className="pb-2 font-medium">Contact</th>
              <SortHeader label="Balance" active={sort.key === "balance"} dir={sort.dir} onClick={() => toggleSort(setSort, sort, "balance")} />
              <th className="pb-2 font-medium">KYC</th>
              <th className="pb-2 font-medium">Status</th>
              <SortHeader label="Joined" active={sort.key === "joined"} dir={sort.dir} onClick={() => toggleSort(setSort, sort, "joined")} align="right" />
              <th className="pb-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <EmptyRow colSpan={7} text="No users match your filters" />
            ) : (
              visible.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td onClick={() => setSelectedUser(u)} className="cursor-pointer py-2.5 text-[13px] font-medium text-slate-700">{u.name}</td>
                  <td onClick={() => setSelectedUser(u)} className="cursor-pointer py-2.5 text-[12.5px] text-slate-500">{u.email}</td>
                  <td className="py-2.5 text-[13px] font-medium text-slate-800">{u.balance}</td>
                  <td className="py-2.5"><StatusBadge status={u.kyc} /></td>
                  <td className="py-2.5"><StatusBadge status={u.status} /></td>
                  <td className="py-2.5 text-right text-[12.5px] text-slate-400">{u.joined}</td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`rounded-lg px-2.5 py-1 text-[12px] font-semibold ${
                        u.status === "Active" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {u.status === "Active" ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {selectedUser && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/30" onClick={() => setSelectedUser(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-80 rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-[15px] font-semibold text-slate-800">User detail</h3>
            <div className="space-y-2 text-[13px] text-slate-600">
              <div className="flex justify-between"><span>Name</span><span className="font-medium text-slate-800">{selectedUser.name}</span></div>
              <div className="flex justify-between"><span>Email</span><span className="font-medium text-slate-800">{selectedUser.email}</span></div>
              <div className="flex justify-between"><span>Phone</span><span className="font-medium text-slate-800">{selectedUser.phone}</span></div>
              <div className="flex justify-between"><span>Balance</span><span className="font-medium text-slate-800">{selectedUser.balance}</span></div>
              <div className="flex justify-between"><span>KYC</span><StatusBadge status={selectedUser.kyc} /></div>
              <div className="flex justify-between"><span>Status</span><StatusBadge status={selectedUser.status} /></div>
              <div className="flex justify-between"><span>Joined</span><span className="text-slate-400">{selectedUser.joined}</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => toggleStatus(selectedUser.id)}
                className={`flex-1 rounded-xl py-2 text-[13px] font-semibold ${
                  selectedUser.status === "Active" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                }`}
              >
                {selectedUser.status === "Active" ? "Suspend account" : "Activate account"}
              </button>
              <button onClick={() => setSelectedUser(null)} className="flex-1 rounded-xl bg-violet-50 py-2 text-[13px] font-semibold text-violet-600 hover:bg-violet-100">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ================================================================
// Payments page (full ledger)
// ================================================================

function PaymentsPage({ setSelectedTx }) {
  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState({ key: "time", dir: "desc" });

  const methods = ["All", ...Array.from(new Set(allPayments.map((p) => p.method)))];

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = allPayments.filter((p) => {
      const matchesQuery = !q || p.user.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
      const matchesMethod = methodFilter === "All" || p.method === methodFilter;
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesQuery && matchesMethod && matchesStatus;
    });
    const { key, dir } = sort;
    if (key) {
      rows = [...rows].sort((a, b) => {
        const av = key === "amount" ? parseAmount(a.amount) : a[key];
        const bv = key === "amount" ? parseAmount(b.amount) : b[key];
        if (av < bv) return dir === "asc" ? -1 : 1;
        if (av > bv) return dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [query, methodFilter, statusFilter, sort]);

  const successCount = allPayments.filter((p) => p.status === "Success").length;
  const failedCount = allPayments.filter((p) => p.status === "Failed").length;
  const pendingCount = allPayments.filter((p) => p.status === "Pending").length;

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle={`${allPayments.length} transactions across all channels`}
        actionLabel="Export CSV"
        actionIcon={Download}
        onAction={() => {}}
      />
      <div className="mb-4 grid grid-cols-3 gap-4">
        <Card>
          <div className="text-[12.5px] text-slate-500">Successful</div>
          <div className="mt-0.5 text-[19px] font-bold text-emerald-600">{successCount}</div>
        </Card>
        <Card>
          <div className="text-[12.5px] text-slate-500">Pending</div>
          <div className="mt-0.5 text-[19px] font-bold text-orange-500">{pendingCount}</div>
        </Card>
        <Card>
          <div className="text-[12.5px] text-slate-500">Failed</div>
          <div className="mt-0.5 text-[19px] font-bold text-rose-500">{failedCount}</div>
        </Card>
      </div>
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <SearchBox value={query} onChange={setQuery} placeholder="Search by user or type..." />
          <FilterSelect value={methodFilter} onChange={setMethodFilter} options={methods} />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={["All", "Success", "Pending", "Failed"]} />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11.5px] text-slate-400">
              <SortHeader label="User" active={sort.key === "user"} dir={sort.dir} onClick={() => toggleSort(setSort, sort, "user")} />
              <th className="pb-2 font-medium">Method</th>
              <SortHeader label="Amount" active={sort.key === "amount"} dir={sort.dir} onClick={() => toggleSort(setSort, sort, "amount")} />
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Status</th>
              <SortHeader label="Time" active={sort.key === "time"} dir={sort.dir} onClick={() => toggleSort(setSort, sort, "time")} align="right" />
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <EmptyRow colSpan={6} text="No transactions match your filters" />
            ) : (
              visible.map((t, i) => (
                <tr key={i} onClick={() => setSelectedTx(t)} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50">
                  <td className="py-2.5 text-[13px] text-slate-700">{t.user}</td>
                  <td className="py-2.5"><MethodTag name={t.method} /></td>
                  <td className="py-2.5 text-[13px] font-medium text-slate-800">{t.amount}</td>
                  <td className="py-2.5 text-[13px] text-slate-500">{t.type}</td>
                  <td className="py-2.5"><StatusBadge status={t.status} /></td>
                  <td className="py-2.5 text-right text-[12.5px] text-slate-400">{t.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// ================================================================
// Wallets page
// ================================================================

function WalletsPage() {
  const [wallets, setWallets] = useState(initialWallets);
  const [query, setQuery] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("All");
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = wallets.filter((w) => {
      const matchesQuery = !q || w.owner.toLowerCase().includes(q) || w.id.toLowerCase().includes(q);
      const matchesCurrency = currencyFilter === "All" || w.currency === currencyFilter;
      return matchesQuery && matchesCurrency;
    });
    const { key, dir } = sort;
    if (key) {
      rows = [...rows].sort((a, b) => {
        const av = a[key], bv = b[key];
        if (av < bv) return dir === "asc" ? -1 : 1;
        if (av > bv) return dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [wallets, query, currencyFilter, sort]);

  const toggleFreeze = (id) => {
    setWallets((prev) => prev.map((w) => (w.id === id ? { ...w, status: w.status === "Active" ? "Frozen" : "Active" } : w)));
  };

  const totalFCFA = wallets.filter((w) => w.currency === "FCFA").reduce((s, w) => s + w.balance, 0);
  const totalRMB = wallets.filter((w) => w.currency === "RMB").reduce((s, w) => s + w.balance, 0);
  const frozenCount = wallets.filter((w) => w.status === "Frozen").length;

  return (
    <>
      <PageHeader title="Wallets" subtitle={`${wallets.length} wallets across all currencies`} />
      <div className="mb-4 grid grid-cols-3 gap-4">
        <Card>
          <div className="text-[12.5px] text-slate-500">Total FCFA balance</div>
          <div className="mt-0.5 text-[19px] font-bold text-slate-900">{"\u20a3"}{totalFCFA.toLocaleString()}</div>
        </Card>
        <Card>
          <div className="text-[12.5px] text-slate-500">Total RMB balance</div>
          <div className="mt-0.5 text-[19px] font-bold text-slate-900">{"\u00a5"}{totalRMB.toLocaleString()}</div>
        </Card>
        <Card>
          <div className="text-[12.5px] text-slate-500">Frozen wallets</div>
          <div className="mt-0.5 text-[19px] font-bold text-rose-500">{frozenCount}</div>
        </Card>
      </div>
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <SearchBox value={query} onChange={setQuery} placeholder="Search by owner or wallet ID..." />
          <FilterSelect value={currencyFilter} onChange={setCurrencyFilter} options={["All", "FCFA", "RMB"]} />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11.5px] text-slate-400">
              <th className="pb-2 font-medium">Wallet ID</th>
              <SortHeader label="Owner" active={sort.key === "owner"} dir={sort.dir} onClick={() => toggleSort(setSort, sort, "owner")} />
              <th className="pb-2 font-medium">Currency</th>
              <SortHeader label="Balance" active={sort.key === "balance"} dir={sort.dir} onClick={() => toggleSort(setSort, sort, "balance")} />
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <EmptyRow colSpan={6} text="No wallets match your filters" />
            ) : (
              visible.map((w) => (
                <tr key={w.id} className="border-t border-slate-100">
                  <td className="py-2.5 text-[12.5px] text-slate-500">{w.id}</td>
                  <td className="py-2.5 text-[13px] font-medium text-slate-700">{w.owner}</td>
                  <td className="py-2.5 text-[13px] text-slate-600">{w.currency}</td>
                  <td className="py-2.5 text-[13px] font-medium text-slate-800">
                    {w.currency === "FCFA" ? "\u20a3" : "\u00a5"}{w.balance.toLocaleString()}
                  </td>
                  <td className="py-2.5"><StatusBadge status={w.status} /></td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => toggleFreeze(w.id)}
                      className={`rounded-lg px-2.5 py-1 text-[12px] font-semibold ${
                        w.status === "Active" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {w.status === "Active" ? "Freeze" : "Unfreeze"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// ================================================================
// Cards page
// ================================================================

function CardsPage() {
  const [cards, setCards] = useState(initialCards);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [draftLimit, setDraftLimit] = useState("");

  const visible = cards.filter((c) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || c.holder.toLowerCase().includes(q) || c.last4.includes(q);
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const toggleBlock = (id) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === "Active" ? "Blocked" : "Active" } : c)));
  };

  const startEdit = (c) => { setEditingId(c.id); setDraftLimit(String(c.limit)); };
  const saveLimit = (id) => {
    const n = parseInt(draftLimit, 10);
    if (!isNaN(n)) setCards((prev) => prev.map((c) => (c.id === id ? { ...c, limit: n } : c)));
    setEditingId(null);
  };

  return (
    <>
      <PageHeader title="Cards" subtitle={`${cards.length} issued cards (virtual & physical)`} actionLabel="Issue Card" actionIcon={Plus} onAction={() => {}} />
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <SearchBox value={query} onChange={setQuery} placeholder="Search by holder or last 4 digits..." />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={["All", "Active", "Blocked"]} />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11.5px] text-slate-400">
              <th className="pb-2 font-medium">Holder</th>
              <th className="pb-2 font-medium">Card</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Limit</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <EmptyRow colSpan={6} text="No cards match your filters" />
            ) : (
              visible.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="py-2.5 text-[13px] font-medium text-slate-700">{c.holder}</td>
                  <td className="py-2.5 text-[12.5px] text-slate-500">\u2022\u2022\u2022\u2022 {c.last4}</td>
                  <td className="py-2.5 text-[13px] text-slate-600">{c.type}</td>
                  <td className="py-2.5 text-[13px] font-medium text-slate-800">
                    {editingId === c.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          value={draftLimit}
                          onChange={(e) => setDraftLimit(e.target.value)}
                          className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-[12.5px] outline-none focus:border-violet-400"
                        />
                        <button onClick={() => saveLimit(c.id)} className="rounded-lg bg-violet-50 p-1.5 text-violet-600 hover:bg-violet-100">
                          <Save size={13} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(c)} className="flex items-center gap-1.5 hover:text-violet-600">
                        {"\u20a3"}{c.limit.toLocaleString()} <Pencil size={12} className="text-slate-400" />
                      </button>
                    )}
                  </td>
                  <td className="py-2.5"><StatusBadge status={c.status} /></td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => toggleBlock(c.id)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[12px] font-semibold ${
                        c.status === "Active" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      <Ban size={12} /> {c.status === "Active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// ================================================================
// KYC page
// ================================================================

function KYCPage() {
  const [queue, setQueue] = useState(initialKycQueue);
  const [tab, setTab] = useState("Pending");
  const [query, setQuery] = useState("");

  const tabs = ["Pending", "Under Review", "Verified", "Rejected"];
  const counts = Object.fromEntries(tabs.map((t) => [t, queue.filter((k) => k.status === t).length]));

  const visible = queue.filter((k) => {
    const q = query.trim().toLowerCase();
    return k.status === tab && (!q || k.name.toLowerCase().includes(q));
  });

  const setStatus = (id, status) => {
    setQueue((prev) => prev.map((k) => (k.id === id ? { ...k, status } : k)));
  };

  return (
    <>
      <PageHeader title="KYC Applications" subtitle="Review and verify user identity documents" />
      <div className="mb-4 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-medium ${
              tab === t ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t} <span className={`rounded-full px-1.5 text-[11px] ${tab === t ? "bg-white/20" : "bg-slate-100"}`}>{counts[t]}</span>
          </button>
        ))}
      </div>
      <Card>
        <div className="mb-3">
          <SearchBox value={query} onChange={setQuery} placeholder="Search applicant name..." />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11.5px] text-slate-400">
              <th className="pb-2 font-medium">Applicant</th>
              <th className="pb-2 font-medium">Document</th>
              <th className="pb-2 font-medium">Submitted</th>
              <th className="pb-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <EmptyRow colSpan={4} text="No applications in this tab" />
            ) : (
              visible.map((k) => (
                <tr key={k.id} className="border-t border-slate-100">
                  <td className="py-2.5 text-[13px] font-medium text-slate-700">{k.name}</td>
                  <td className="py-2.5 text-[13px] text-slate-600">{k.docType}</td>
                  <td className="py-2.5 text-[12.5px] text-slate-400">{k.submitted}</td>
                  <td className="py-2.5 text-right">
                    {(k.status === "Pending" || k.status === "Under Review") && (
                      <div className="flex justify-end gap-1.5">
                        {k.status === "Pending" && (
                          <button onClick={() => setStatus(k.id, "Under Review")} className="rounded-lg bg-blue-50 px-2.5 py-1 text-[12px] font-semibold text-blue-600 hover:bg-blue-100">
                            Review
                          </button>
                        )}
                        <button onClick={() => setStatus(k.id, "Verified")} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-600 hover:bg-emerald-100">
                          <CheckCircle2 size={12} /> Approve
                        </button>
                        <button onClick={() => setStatus(k.id, "Rejected")} className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-[12px] font-semibold text-rose-600 hover:bg-rose-100">
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// ================================================================
// Analytics page
// ================================================================

function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" subtitle="Platform growth and payment method performance" />
      <div className="mb-4 grid grid-cols-3 gap-4">
        <Card>
          <div className="text-[12.5px] text-slate-500">Total volume (YTD)</div>
          <div className="mt-0.5 text-[19px] font-bold text-slate-900">{"\u20a3"}5.61M</div>
          <div className="mt-1 text-[12px] font-medium text-emerald-500">{"\u2191"} 21.4% YoY</div>
        </Card>
        <Card>
          <div className="text-[12.5px] text-slate-500">Avg. transaction size</div>
          <div className="mt-0.5 text-[19px] font-bold text-slate-900">{"\u20a3"}28,400</div>
          <div className="mt-1 text-[12px] font-medium text-emerald-500">{"\u2191"} 4.1% vs last month</div>
        </Card>
        <Card>
          <div className="text-[12.5px] text-slate-500">User growth rate</div>
          <div className="mt-0.5 text-[19px] font-bold text-slate-900">6.9%</div>
          <div className="mt-1 text-[12px] font-medium text-emerald-500">{"\u2191"} month over month</div>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h2 className="mb-3 text-[15px] font-semibold text-slate-800">User Growth</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="userFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f1f4" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={2.5} fill="url(#userFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 text-[15px] font-semibold text-slate-800">Volume by Method</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeByMethod} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f1f4" />
                <XAxis dataKey="method" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtY} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => `\u20a3${(v / 1000000).toFixed(2)}M`} />
                <Bar dataKey="volume" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
}

// ================================================================
// Exchange page
// ================================================================

function ExchangePage() {
  const [channels, setChannels] = useState(initialExchangeChannels.map((c) => ({ ...c, updated: "02:40 AM" })));
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [editingChannel, setEditingChannel] = useState(null);
  const [draftRate, setDraftRate] = useState("");
  const [history, setHistory] = useState([
    { channel: "Alipay", from: 91.10, to: 91.40, time: "Yesterday" },
    { channel: "Bank Transfer", from: 91.80, to: 91.60, time: "2 days ago" },
  ]);

  const startEdit = (c) => { setEditingChannel(c.channel); setDraftRate(String(c.rate)); };
  const saveRate = (channel) => {
    const n = parseFloat(draftRate);
    if (!isNaN(n)) {
      setChannels((prev) => {
        const old = prev.find((c) => c.channel === channel);
        setHistory((h) => [{ channel, from: old.rate, to: n, time: "Just now" }, ...h].slice(0, 5));
        return prev.map((c) => (c.channel === channel ? { ...c, rate: n, updated: "Just now" } : c));
      });
    }
    setEditingChannel(null);
  };

  return (
    <>
      <PageHeader title="Exchange Rates" subtitle="Manage RMB conversion rates across channels" />
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-800">Channels</h2>
            <ToggleSwitch checked={autoUpdate} onChange={setAutoUpdate} label="Auto-update from market" />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11.5px] text-slate-400">
                <th className="pb-2 font-medium">Channel</th>
                <th className="pb-2 font-medium">Rate (1 RMB)</th>
                <th className="pb-2 font-medium">Last Updated</th>
                <th className="pb-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((r) => (
                <tr key={r.channel} className="border-t border-slate-100">
                  <td className="py-2.5 text-[13px] text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${r.iconBg} ${r.iconFg}`}>
                        <r.icon size={12} />
                      </span>
                      {r.channel}
                    </div>
                  </td>
                  <td className="py-2.5 text-[13px] font-medium text-slate-800">
                    {editingChannel === r.channel ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          value={draftRate}
                          onChange={(e) => setDraftRate(e.target.value)}
                          className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-[12.5px] outline-none focus:border-violet-400"
                        />
                        <span className="text-[12px] text-slate-400">FCFA</span>
                      </div>
                    ) : (
                      `${r.rate.toFixed(2)} FCFA`
                    )}
                  </td>
                  <td className="py-2.5 text-[12.5px] text-slate-400">{r.updated}</td>
                  <td className="py-2.5 text-right">
                    {editingChannel === r.channel ? (
                      <button onClick={() => saveRate(r.channel)} className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1 text-[12px] font-semibold text-white hover:bg-violet-700">
                        <Save size={12} /> Save
                      </button>
                    ) : (
                      <button onClick={() => startEdit(r)} className="inline-flex items-center gap-1 rounded-lg bg-violet-50 px-2.5 py-1 text-[12px] font-semibold text-violet-600 hover:bg-violet-100">
                        <Pencil size={12} /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <h2 className="mb-3 text-[15px] font-semibold text-slate-800">Recent Rate Changes</h2>
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-[13px] text-slate-400">No changes yet</div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="flex items-center justify-between text-[13px]">
                  <div>
                    <div className="font-medium text-slate-700">{h.channel}</div>
                    <div className="text-[12px] text-slate-400">{h.time}</div>
                  </div>
                  <div className="text-right text-[12.5px]">
                    <span className="text-slate-400 line-through">{h.from.toFixed(2)}</span>{" "}
                    <span className="font-semibold text-slate-800">{h.to.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

// ================================================================
// Security page
// ================================================================

function SecurityPage() {
  const [require2FA, setRequire2FA] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [ipAllowlistEnabled, setIpAllowlistEnabled] = useState(false);
  const [ipList, setIpList] = useState(["197.234.5.2", "41.202.1.10"]);
  const [newIp, setNewIp] = useState("");
  const [sessions, setSessions] = useState(initialSessions);

  const addIp = () => {
    if (newIp.trim()) { setIpList((p) => [...p, newIp.trim()]); setNewIp(""); }
  };
  const removeIp = (ip) => setIpList((p) => p.filter((i) => i !== ip));
  const revokeSession = (id) => setSessions((p) => p.filter((s) => s.id !== id));

  return (
    <>
      <PageHeader title="Security" subtitle="Access controls, alerts, and active admin sessions" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 text-[15px] font-semibold text-slate-800">Access Controls</h2>
            <div className="space-y-4">
              <ToggleSwitch checked={require2FA} onChange={setRequire2FA} label="Require 2FA for admins" sub="Applies to all admin roles" />
              <ToggleSwitch checked={emailAlerts} onChange={setEmailAlerts} label="Email alerts on suspicious login" sub="Sent to Super Admins" />
              <ToggleSwitch checked={ipAllowlistEnabled} onChange={setIpAllowlistEnabled} label="IP allowlist" sub="Restrict admin panel access" />
            </div>
            {ipAllowlistEnabled && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="mb-2 flex gap-2">
                  <input
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    placeholder="Add IP address..."
                    className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12.5px] outline-none focus:border-violet-400"
                  />
                  <button onClick={addIp} className="rounded-lg bg-violet-50 px-3 py-1.5 text-[12.5px] font-semibold text-violet-600 hover:bg-violet-100">Add</button>
                </div>
                <div className="space-y-1.5">
                  {ipList.map((ip) => (
                    <div key={ip} className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 text-[12.5px] text-slate-600">
                      {ip}
                      <button onClick={() => removeIp(ip)} className="text-slate-400 hover:text-rose-500"><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
          <Card>
            <h2 className="mb-2 text-[15px] font-semibold text-slate-800">Security Alerts</h2>
            <div className="space-y-1">
              {securityAlerts.map((a, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-1.5 py-2.5 hover:bg-slate-50">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${a.iconBg} ${a.iconFg} shrink-0`}>
                    <a.icon size={15} />
                  </span>
                  <span className="flex-1 text-[13px] text-slate-700">{a.text}</span>
                  <span className="text-[12px] text-slate-400 shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card className="h-fit">
          <h2 className="mb-3 text-[15px] font-semibold text-slate-800">Active Sessions</h2>
          <div className="space-y-2">
            {sessions.length === 0 ? (
              <div className="text-[13px] text-slate-400">No active sessions</div>
            ) : (
              sessions.map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 shrink-0">
                    <Monitor size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-slate-700">{s.device}</div>
                    <div className="text-[12px] text-slate-400">{s.location} \u00b7 {s.lastActive}</div>
                  </div>
                  <button onClick={() => revokeSession(s.id)} className="shrink-0 rounded-lg bg-rose-50 px-2.5 py-1 text-[12px] font-semibold text-rose-600 hover:bg-rose-100">
                    Revoke
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

// ================================================================
// Notifications page
// ================================================================

function NotificationsPage() {
  const [matrix, setMatrix] = useState(initialNotifMatrix);

  const toggle = (category, channel) => {
    setMatrix((prev) => ({
      ...prev,
      [category]: { ...prev[category], [channel]: !prev[category][channel] },
    }));
  };

  return (
    <>
      <PageHeader title="Notifications" subtitle="Configure which alerts go out and where" />
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <h2 className="mb-3 text-[15px] font-semibold text-slate-800">Delivery Preferences</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11.5px] text-slate-400">
                <th className="pb-2 font-medium">Category</th>
                {notificationChannels.map((ch) => (
                  <th key={ch} className="pb-2 text-center font-medium">{ch}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notificationCategories.map((cat) => (
                <tr key={cat} className="border-t border-slate-100">
                  <td className="py-3 text-[13px] font-medium text-slate-700">{cat}</td>
                  {notificationChannels.map((ch) => (
                    <td key={ch} className="py-3 text-center">
                      <button
                        onClick={() => toggle(cat, ch)}
                        className={`mx-auto flex h-5 w-9 items-center rounded-full transition-colors ${matrix[cat][ch] ? "bg-violet-600" : "bg-slate-200"}`}
                      >
                        <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${matrix[cat][ch] ? "translate-x-4" : "translate-x-0.5"}`} />
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <h2 className="mb-3 text-[15px] font-semibold text-slate-800">Recently Sent</h2>
          <div className="space-y-3">
            {sentNotifications.map((n, i) => (
              <div key={i} className="text-[13px]">
                <div className="text-slate-700">{n.text}</div>
                <div className="mt-0.5 text-[12px] text-slate-400">{n.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

// ================================================================
// Settings page
// ================================================================

function SettingsPage() {
  const [form, setForm] = useState({
    platformName: "RMBpay",
    supportEmail: "support@rmbpay.africa",
    currency: "FCFA",
    timezone: "Africa/Douala (GMT+1)",
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key, value) => { setForm((f) => ({ ...f, [key]: value })); setSaved(false); };

  return (
    <>
      <PageHeader title="Settings" subtitle="General platform configuration" />
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h2 className="mb-4 text-[15px] font-semibold text-slate-800">General</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-slate-500">Platform name</label>
              <input
                value={form.platformName}
                onChange={(e) => update("platformName", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-slate-500">Support email</label>
              <input
                value={form.supportEmail}
                onChange={(e) => update("supportEmail", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-slate-500">Default currency</label>
              <select
                value={form.currency}
                onChange={(e) => update("currency", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-violet-400"
              >
                {["FCFA", "RMB", "USD"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-slate-500">Timezone</label>
              <select
                value={form.timezone}
                onChange={(e) => update("timezone", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-violet-400"
              >
                {["Africa/Douala (GMT+1)", "Asia/Shanghai (GMT+8)", "UTC"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button
              onClick={() => setSaved(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-violet-600 py-2.5 text-[13px] font-semibold text-white hover:bg-violet-700"
            >
              {saved ? <><Check size={14} /> Saved</> : "Save changes"}
            </button>
          </div>
        </Card>
        <Card className="h-fit">
          <h2 className="mb-3 text-[15px] font-semibold text-slate-800">Platform Mode</h2>
          <ToggleSwitch
            checked={maintenanceMode}
            onChange={setMaintenanceMode}
            label="Maintenance mode"
            sub="Temporarily disable end-user access"
          />
          {maintenanceMode && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-orange-50 p-3 text-[12.5px] text-orange-700">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              Maintenance mode is on. End users will see a maintenance page until this is switched off.
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

// ================================================================
// Admin Roles page
// ================================================================

function AdminRolesPage() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Support");

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;
    setAdmins((prev) => [
      ...prev,
      { id: `A-${Math.floor(Math.random() * 900 + 100)}`, name: inviteEmail.split("@")[0], email: inviteEmail.trim(), role: inviteRole, lastActive: "Invited \u2014 pending" },
    ]);
    setInviteEmail("");
    setInviteOpen(false);
  };

  const removeAdmin = (id) => setAdmins((prev) => prev.filter((a) => a.id !== id));

  return (
    <>
      <PageHeader title="Admin Roles" subtitle={`${admins.length} admin accounts`} actionLabel="Invite Admin" actionIcon={UserPlus} onAction={() => setInviteOpen((v) => !v)} />
      {inviteOpen && (
        <Card className="mb-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-[12.5px] font-medium text-slate-500">Email address</label>
              <input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="name@rmbpay.africa"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-slate-500">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-violet-400"
              >
                {["Admin", "Support"].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button onClick={sendInvite} className="rounded-xl bg-violet-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-violet-700">
              Send invite
            </button>
          </div>
        </Card>
      )}
      <Card>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11.5px] text-slate-400">
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Email</th>
              <th className="pb-2 font-medium">Role</th>
              <th className="pb-2 font-medium">Last Active</th>
              <th className="pb-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-t border-slate-100">
                <td className="py-2.5 text-[13px] font-medium text-slate-700">{a.name}</td>
                <td className="py-2.5 text-[12.5px] text-slate-500">{a.email}</td>
                <td className="py-2.5">
                  <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${
                    a.role === "Super Admin" ? "bg-violet-100 text-violet-600" : a.role === "Admin" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                  }`}>
                    {a.role}
                  </span>
                </td>
                <td className="py-2.5 text-[12.5px] text-slate-400">{a.lastActive}</td>
                <td className="py-2.5 text-right">
                  {a.role !== "Super Admin" && (
                    <button onClick={() => removeAdmin(a.id)} className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-[12px] font-semibold text-rose-600 hover:bg-rose-100">
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// ================================================================
// Logs page
// ================================================================

function LogsPage() {
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [sort, setSort] = useState({ key: "time", dir: "desc" });

  const actionTypes = ["All", ...Array.from(new Set(auditLogs.map((l) => l.action)))];

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = auditLogs.filter((l) => {
      const matchesQuery = !q || l.admin.toLowerCase().includes(q) || l.target.toLowerCase().includes(q);
      const matchesAction = actionFilter === "All" || l.action === actionFilter;
      return matchesQuery && matchesAction;
    });
    const { key, dir } = sort;
    if (key) {
      rows = [...rows].sort((a, b) => {
        if (a[key] < b[key]) return dir === "asc" ? -1 : 1;
        if (a[key] > b[key]) return dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [query, actionFilter, sort]);

  return (
    <>
      <PageHeader title="Audit Logs" subtitle="Every admin action, in order" actionLabel="Export CSV" actionIcon={Download} onAction={() => {}} />
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <SearchBox value={query} onChange={setQuery} placeholder="Search by admin or target..." />
          <FilterSelect value={actionFilter} onChange={setActionFilter} options={actionTypes} />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11.5px] text-slate-400">
              <SortHeader label="Time" active={sort.key === "time"} dir={sort.dir} onClick={() => toggleSort(setSort, sort, "time")} />
              <th className="pb-2 font-medium">Admin</th>
              <th className="pb-2 font-medium">Action</th>
              <th className="pb-2 font-medium">Target</th>
              <th className="pb-2 font-medium text-right">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <EmptyRow colSpan={5} text="No log entries match your filters" />
            ) : (
              visible.map((l, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="py-2.5 text-[12.5px] text-slate-400">{l.time}</td>
                  <td className="py-2.5 text-[13px] font-medium text-slate-700">{l.admin}</td>
                  <td className="py-2.5 text-[13px] text-slate-600">{l.action}</td>
                  <td className="py-2.5 text-[13px] text-slate-600">{l.target}</td>
                  <td className="py-2.5 text-right text-[12.5px] text-slate-400">{l.ip}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// ================================================================
// Page registry
// ================================================================

const pageRegistry = {
  Overview: OverviewPage,
  Users: UsersPage,
  Payments: PaymentsPage,
  Wallets: WalletsPage,
  Cards: CardsPage,
  KYC: KYCPage,
  Analytics: AnalyticsPage,
  Exchange: ExchangePage,
  Security: SecurityPage,
  Notifications: NotificationsPage,
  Settings: SettingsPage,
  "Admin Roles": AdminRolesPage,
  Logs: LogsPage,
};

// ================================================================
// Main component
// ================================================================

export default function RMBPayDashboard() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [signedOut, setSignedOut] = useState(false);
  const [language, setLanguage] = useState(languages[0]);
  const [langOpen, setLangOpen] = useState(false);

  const globalResults = React.useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    const pool = [
      ...liveTransactions.map((t) => ({ ...t, user: t.name })),
      ...recentTransactions,
    ];
    const seen = new Set();
    return pool
      .filter((t) => {
        const key = `${t.user}-${t.time}-${t.amount}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return (
          t.user.toLowerCase().includes(q) ||
          t.method.toLowerCase().includes(q) ||
          t.amount.toLowerCase().includes(q)
        );
      })
      .slice(0, 6);
  }, [globalSearch]);

  if (signedOut) {
    return (
      <div className="flex h-full min-h-[900px] w-full items-center justify-center bg-slate-50" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
        <div className="w-80 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mb-3 flex justify-center"><Logo /></div>
          <h2 className="text-[15px] font-semibold text-slate-800">You've been signed out</h2>
          <p className="mt-1 text-[13px] text-slate-500">Sign back in to access the admin dashboard.</p>
          <button
            onClick={() => setSignedOut(false)}
            className="mt-4 w-full rounded-xl bg-violet-600 py-2.5 text-[13px] font-semibold text-white hover:bg-violet-700"
          >
            Sign back in
          </button>
        </div>
      </div>
    );
  }

  const ActivePage = pageRegistry[activeNav] || OverviewPage;

  return (
    <div className="flex h-full min-h-[900px] w-full bg-slate-50 text-slate-800" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-3.5 py-5">
        <div className="mb-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => {
            const active = item.label === activeNav;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  active
                    ? "bg-violet-50 text-violet-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Icon size={17} strokeWidth={2} className={active ? "text-violet-600" : "text-slate-400"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-violet-100 bg-violet-50/60 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-500 shrink-0">
            <User size={18} />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-1 text-[13px] font-semibold text-slate-800">
              Admin
              <ShieldCheck size={13} className="text-violet-500 fill-violet-100" />
            </div>
            <div className="text-[11.5px] text-slate-400">Super Admin</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        {/* Top header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-3.5">
          <div className="flex items-center gap-6">
            <Logo />
            <div className="relative w-80">
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2.5">
              <Search size={16} className="text-slate-400" />
              <input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search users, methods, amounts..."
                className="w-full bg-transparent text-[13.5px] text-slate-600 placeholder:text-slate-400 outline-none"
              />
              {globalSearch && (
                <button onClick={() => setGlobalSearch("")} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
            {globalSearch && (
              <div className="absolute left-0 top-11 z-20 w-full rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                {globalResults.length === 0 ? (
                  <div className="px-2.5 py-3 text-center text-[12.5px] text-slate-400">No matches found</div>
                ) : (
                  globalResults.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedTx(t); setGlobalSearch(""); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50"
                    >
                      <MethodTag name={t.method} />
                      <span className="flex-1 truncate text-[13px] text-slate-700">{t.user}</span>
                      <span className="text-[12.5px] font-medium text-slate-500">{t.amount}</span>
                    </button>
                  ))
                )}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <button
                onClick={() => { setLangOpen((v) => !v); setNotifOpen(false); setProfileOpen(false); }}
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-100"
              >
                <Globe size={16} className="text-slate-400" />
                {language.code}
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-11 z-20 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLanguage(l); setLangOpen(false); }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] ${
                        l.code === language.code ? "bg-violet-50 text-violet-600 font-medium" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {l.label}
                      {l.code === language.code && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); setLangOpen(false); }}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
              >
                <Bell size={19} />
                <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  12
                </span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-11 z-20 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-slate-700">Notifications</span>
                    <button
                      onClick={() => { setActiveNav("Notifications"); setNotifOpen(false); }}
                      className="text-[11.5px] font-medium text-violet-600 hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                  {securityAlerts.slice(0, 3).map((a, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg px-2 py-2 text-[12.5px] hover:bg-slate-50">
                      <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${a.iconBg} ${a.iconFg} shrink-0`}>
                        <a.icon size={12} />
                      </span>
                      <div>
                        <div className="text-slate-700">{a.text}</div>
                        <div className="text-slate-400 text-[11px]">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); setLangOpen(false); }}
                className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-500">
                  <User size={16} />
                </div>
                <span className="text-[13.5px] font-medium text-slate-700">Admin</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                  <button
                    onClick={() => { setActiveNav("Settings"); setProfileOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-slate-600 hover:bg-slate-50"
                  >
                    <Settings size={14} /> Account settings
                  </button>
                  <button
                    onClick={() => { setSignedOut(true); setProfileOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-rose-500 hover:bg-rose-50"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          <ActivePage setSelectedTx={setSelectedTx} setActiveNav={setActiveNav} />
        </div>
      </div>

      {/* Selected transaction modal (shared across pages) */}
      {selectedTx && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/30"
          onClick={() => setSelectedTx(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-80 rounded-2xl bg-white p-5 shadow-xl"
          >
            <h3 className="mb-3 text-[15px] font-semibold text-slate-800">Transaction detail</h3>
            <div className="space-y-2 text-[13px] text-slate-600">
              <div className="flex justify-between"><span>User</span><span className="font-medium text-slate-800">{selectedTx.name || selectedTx.user}</span></div>
              <div className="flex justify-between"><span>Method</span><MethodTag name={selectedTx.method} /></div>
              <div className="flex justify-between"><span>Amount</span><span className="font-medium text-slate-800">{selectedTx.amount}</span></div>
              <div className="flex justify-between"><span>Time</span><span className="text-slate-400">{selectedTx.time}</span></div>
            </div>
            <button
              onClick={() => setSelectedTx(null)}
              className="mt-4 w-full rounded-xl bg-violet-50 py-2 text-[13px] font-semibold text-violet-600 hover:bg-violet-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
