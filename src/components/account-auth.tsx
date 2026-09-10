"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AccountAuth() {
  const router = useRouter(); const [mode, setMode] = useState<"login" | "register">("login"); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setMessage(""); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) }); const result = await response.json(); if (response.ok) router.refresh(); else setMessage(result.error || "Unable to continue."); setBusy(false); }
  return <div className="max-w-md"><div className="mb-6 flex gap-6 border-b border-[var(--line)]"><button className={`pb-3 text-sm ${mode === "login" ? "border-b-2 border-[var(--leaf)] font-bold" : "text-[var(--muted)]"}`} onClick={() => setMode("login")} type="button">Sign in</button><button className={`pb-3 text-sm ${mode === "register" ? "border-b-2 border-[var(--leaf)] font-bold" : "text-[var(--muted)]"}`} onClick={() => setMode("register")} type="button">Create account</button></div><form className="grid gap-5" onSubmit={submit}>{mode === "register" && <label className="grid gap-2 text-sm"><span className="text-[var(--muted)]">Name</span><input className="border-b border-[var(--line)] bg-transparent py-3 outline-none focus:border-[var(--leaf)]" name="name" required /></label>}<label className="grid gap-2 text-sm"><span className="text-[var(--muted)]">Email</span><input className="border-b border-[var(--line)] bg-transparent py-3 outline-none focus:border-[var(--leaf)]" name="email" required type="email" /></label><label className="grid gap-2 text-sm"><span className="text-[var(--muted)]">Password</span><input className="border-b border-[var(--line)] bg-transparent py-3 outline-none focus:border-[var(--leaf)]" name="password" required type="password" /></label><button className="w-fit rounded-full bg-[var(--leaf)] px-6 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={busy} type="submit">{busy ? "Working..." : mode === "login" ? "Sign in" : "Create account"}</button>{message && <p className="text-sm text-[var(--coral)]" role="alert">{message}</p>}</form></div>;
}

export function LogoutButton() {
  const router = useRouter();
  return <button className="rounded-full border border-[var(--leaf)] px-5 py-2 text-sm font-bold text-[var(--leaf)]" onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.refresh(); }}>Sign out</button>;
}