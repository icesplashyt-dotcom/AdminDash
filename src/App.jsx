import { useState } from "react";
import {
  ShieldCheck, BarChart3, Users, Mail, Lock, Eye, ArrowRight,
  Home, CreditCard, Wallet, IdCard, LayoutGrid, TrendingUp,
  ArrowLeftRight, Bell, Settings, UserCog, FileText, User,
  CheckCircle2, Search, RefreshCw, Calendar, DollarSign,
  AlertTriangle, ChevronDown, Clock, Info, XCircle, Smartphone,
  MessageCircle, Landmark,
} from "lucide-react";

export default function App() {
  const [screen, setScreen] = useState("login");

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif", color: "#1E1B2E" }}>
      <style>{css}</style>
      {screen === "login" ? (
        <LoginScreen onSignIn={() => setScreen("dashboard")} />
      ) : (
        <DashboardScreen />
      )}
    </div>
  );
}

function LoginScreen({ onSignIn }) {
  const [showPw, setShowPw] = useState(false);
  return (
    <div id="login-screen">
      <div className="login-topbar">
        <div className="logo-badge">¥</div>
        <div className="logo-text">RMB<span>Pay</span></div>
      </div>
      <div className="login-body">
        <div className="login-left">
          <h1>Welcome back,<br />Admin 👋</h1>
          <p className="lede">Sign in to access the RMBPay Administration Portal</p>

          <Feature icon={<ShieldCheck size={18} />} title="Secure & Protected" text="Your data is encrypted and protected by advanced security" />
          <Feature icon={<BarChart3 size={18} />} title="Real-time Overview" text="Monitor transactions and activities in real-time" />
          <Feature icon={<Users size={18} />} title="User Management" text="Manage users, permissions and system access" />
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="lc-logo">
              <div className="logo-badge">¥</div>
              <div className="logo-text">RMB<span>Pay</span></div>
            </div>
            <h2>Sign in to your account</h2>
            <p className="sub">Enter your admin credentials to continue</p>

            <form onSubmit={(e) => { e.preventDefault(); onSignIn(); }}>
              <div className="field">
                <label>Email address</label>
                <div className="input-wrap">
                  <Mail size={15} className="leading" />
                  <input type="email" defaultValue="admin@rmbpay.com" />
                </div>
              </div>
              <div className="field">
                <label>Password</label>
                <div className="input-wrap">
                  <Lock size={15} className="leading" />
                  <input type={showPw ? "text" : "password"} defaultValue="password123" />
                  <Eye size={15} className="trailing" onClick={() => setShowPw((s) => !s)} />
                </div>
              </div>
              <div className="row-between">
                <label className="remember"><input type="checkbox" defaultChecked /> Remember this device</label>
                <a className="forgot" href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
              </div>
              <button type="submit" className="btn-primary">Sign In <ArrowRight size={16} /></button>
            </form>

            <div className="divider">or</div>
            <button className="btn-otp" type="button"><ShieldCheck size={16} /> Sign in with OTP (Backup)</button>

            <div className="secure-note">
              <Lock size={15} />
              <div>Your connection is encrypted and protected by RMBPay Security</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature">
      <div className="ficon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div id="dashboard-screen" className="active">
      <div className="sidebar">
        <div className="brand">
          <div className="logo-badge">R</div>
          <div className="logo-text">RMB<span style={{ color: "var(--purple)" }}>pay</span></div>
        </div>
        <NavItem icon={<Home size={15} />} label="Overview" active />
        <NavItem icon={<Users size={15} />} label="Users" />
        <NavItem icon={<CreditCard size={15} />} label="Payments" />
        <NavItem icon={<Wallet size={15} />} label="Wallets" />
        <NavItem icon={<IdCard size={15} />} label="Cards" />
        <NavItem icon={<LayoutGrid size={15} />} label="KYC" />
        <NavItem icon={<TrendingUp size={15} />} label="Analytics" />
        <NavItem icon={<ArrowLeftRight size={15} />} label="Exchange" />
        <NavItem icon={<ShieldCheck size={15} />} label="Security" />
        <NavItem icon={<Bell size={15} />} label="Notifications" />
        <NavItem icon={<Settings size={15} />} label="Settings" />
        <NavItem icon={<UserCog size={15} />} label="Admin Roles" />
        <NavItem icon={<FileText size={15} />} label="Logs" />
        <div className="sidebar-bottom">
          <div className="avatar-sm"><User size={14} /></div>
          <div>
            <div className="name">Admin <CheckCircle2 size={12} style={{ color: "var(--blue)" }} /></div>
            <div className="role">Super Admin</div>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <div className="search-box"><Search size={14} /> Search anything...</div>
          <div className="icon-btn"><Bell size={16} /><div className="badge">12</div></div>
          <div className="admin-chip"><User size={14} style={{ color: "var(--purple)" }} /> Admin</div>
        </div>

        <div className="page-head">
          <h1>Good morning, Admin 👋</h1>
          <div className="head-tags">
            <div className="tag online"><span className="dot" /> System Online</div>
            <div className="tag processing"><RefreshCw size={13} /> Transactions processing</div>
            <div className="tag date"><Calendar size={13} /> May 25, 2024</div>
          </div>
        </div>

        <div className="stats-row">
          <StatCard icon={<Wallet size={15} />} bg="bg-purple" label="Total Balance" value="₣48.2M" sub="≈ ¥512,300.00" />
          <StatCard icon={<Users size={15} />} bg="bg-blue" label="Total Users" value="8,492" delta="↑ 12.5% this week" up />
          <StatCard icon={<ArrowLeftRight size={15} />} bg="bg-green" label="Total Transactions" value="1,284" delta="↑ 8.3% this week" up />
          <StatCard icon={<DollarSign size={15} />} bg="bg-orange" label="Today's Volume" value="₣3.28M" delta="↑ 18.7% vs yesterday" up />
          <StatCard icon={<AlertTriangle size={15} />} bg="bg-red" label="Failed Transactions" value="24" delta="↓ 4.2% vs yesterday" />
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-head">
              <h2>Transaction Volume</h2>
              <div className="tag date">This Week <ChevronDown size={12} /></div>
            </div>
            <div className="chart-wrap">
              <svg className="chart" viewBox="0 0 700 230" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C5DD3" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#6C5DD3" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="#EFEEF6" strokeWidth="1">
                  <line x1="0" y1="10" x2="700" y2="10" />
                  <line x1="0" y1="52" x2="700" y2="52" />
                  <line x1="0" y1="94" x2="700" y2="94" />
                  <line x1="0" y1="136" x2="700" y2="136" />
                  <line x1="0" y1="178" x2="700" y2="178" />
                  <line x1="0" y1="220" x2="700" y2="220" />
                </g>
                <path d="M0,220 L0,178 L116,146 L233,94 L350,73 L466,157 L583,189 L700,168 L700,220 Z" fill="url(#areaFill)" />
                <polyline points="0,178 116,146 233,94 350,73 466,157 583,189 700,168" fill="none" stroke="#6C5DD3" strokeWidth="2.5" />
                <g fill="#6C5DD3">
                  <circle cx="0" cy="178" r="4" /><circle cx="116" cy="146" r="4" /><circle cx="233" cy="94" r="4" />
                  <circle cx="350" cy="73" r="4" /><circle cx="466" cy="157" r="4" /><circle cx="583" cy="189" r="4" /><circle cx="700" cy="168" r="4" />
                </g>
              </svg>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--sub)", marginTop: 6 }}>
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h2>Live Transactions</h2><a className="view-all">View all</a></div>
            <div className="txn-list">
              <TxnRow initials="AT" name="Amina T." method="MTN" methodColor="orange" amount="+50,000 FCFA" up time="02:44 AM" />
              <TxnRow initials="DK" name="David K." method="Orange" methodColor="orange" amount="+25,000 FCFA" up time="02:43 AM" />
              <TxnRow initials="WL" name="Wei L." method="Alipay" methodColor="blue" amount="-120 ¥" time="02:42 AM" />
              <TxnRow initials="JD" name="John D." method="Orange" methodColor="orange" amount="+20,000 FCFA" up time="02:41 AM" />
              <TxnRow initials="ZR" name="Zhang R." method="WeChat" methodColor="green" amount="-300 ¥" time="02:40 AM" />
            </div>
            <div className="view-all-link">View all transactions <ArrowRight size={13} /></div>
          </div>
        </div>

        <div className="grid-3">
          <div className="card">
            <div className="card-head"><h2>Payments Overview</h2><a className="view-all">View all</a></div>
            <table>
              <thead><tr><th>Method</th><th>Success</th><th>Amount</th><th>Trend</th></tr></thead>
              <tbody>
                <PaymentRow method="MTN Mobile Money" success="98.5%" amount="₣1.25M" points="0,14 8,10 16,12 24,6 32,8 44,2" color="#22B573" />
                <PaymentRow method="Orange Money" success="97.8%" amount="₣842K" points="0,10 8,12 16,8 24,10 32,6 44,4" color="#22B573" />
                <PaymentRow method="Alipay" success="99.2%" amount="¥210,300" points="0,12 8,8 16,10 24,4 32,6 44,2" color="#22B573" />
                <PaymentRow method="WeChat Pay" success="98.9%" amount="¥185,220" points="0,8 8,10 16,6 24,8 32,4 44,6" color="#22B573" />
                <PaymentRow method="Bank Transfer" success="96.3%" amount="₣392K" points="0,6 8,10 16,8 24,14 32,10 44,16" color="#EF4444" />
                <PaymentRow method="Card Payments" success="97.1%" amount="₣512K" points="0,10 8,6 16,8 24,4 32,8 44,3" color="#22B573" />
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-head"><h2>RMB Exchange Rates</h2><a className="view-all">Manage Rates</a></div>
            <table>
              <thead><tr><th>Channel</th><th>Rate (1 RMB)</th><th>Last Updated</th></tr></thead>
              <tbody>
                <tr><td>Alipay</td><td>91.40 FCFA</td><td>02:40 AM</td></tr>
                <tr><td>WeChat</td><td>91.30 FCFA</td><td>02:40 AM</td></tr>
                <tr><td>Cash RMB</td><td>90.80 FCFA</td><td>02:40 AM</td></tr>
                <tr><td>Bank Transfer</td><td>91.60 FCFA</td><td>02:40 AM</td></tr>
              </tbody>
            </table>
            <button className="btn-primary" style={{ marginTop: 14, fontSize: 13.5, padding: 11 }}>Update Exchange Rates</button>
          </div>
        </div>

        <div className="grid-3">
          <div className="card">
            <div className="card-head"><h2>Recent Transactions</h2><a className="view-all">View all</a></div>
            <table>
              <thead><tr><th>User</th><th>Method</th><th>Amount</th><th>Type</th><th>Status</th><th>Time</th></tr></thead>
              <tbody>
                <tr><td>Amina T.</td><td>MTN</td><td className="up">+50,000 FCFA</td><td>Top-up</td><td><span className="pill success">Success</span></td><td>02:44 AM</td></tr>
                <tr><td>Wei L.</td><td>Alipay</td><td className="down">-120 ¥</td><td>Payment</td><td><span className="pill success">Success</span></td><td>02:42 AM</td></tr>
                <tr><td>John D.</td><td>Orange</td><td className="up">+20,000 FCFA</td><td>Top-up</td><td><span className="pill pending">Pending</span></td><td>02:41 AM</td></tr>
                <tr><td>David K.</td><td>Orange</td><td className="up">+25,000 FCFA</td><td>Top-up</td><td><span className="pill success">Success</span></td><td>02:43 AM</td></tr>
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-head"><h2>Security Alerts</h2><a className="view-all">View all</a></div>
            <AlertRow icon={<AlertTriangle size={14} />} color="red" text="Suspicious login attempt" time="2 min ago" />
            <AlertRow icon={<AlertTriangle size={14} />} color="orange" text="Unusual transaction detected" time="5 min ago" />
            <AlertRow icon={<Info size={14} />} color="blue" text="New device login" time="12 min ago" />
            <AlertRow icon={<CheckCircle2 size={14} />} color="green" text="KYC verified for user Zhang R." time="15 min ago" />
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: 30 }}>
          <div className="card">
            <div className="card-head"><h2>KYC Applications</h2><a className="view-all">View all</a></div>
            <KycRow icon={<Clock size={13} />} color="orange" label="Pending" num="24" />
            <KycRow icon={<Search size={13} />} color="blue" label="Under Review" num="18" />
            <KycRow icon={<CheckCircle2 size={13} />} color="green" label="Verified" num="1,248" />
            <KycRow icon={<XCircle size={13} />} color="red" label="Rejected" num="12" />
          </div>

          <div className="card">
            <div className="card-head"><h2>System Status</h2><a className="view-all">View all</a></div>
            <SysRow icon={<Smartphone size={15} style={{ color: "var(--orange)" }} />} label="MTN Service" />
            <SysRow icon={<Smartphone size={15} style={{ color: "var(--orange)" }} />} label="Orange Service" />
            <SysRow icon={<Landmark size={15} style={{ color: "var(--blue)" }} />} label="Alipay Service" />
            <SysRow icon={<MessageCircle size={15} style={{ color: "var(--green)" }} />} label="WeChat Service" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <div className={"nav-item" + (active ? " active" : "")}>
      {icon} {label}
    </div>
  );
}

