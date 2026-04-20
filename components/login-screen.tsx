"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BadgeCheck, KeyRound, Mail, ShieldCheck } from "lucide-react";

type Mode = "signin" | "create" | "verify";

export function LoginScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("Made");
  const [email, setEmail] = useState("member@balibusinessclub.com");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [previewCode, setPreviewCode] = useState<string | null>(null);

  async function sendCode() {
    setStatus("Preparing BBC verification email...");
    setPreviewCode(null);

    const response = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name })
    });

    const result = (await response.json()) as { ok?: boolean; message?: string; error?: string; code?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Unable to generate the verification code.");
      return;
    }

    setMode("verify");
    setPreviewCode(result.code ?? null);
    setStatus(result.message ?? "Verification email prepared.");
  }

  async function verifyCode() {
    setStatus("Checking your verification code...");

    const response = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    });

    const result = (await response.json()) as { ok?: boolean; error?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Verification failed.");
      return;
    }

    setStatus("Email verified. Your dashboard is ready.");
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel auth-brand-panel">
        <p className="eyebrow">BALI BUSINESS CLUB</p>
        <h1>MEMBER DASHBOARD</h1>
        <p className="auth-copy">
          A clean members-only hub for Bali market intelligence, podcasts, curated resources, partner
          benefits, favorites, and direct connection with the BBC team.
        </p>

        <div className="auth-feature-list">
          <div className="auth-feature-card">
            <ShieldCheck size={20} />
            <div>
              <strong>EMAIL VERIFICATION</strong>
              <span>6-digit code flow with BBC-branded email preview, ready for live mail integration.</span>
            </div>
          </div>
          <div className="auth-feature-card">
            <KeyRound size={20} />
            <div>
              <strong>GOOGLE OR EMAIL SIGN IN</strong>
              <span>Fast access for members plus account creation for new users.</span>
            </div>
          </div>
          <div className="auth-feature-card">
            <BadgeCheck size={20} />
            <div>
              <strong>ADMIN CONSOLE READY</strong>
              <span>Analytics, reporting, user export, and settings live in a dedicated backend view.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-panel auth-form-panel">
        <div className="auth-tabs">
          <button className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>
            SIGN IN
          </button>
          <button className={mode === "create" ? "active" : ""} onClick={() => setMode("create")}>
            CREATE ACCOUNT
          </button>
          <button className={mode === "verify" ? "active" : ""} onClick={() => setMode("verify")}>
            VERIFY EMAIL
          </button>
        </div>

        <div className="auth-card">
          <p className="eyebrow">WELCOME BACK</p>
          <h2>{mode === "create" ? "CREATE YOUR ACCOUNT" : mode === "verify" ? "CONFIRM YOUR EMAIL" : "CONNECT TO BBC"}</h2>

          {(mode === "signin" || mode === "create") && (
            <>
              {mode === "create" && (
                <label>
                  FULL NAME
                  <input value={name} onChange={(event) => setName(event.target.value)} />
                </label>
              )}

              <label>
                EMAIL
                <input value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>

              <label>
                PASSWORD
                <input
                  type="password"
                  value={password}
                  placeholder="Minimum 8 characters"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>

              <button className="primary-button" type="button" onClick={sendCode}>
                <Mail size={16} />
                {mode === "create" ? "CREATE ACCOUNT & SEND CODE" : "SEND VERIFICATION CODE"}
              </button>

              <button className="secondary-button" type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.6 3.1-4 3.1-7.2Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 22c2.7 0 4.9-.9 6.6-2.5l-3.1-2.4c-.9.6-2 1-3.5 1c-2.7 0-5-1.8-5.8-4.3H3v2.6A10 10 0 0 0 12 22Z"
                  />
                  <path
                    fill="currentColor"
                    d="M6.2 13.8A6.1 6.1 0 0 1 5.9 12c0-.6.1-1.2.3-1.8V7.6H3A10 10 0 0 0 2 12c0 1.6.4 3.2 1 4.4l3.2-2.6Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9A10 10 0 0 0 3 7.6l3.2 2.6C7 7.7 9.3 5.9 12 5.9Z"
                  />
                </svg>
                CONTINUE WITH GOOGLE
              </button>
            </>
          )}

          {mode === "verify" && (
            <>
              <label>
                EMAIL
                <input value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label>
                6-DIGIT CODE
                <input value={code} onChange={(event) => setCode(event.target.value)} />
              </label>
              <button className="primary-button" type="button" onClick={verifyCode}>
                <ShieldCheck size={16} />
                VERIFY EMAIL
              </button>
              <button className="ghost-button" type="button" onClick={sendCode}>
                RESEND CODE
              </button>
            </>
          )}

          {status ? <p className="status-banner">{status}</p> : null}
          {previewCode ? <p className="preview-banner">PREVIEW CODE: {previewCode}</p> : null}

          <div className="auth-links">
            <Link href="/dashboard">
              OPEN MEMBER DASHBOARD
              <ArrowRight size={16} />
            </Link>
            <Link href="/admin">
              OPEN ADMIN DASHBOARD
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
