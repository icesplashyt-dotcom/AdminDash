import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck,
  BarChart3, Users, CheckCircle2,
} from "lucide-react";

function Logo({ light }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-lg shrink-0"
        style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)" }}
      >
        ¥
      </div>
      <span className="text-[22px] font-extrabold tracking-tight">
        <span className={light ? "text-white" : "text-slate-900"}>RMB</span>
        <span className="text-violet-500">Pay</span>
      </span>
    </div>
  );
}

const features = [
  { icon: ShieldCheck, title: "Secure & Protected", desc: "Your data is encrypted and protected by advanced security" },
  { icon: BarChart3, title: "Real-time Overview", desc: "Monitor transactions and activities in real-time" },
  { icon: Users, title: "User Management", desc: "Manage users, permissions and system access" },
];

async function checkIsAdmin(userId) {
  const { data } = await supabase.from("admin_roles").select("role").eq("user_id", userId).maybeSingle();
  return !!data;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    if (!(await checkIsAdmin(data.user.id))) {
      setError("This account does not have admin access.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    setLoading(false);
  }

  async function handleForgotPassword() {
    setError("");
    setInfo("");
    if (!email) {
      setError("Enter your email above first, then click Forgot password.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
    if (resetError) setError(resetError.message);
    else setInfo("Password reset link sent — check your inbox.");
  }

  async function handleSendOtp() {
    setError("");
    setInfo("");
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    setLoading(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (otpError) setError(otpError.message);
    else {
      setOtpSent(true);
      setInfo("We sent a 6-digit code to your email.");
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: "email",
    });
    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }
    if (!(await checkIsAdmin(data.user.id))) {
      setError("This account does not have admin access.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left panel */}
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden px-12 py-10 text-white lg:flex"
        style={{ background: "linear-gradient(160deg,#4c1d95 0%,#5b21b6 45%,#6d28d9 100%)" }}
      >
        <div>
          <div className="mb-14">
            <Logo light />
          </div>
          <h1 className="mb-4 text-[38px] font-extrabold leading-tight">
            Welcome back,<br />Admin 👋
          </h1>
          <p className="mb-10 max-w-sm text-[15px] text-violet-200">
            Sign in to access the RMBPay Administration Portal
          </p>

          <div className="space-y-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <f.icon size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-[14.5px] font-semibold text-white">{f.title}</div>
                  <div className="text-[13px] text-violet-200">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simple decorative illustration */}
        <div className="relative mt-10 flex items-center justify-center opacity-90">
          <svg viewBox="0 0 320 160" className="w-full max-w-md">
            <rect x="40" y="30" width="180" height="110" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
            <rect x="55" y="45" width="150" height="70" rx="4" fill="rgba(255,255,255,0.12)" />
            <path d="M55 100 L90 75 L115 90 L150 60" stroke="#c4b5fd" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="180" cy="65" r="16" fill="rgba(255,255,255,0.15)" />
            <path d="M173 65l5 5 9-10" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="235" y="60" width="45" height="65" rx="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" />
            <line x1="235" y1="80" x2="280" y2="80" stroke="rgba(255,255,255,0.25)" />
            <line x1="235" y1="100" x2="280" y2="100" stroke="rgba(255,255,255,0.25)" />
            <path d="M20 140c10-25 35-25 45 0" stroke="#c4b5fd" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="42" cy="118" r="14" fill="#8b5cf6" />
            <path d="M35 118l5 5 9-10" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <Logo />
          </div>
          <div className="mb-8 hidden flex-col items-center text-center lg:flex">
            <Logo />
          </div>

          <h2 className="mb-1.5 text-center text-[22px] font-bold text-slate-900">Sign in to your account</h2>
          <p className="mb-8 text-center text-[13.5px] text-slate-400">
            Enter your admin credentials to continue
          </p>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-[12.5px] text-rose-600">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          {info && !error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-[12.5px] text-emerald-600">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
              {info}
            </div>
          )}

          {!otpMode ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Email address</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-3 focus-within:border-violet-400">
                  <Mail size={17} className="text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rmbpay.com"
                    className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Password</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-3 focus-within:border-violet-400">
                  <Lock size={17} className="text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[13px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-400"
                  />
                  Remember this device
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-[13px] font-medium text-violet-600 hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-[14px] font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"} {!loading && <ArrowRight size={16} />}
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[12px] text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={() => { setOtpMode(true); setError(""); setInfo(""); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3.5 text-[13.5px] font-medium text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheck size={16} className="text-slate-500" /> Sign in with OTP (Backup)
              </button>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleVerifyOtp : (e) => { e.preventDefault(); handleSendOtp(); }} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Email address</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-3 focus-within:border-violet-400">
                  <Mail size={17} className="text-slate-400" />
                  <input
                    type="email"
                    required
                    disabled={otpSent}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rmbpay.com"
                    className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-slate-400 disabled:text-slate-400"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700">6-digit code</label>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-3 focus-within:border-violet-400">
                    <ShieldCheck size={17} className="text-slate-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-transparent text-[13.5px] tracking-widest outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-[14px] font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {loading ? "Please wait..." : otpSent ? "Verify & Sign In" : "Send code"}
              </button>

              <button
                type="button"
                onClick={() => { setOtpMode(false); setOtpSent(false); setOtpCode(""); setError(""); setInfo(""); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3.5 text-[13.5px] font-medium text-slate-700 hover:bg-slate-50"
              >
                Back to password sign in
              </button>
            </form>
          )}

          <div className="mt-8 flex items-center gap-2.5 rounded-xl bg-violet-50 px-4 py-3.5">
            <Lock size={15} className="text-violet-500 shrink-0" />
            <p className="text-[12.5px] text-violet-700">
              Your connection is encrypted and protected by RMBPay Security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
