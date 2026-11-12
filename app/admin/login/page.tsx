"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, LockKeyhole } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      router.replace("/admin"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Login failed"); }
    finally { setBusy(false); }
  }
  return <main className="admin-login"><form className="login-card" onSubmit={submit}>
    <div className="login-logo"><Zap fill="currentColor" size={25}/></div>
    <h1>VoltMart Admin</h1><p>ចូលប្រើប្រព័ន្ធគ្រប់គ្រងហាង</p>
    <label>Email / អ៊ីមែល<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com"/></label>
    <label>Password / ពាក្យសម្ងាត់<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••"/></label>
    {error && <div className="login-error">{error}</div>}
    <button disabled={busy}>{busy ? "កំពុងចូល..." : <><LockKeyhole size={16}/> ចូលប្រព័ន្ធ</>}</button>
    <a href="/">← ត្រឡប់ទៅហាង</a>
  </form></main>;
}