function StatCard({ icon, bg, label, value, sub, delta, up }) {
  return (
    <div className="stat-card">
      <div className="top">
        <div className={"icon " + bg}>{icon}</div>
        <div className="label">{label}</div>
      </div>
      <div className="value">{value}</div>
      {sub && <div className="sub-value">{sub}</div>}
      {delta && <div className={"delta " + (up ? "up" : "down")}>{delta}</div>}
    </div>
  );
}

const methodBg = { orange: "var(--orange-light)", blue: "var(--blue-light)", green: "var(--green-light)" };
const methodFg = { orange: "var(--orange)", blue: "var(--blue)", green: "var(--green)" };

function TxnRow({ initials, name, method, methodColor, amount, up, time }) {
  return (
    <div className="txn-row">
      <div className="txn-avatar" style={{ background: methodBg[methodColor], color: methodFg[methodColor] }}>{initials}</div>
      <div className="txn-mid">
        <div className="name">{name}</div>
        <div className="method"><span className="method-badge" style={{ background: methodBg[methodColor], color: methodFg[methodColor] }}>{method}</span></div>
      </div>
      <div>
        <div className={"txn-amt " + (up ? "up" : "down")}>{amount}</div>
        <div className="txn-time"><span className="dot" />{time}</div>
      </div>
    </div>
  );
}

