"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

type Mode = "signin" | "create" | "verify";

export function LoginScreen() {
  const router = useRouter();
  const { user, ready, signInWithEmail } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("Made Prasetya");
  const [email, setEmail] = useState("member@balibusinessclub.com");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [previewCode, setPreviewCode] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !user) {
      return;
    }

    router.replace(user.role === "admin" ? "/admin" : "/dashboard");
  }, [ready, router, user]);

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

    const sessionUser = signInWithEmail(email, name);
    setStatus("EMAIL VERIFIED. ACCESS GRANTED.");
    router.push(sessionUser.role === "admin" ? "/admin" : "/dashboard");
  }

  function continueWithEmail() {
    if (mode === "signin") {
      const sessionUser = signInWithEmail(email, name);
      setStatus(sessionUser.role === "admin" ? "ADMIN ACCESS GRANTED." : "MEMBER ACCESS GRANTED.");
      router.push(sessionUser.role === "admin" ? "/admin" : "/dashboard");
      return;
    }

    void sendCode();
  }

  function continueWithGoogle() {
    setStatus("GOOGLE SIGN-IN NEEDS A GOOGLE CLIENT ID AND OAUTH SETUP TO WORK LIVE.");
  }

  if (!ready) {
    return <main className="auth-screen simple" />;
  }

  return (
    <main className="auth-screen simple">
      <section className="auth-center">
        <div className="auth-logo-wrap">
          <Image
            src="/bali-business-club-logo-white.svg"
            alt="Bali Business Club"
            width={220}
            height={48}
            className="login-logo-image"
          />
        </div>

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
          <h1 className="auth-main-title">LOGIN</h1>

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

          {mode !== "verify" ? (
            <label>
              PASSWORD
              <input
                type="password"
                value={password}
                placeholder="MINIMUM 8 CHARACTERS"
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          ) : (
            <label>
              6-DIGIT CODE
              <input value={code} onChange={(event) => setCode(event.target.value)} />
            </label>
          )}

          {mode === "verify" ? (
            <>
              <button type="button" className="primary-button compact" onClick={verifyCode}>
                <ShieldCheck size={14} />
                VERIFY EMAIL
              </button>
              <button type="button" className="ghost-button compact" onClick={() => void sendCode()}>
                RESEND CODE
              </button>
            </>
          ) : (
            <>
              <button type="button" className="primary-button compact" onClick={continueWithEmail}>
                <Mail size={14} />
                {mode === "create" ? "CREATE ACCOUNT" : "LOGIN"}
              </button>
              <button type="button" className="google-button" onClick={continueWithGoogle}>
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

          {status ? <p className="status-banner">{status}</p> : null}
          {previewCode ? <p className="preview-banner">PREVIEW CODE: {previewCode}</p> : null}
        </div>
      </section>
    </main>
  );
}
