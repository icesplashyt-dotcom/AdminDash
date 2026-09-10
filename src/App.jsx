import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldCheck, LogOut, Users, FileCheck, Loader2, X, Check, Ban,
  ChevronRight, Wallet, CreditCard, Clock, AlertCircle,
} from 'lucide-react';
import { supabase } from './supabaseClient';

// ---------- helpers ----------

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString();
}

function fmtRMB(n) {
  if (n === null || n === undefined) return '—';
  return `¥${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function StatusPill({ status }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-emerald-100 text-emerald-800',
    processing: 'bg-blue-100 text-blue-800',
    verifying: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

// ---------- login ----------

function LoginScreen({ onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    onSignedIn(data.session);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="text-indigo-600" size={28} />
          <h1 className="text-lg font-bold text-gray-900">RMBpay Admin</h1>
        </div>
        {error && (
          <div className="mb-4 flex items-start gap-2 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Sign in
        </button>
      </form>
    </div>
  );
}

// ---------- user detail drawer ----------

function UserDetailDrawer({ userId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);

    async function load() {
      const [{ data: profileData }, { data: walletData }, { data: txData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('wallets').select('*').eq('user_id', userId).single(),
        supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      ]);
      if (cancelled) return;
      setProfile(profileData || null);
      setWallet(walletData || null);
      setTransactions(txData || []);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-900">User details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : !profile ? (
          <div className="p-5 text-sm text-gray-500">Profile not found.</div>
        ) : (
          <div className="p-5 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-gray-900">{profile.full_name || 'Unnamed user'}</h3>
                {profile.kyc_verified ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <ShieldCheck size={12} /> Verified
                  </span>
                ) : (
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Not verified</span>
                )}
              </div>
              <p className="text-xs text-gray-400">{profile.rmb_id}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoField label="Phone" value={profile.phone} />
              <InfoField label="Account type" value={profile.account_type} />
              <InfoField label="Date of birth" value={profile.dob} />
              <InfoField label="Nationality" value={profile.nationality} />
              <InfoField label="Joined" value={fmtDate(profile.created_at)} />
              <InfoField label="Referral code" value={profile.referral_code} />
              <InfoField label="Address" value={profile.address} full />
            </div>

            <div className="flex items-center gap-2 bg-indigo-50 rounded-lg px-4 py-3">
              <Wallet size={18} className="text-indigo-600" />
              <div>
                <p className="text-xs text-indigo-500">Wallet balance</p>
                <p className="font-semibold text-indigo-900">{fmtRMB(wallet?.balance_rmb)}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CreditCard size={15} className="text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-700">Transactions ({transactions.length})</h4>
              </div>
              {transactions.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">No transactions yet.</p>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-gray-800 capitalize">{tx.type.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={11} /> {fmtDate(tx.created_at)}
                        </p>
                        {tx.counterparty_name && (
                          <p className="text-xs text-gray-400">with {tx.counterparty_name}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{fmtRMB(tx.amount_rmb)}</p>
                        <StatusPill status={tx.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoField({ label, value, full }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-gray-800">{value || '—'}</p>
    </div>
  );
}

// ---------- KYC review tab ----------

function KycReviewTab({ onSelectUser }) {
  const [filter, setFilter] = useState('pending');
  const [submissions, setSubmissions] = useState([]);
  const [profilesById, setProfilesById] = useState({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [imageUrls, setImageUrls] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('kyc_submissions').select('*').order('submitted_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data: subs, error } = await query;
    if (error) { setLoading(false); return; }

    const userIds = [...new Set((subs || []).map((s) => s.user_id))];
    let profileMap = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase.from('profiles').select('*').in('id', userIds);
      profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
    }
    setSubmissions(subs || []);
    setProfilesById(profileMap);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function getSignedUrl(path) {
    if (!path) return null;
    if (imageUrls[path]) return imageUrls[path];
    const { data } = await supabase.storage.from('kyc-documents').createSignedUrl(path, 600);
    if (data?.signedUrl) {
      setImageUrls((prev) => ({ ...prev, [path]: data.signedUrl }));
      return data.signedUrl;
    }
    return null;
  }

  async function decide(submissionId, decision) {
    setBusyId(submissionId);
    const { error } = await supabase.rpc('review_kyc_submission', {
      p_submission_id: submissionId,
      p_decision: decision,
    });
    setBusyId(null);
    if (error) {
      alert(`Failed to update: ${error.message}`);
      return;
    }
    load();
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
              filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="animate-spin" size={22} />
        </div>
      ) : submissions.length === 0 ? (
        <p className="text-sm text-gray-400 py-10 text-center">No {filter !== 'all' ? filter : ''} submissions.</p>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => {
            const profile = profilesById[sub.user_id];
            return (
              <div key={sub.id} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 cursor-pointer" onClick={() => onSelectUser(sub.user_id)}>
                    <p className="font-semibold text-gray-900 hover:text-indigo-600 flex items-center gap-1">
                      {profile?.full_name || 'Unknown user'} <ChevronRight size={14} />
                    </p>
                    <p className="text-xs text-gray-400">{profile?.rmb_id} · {profile?.phone}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">
                      {sub.doc_type?.replace('_', ' ')} · submitted {fmtDate(sub.submitted_at)}
                    </p>
                  </div>
                  <StatusPill status={sub.status} />
                </div>

                <div className="flex gap-2 mt-3">
                  <DocThumb path={sub.front_image_path} label="Front" getUrl={getSignedUrl} />
                  {sub.back_image_path && <DocThumb path={sub.back_image_path} label="Back" getUrl={getSignedUrl} />}
                </div>

                {sub.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => decide(sub.id, 'approved')}
                      disabled={busyId === sub.id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition"
                    >
                      {busyId === sub.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve
                    </button>
                    <button
                      onClick={() => decide(sub.id, 'rejected')}
                      disabled={busyId === sub.id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-700 text-sm font-medium py-2 rounded-lg transition"
                    >
                      <Ban size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DocThumb({ path, label, getUrl }) {
  const [url, setUrl] = useState(null);
  useEffect(() => { getUrl(path).then(setUrl); }, [path]);
  return (
    <div className="flex-1">
      <p className="text-[10px] text-gray-400 mb-1">{label}</p>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer">
          <img src={url} alt={label} className="w-full h-24 object-cover rounded-lg border border-gray-100" />
        </a>
      ) : (
        <div className="w-full h-24 rounded-lg bg-gray-50 animate-pulse" />
      )}
    </div>
  );
}

// ---------- users tab ----------

function UsersTab({ onSelectUser }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setProfiles(data || []); setLoading(false); });
  }, []);

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.full_name?.toLowerCase().includes(q) || p.rmb_id?.toLowerCase().includes(q) || p.phone?.includes(q);
  });

  return (
    <div>
      <input
        placeholder="Search by name, RMB ID, or phone…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="animate-spin" size={22} />
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100 overflow-hidden">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectUser(p.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left transition"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{p.full_name || 'Unnamed user'}</p>
                <p className="text-xs text-gray-400">{p.rmb_id} · {p.phone}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {p.kyc_verified ? (
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Verified</span>
                ) : (
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Unverified</span>
                )}
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </button>
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-10">No users found.</p>}
        </div>
      )}
    </div>
  );
}

// ---------- root app ----------

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [isAdmin, setIsAdmin] = useState(null);
  const [tab, setTab] = useState('kyc');
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(session === null ? false : null); return; }
    supabase.from('admin_roles').select('role').eq('user_id', session.user.id).maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (session === undefined || (session && isAdmin === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onSignedIn={setSession} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4 px-4 text-center">
        <AlertCircle className="text-red-500" size={32} />
        <p className="text-gray-700 font-medium">This account isn't an admin on RMBpay.</p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-indigo-600 font-medium"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-indigo-600" size={22} />
          <h1 className="font-bold text-gray-900">RMBpay Admin</h1>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
        >
          <LogOut size={15} /> Sign out
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-5">
          <TabButton icon={FileCheck} label="KYC Review" active={tab === 'kyc'} onClick={() => setTab('kyc')} />
          <TabButton icon={Users} label="Users" active={tab === 'users'} onClick={() => setTab('users')} />
        </div>

        {tab === 'kyc' && <KycReviewTab onSelectUser={setSelectedUserId} />}
        {tab === 'users' && <UsersTab onSelectUser={setSelectedUserId} />}
      </div>

      <UserDetailDrawer userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
        active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
      }`}
    >
      <Icon size={15} /> {label}
    </button>
  );
}