function PaymentRow({ method, success, amount, points, color }) {
  return (
    <tr>
      <td>{method}</td><td>{success}</td><td>{amount}</td>
      <td><svg className="trend" viewBox="0 0 44 18"><polyline points={points} fill="none" stroke={color} strokeWidth="2" /></svg></td>
    </tr>
  );
}

function AlertRow({ icon, color, text, time }) {
  return (
    <div className="alert-row">
      <div className="alert-ic" style={{ background: `var(--${color}-light)`, color: `var(--${color})` }}>{icon}</div>
      <div><div className="txt">{text}</div><div className="time">{time}</div></div>
    </div>
  );
}

function KycRow({ icon, color, label, num }) {
  return (
    <div className="kyc-row">
      <div className="kyc-left"><div className="kyc-ic" style={{ background: `var(--${color}-light)`, color: `var(--${color})` }}>{icon}</div>{label}</div>
      <div className="kyc-num">{num}</div>
    </div>
  );
}

function SysRow({ icon, label }) {
  return (
    <div className="sys-row">
      <div className="sys-left">{icon} {label}</div>
      <div className="sys-status">Operational</div>
    </div>
  );
}

const css = `
:root{
  --purple:#6C5DD3;
  --purple-dark:#4B3FA6;
  --purple-light:#EFEBFF;
  --blue:#3B82F6;
  --blue-light:#E8F0FE;
  --green:#22B573;
  --green-light:#E6F8EF;
  --orange:#F5A623;
  --orange-light:#FEF3E0;
  --red:#EF4444;
  --red-light:#FDEAEA;
  --ink:#1E1B2E;
  --sub:#8B8AA0;
  --border:#ECEBF3;
  --bg:#F7F7FB;
}
*{box-sizing:border-box;}
a{text-decoration:none;color:inherit;}

#login-screen{min-height:100vh;display:flex;flex-direction:column;background:#fff;}
.login-topbar{display:flex;align-items:center;gap:10px;padding:22px 40px;background:#fff;}
.logo-badge{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#7B6BF0,var(--purple-dark));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:18px;}
.logo-text{font-size:20px;font-weight:700;}
.logo-text span{color:var(--purple);}

.login-body{flex:1;display:grid;grid-template-columns:1fr 1fr;}
.login-left{background:linear-gradient(160deg,#2C1F78,#5B3FD9 55%,#7B5CF0);color:#fff;padding:60px 56px;display:flex;flex-direction:column;justify-content:center;}
.login-left h1{font-size:40px;line-height:1.15;margin:0 0 18px;font-weight:800;}
.login-left p.lede{color:#D9D3F7;font-size:15px;margin:0 0 40px;max-width:380px;}
.feature{display:flex;gap:14px;margin-bottom:26px;align-items:flex-start;}
.feature .ficon{width:42px;height:42px;flex:none;border-radius:10px;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;}
.feature h3{margin:0 0 3px;font-size:15px;}
.feature p{margin:0;font-size:13px;color:#CFC7F2;max-width:300px;}

.login-right{display:flex;align-items:center;justify-content:center;padding:40px;background:#fff;}
.login-card{width:100%;max-width:420px;}
.login-card .lc-logo{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:26px;}
.login-card .lc-logo .logo-badge{width:44px;height:44px;font-size:20px;}
.login-card .lc-logo .logo-text{font-size:26px;}
.login-card h2{text-align:center;font-size:24px;margin:0 0 6px;}
.login-card p.sub{text-align:center;color:var(--sub);font-size:14px;margin:0 0 30px;}
.field{margin-bottom:18px;}
.field label{display:block;font-size:13px;font-weight:600;margin-bottom:7px;}
.input-wrap{position:relative;display:flex;align-items:center;}
.input-wrap svg.leading{position:absolute;left:14px;color:#AEACC2;}
.input-wrap svg.trailing{position:absolute;right:14px;color:#AEACC2;cursor:pointer;}
.input-wrap input{width:100%;padding:13px 40px 13px 40px;border-radius:10px;border:1.5px solid var(--border);font-size:14px;background:#FBFBFD;}
.input-wrap input:focus{outline:none;border-color:var(--purple);}
.row-between{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;font-size:13.5px;}
.remember{display:flex;align-items:center;gap:8px;color:#5B5972;}
.remember input{accent-color:var(--purple);width:15px;height:15px;}
.forgot{color:var(--purple);font-weight:600;}
.btn-primary{width:100%;padding:14px;border:none;border-radius:10px;background:var(--purple);color:#fff;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;}
.btn-primary:hover{background:var(--purple-dark);}
.divider{display:flex;align-items:center;gap:14px;color:var(--sub);font-size:13px;margin:20px 0;}
.divider::before,.divider::after{content:"";flex:1;height:1px;background:var(--border);}
.btn-otp{width:100%;padding:13px;border-radius:10px;border:1.5px solid var(--border);background:#fff;font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;color:var(--ink);}
.btn-otp:hover{border-color:var(--purple);}
.secure-note{margin-top:22px;padding:14px 16px;background:var(--purple-light);border-radius:10px;display:flex;gap:12px;align-items:flex-start;font-size:13px;color:#4B3FA6;}

#dashboard-screen{display:none;min-height:100vh;grid-template-columns:230px 1fr;background:var(--bg);}
#dashboard-screen.active{display:grid;}
.sidebar{background:#fff;border-right:1px solid var(--border);display:flex;flex-direction:column;padding:20px 14px;}
.sidebar .brand{display:flex;align-items:center;gap:10px;padding:6px 8px 22px;}
.sidebar .brand .logo-badge{width:30px;height:30px;font-size:14px;border-radius:8px;}
.sidebar .brand .logo-text{font-size:17px;}
.nav-item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:9px;font-size:14px;color:#5B5972;font-weight:500;margin-bottom:2px;cursor:pointer;}
.nav-item:hover{background:#F5F4FB;}
.nav-item.active{background:var(--purple);color:#fff;}
.sidebar-bottom{margin-top:auto;display:flex;align-items:center;gap:10px;padding:12px 8px;border-top:1px solid var(--border);}
.avatar-sm{width:32px;height:32px;border-radius:50%;background:var(--purple-light);color:var(--purple);display:flex;align-items:center;justify-content:center;}
.sidebar-bottom .name{font-size:13.5px;font-weight:600;display:flex;align-items:center;gap:4px;}
.sidebar-bottom .role{font-size:11.5px;color:var(--sub);}

.main{padding:22px 30px;overflow-x:hidden;}
.topbar{display:flex;align-items:center;gap:18px;margin-bottom:22px;}
.search-box{flex:1;display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--border);border-radius:10px;padding:10px 16px;color:var(--sub);font-size:13.5px;max-width:520px;}
.icon-btn{position:relative;width:38px;height:38px;border-radius:10px;background:#fff;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:#5B5972;}
.icon-btn .badge{position:absolute;top:-5px;right:-5px;background:var(--red);color:#fff;font-size:10px;font-weight:700;border-radius:50%;width:17px;height:17px;display:flex;align-items:center;justify-content:center;}
.admin-chip{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:13.5px;font-weight:600;}

.page-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px;}
.page-head h1{font-size:23px;margin:0;font-weight:800;}
.head-tags{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
.tag{font-size:12.5px;font-weight:600;padding:7px 12px;border-radius:8px;display:flex;align-items:center;gap:6px;}
.tag.online{background:var(--green-light);color:var(--green);}
.tag.online .dot{width:7px;height:7px;border-radius:50%;background:var(--green);}
.tag.processing{background:var(--purple-light);color:var(--purple);}
.tag.date{background:#fff;border:1px solid var(--border);color:#5B5972;}

.stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:20px;}
.stat-card{background:#fff;border-radius:14px;padding:16px;border:1px solid var(--border);}
.stat-card .top{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.stat-card .icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;}
.stat-card .label{font-size:12.5px;color:var(--sub);font-weight:600;}
.stat-card .value{font-size:21px;font-weight:800;margin-bottom:5px;}
.stat-card .delta{font-size:12px;font-weight:600;}
.stat-card .sub-value{font-size:12px;color:var(--sub);}
.up{color:var(--green);} .down{color:var(--red);}
.bg-purple{background:var(--purple);} .bg-blue{background:var(--blue);} .bg-green{background:var(--green);} .bg-orange{background:var(--orange);} .bg-red{background:var(--red);}

.grid-2{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:16px;}
.card{background:#fff;border-radius:14px;padding:18px 20px;border:1px solid var(--border);}
.card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.card-head h2{font-size:15.5px;margin:0;font-weight:700;}
.view-all{font-size:12.5px;color:var(--purple);font-weight:600;cursor:pointer;}

.chart-wrap{position:relative;height:230px;}
svg.chart{width:100%;height:100%;}

.txn-list{display:flex;flex-direction:column;gap:14px;}
.txn-row{display:flex;align-items:center;gap:12px;}
.txn-avatar{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:700;flex:none;}
.txn-mid{flex:1;min-width:0;}
.txn-mid .name{font-size:13.5px;font-weight:600;}
.method-badge{font-size:9.5px;font-weight:700;padding:1px 5px;border-radius:4px;}
.txn-amt{text-align:right;font-size:13.5px;font-weight:700;}
.txn-time{font-size:11px;color:var(--sub);display:flex;align-items:center;gap:5px;justify-content:flex-end;}
.txn-time .dot{width:6px;height:6px;background:var(--green);border-radius:50%;}
.view-all-link{margin-top:6px;color:var(--purple);font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px;cursor:pointer;}

table{width:100%;border-collapse:collapse;font-size:13px;}
thead th{text-align:left;color:var(--sub);font-weight:600;font-size:11.5px;padding-bottom:10px;border-bottom:1px solid var(--border);}
tbody td{padding:11px 0;border-bottom:1px solid var(--border);}
tbody tr:last-child td{border-bottom:none;}
.pill{font-size:11px;font-weight:700;padding:4px 9px;border-radius:20px;}
.pill.success{background:var(--green-light);color:var(--green);}
.pill.pending{background:var(--orange-light);color:var(--orange);}
.trend{width:44px;height:18px;}

.grid-3{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
.alert-row{display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;}
.alert-row:last-child{margin-bottom:0;}
.alert-ic{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex:none;}
.alert-row .txt{font-size:13px;font-weight:600;}
.alert-row .time{font-size:11.5px;color:var(--sub);}

.kyc-row,.sys-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);font-size:13.5px;}
.kyc-row:last-child,.sys-row:last-child{border-bottom:none;}
.kyc-left,.sys-left{display:flex;align-items:center;gap:10px;}
.kyc-ic{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;}
.kyc-num{font-weight:700;}
.sys-status{color:var(--green);font-size:12.5px;font-weight:600;}
`;
