import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Login from "./pages/Login.jsx";
import Dashboard from "./Dashboard.jsx";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [adminRole, setAdminRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setAdminRole(null);
      return;
    }
    setCheckingRole(true);
    supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setAdminRole(data?.role || null);
        setCheckingRole(false);
      });
  }, [session?.user?.id]);

  if (session === undefined || (session && checkingRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-400 text-[13.5px]">
        Loading…
      </div>
    );
  }

  if (!session || !adminRole) {
    return <Login />;
  }

  return (
    <Dashboard
      adminEmail={session.user.email}
      adminRole={adminRole}
      onSignOut={() => supabase.auth.signOut()}
    />
  );
}
