"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

type Mode = "signin" | "create" | "verify";

export function LoginScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("Made Prasetya");
  const [email, setEmail] = useState("member@balibusinessclub.com");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [previewCode, setPreviewCode] = useState<string | null>(null);

  async function sendCode() {
    setStatus("PREPARING BBC VERIFICATION EMAIL...");
    setPreviewCode(null);

    const response = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name })
    });

    const result = (await response.json()) as { ok?: boolean; message?: string; error?: string; code?: string };

    if (!response.ok) {
      setStatus(result.error ?? "UNABLE TO GENERATE THE VERIFICATION CODE.");
      return;
    }

    setMode("verify");
    setPreviewCode(result.code ?? null);
    setStatus(result.message?.toUpperCase() ?? "VERIFICATION EMAIL PREPARED.");
  }

  async function verifyCode() {
    setStatus("CHECKING YOUR VERIFICATION CODE...");

    const response = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    });

    const result = (await response.json()) as { ok?: boolean; error?: string };

    if (!response.ok) {
      setStatus(result.error?.toUpperCase() ?? "VERIFICATION FAILED.");
      return;
    }

    setStatus("EMAIL VERIFIED. YOUR DASHBOARD IS READY.");
  }

  return (
    <main className="auth-screen clean">
      <section className="auth-showcase">
        <p className="eyebrow">BALI BUSINESS CLUB</p>
        <h1>MEMBER ACCESS</h1>
        <p className="auth-intro">
          A cleaner BBC member experience with market insights, curated news, podcasts, resources, partner offers,
          favorites, and direct community touchpoints.
        </p>

        <div className="auth-reference-list">
          <div className="reference-line">
            <span>GOOGLE SIGN IN</span>
            <small>FAST MEMBER ACCESS</small>
          </div>
          <div className="reference-line">
            <span>EMAIL CODE VERIFICATION</span>
            <small>BBC BRANDED MESSAGE FLOW</small>
          </div>
          <div className="reference-line">
            <span>ADMIN BACKEND</span>
            <small>ANALYTICS, REPORTING, DATABASE, SETTINGS</small>
          </div>
        </div>
      </section>

      <section className="auth-form-wrap clean">
        <div className="auth-tabs clean">
          <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>
            SIGN IN
          </button>
          <button type="button" className={mode === "create" ? "active" : ""} onClick={() => setMode("create")}>
            CREATE ACCOUNT
          </button>
          <button type="button" className={mode === "verify" ? "active" : ""} onClick={() => setMode("verify")}>
            VERIFY EMAIL
          </button>
        </div>

        <div className="auth-card clean">
          <p className="eyebrow">BBC LOGIN</p>
          <h2>{mode === "create" ? "CREATE ACCOUNT" : mode === "verify" ? "CONFIRM EMAIL" : "CONNECT"}</h2>

          {(mode === "signin" || mode === "create") && (
            <>
              {mode === "create" ? (
                <label>
                  FULL NAME
                  <input value={name} onChange={(event) => setName(event.target.value)} />
                </label>
              ) : null}

              <label>
                EMAIL
                <input value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>

              <label>
                PASSWORD
                <input
                  type="password"
                  value={password}
                  placeholder="MINIMUM 8 CHARACTERS"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>

              <button type="button" className="primary-button compact" onClick={sendCode}>
                <Mail size={14} />
                {mode === "create" ? "CREATE ACCOUNT & SEND CODE" : "SEND VERIFICATION CODE"}
              </button>

              <button type="button" className="google-button">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
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

          {mode === "verify" ? (
            <>
              <label>
                EMAIL
                <input value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label>
                6-DIGIT CODE
                <input value={code} onChange={(event) => setCode(event.target.value)} />
              </label>
              <button type="button" className="primary-button compact" onClick={verifyCode}>
                <ShieldCheck size={14} />
                VERIFY EMAIL
              </button>
              <button type="button" className="ghost-button compact" onClick={sendCode}>
                RESEND CODE
              </button>
            </>
          ) : null}

          {status ? <p className="status-banner">{status}</p> : null}
          {previewCode ? <p className="preview-banner">PREVIEW CODE: {previewCode}</p> : null}

          <div className="auth-links clean">
            <Link href="/dashboard">
              OPEN MEMBER DASHBOARD
              <ArrowRight size={14} />
            </Link>
            <Link href="/admin">
              OPEN ADMIN DASHBOARD
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
