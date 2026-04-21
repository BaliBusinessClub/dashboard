"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

type Mode = "signin" | "create" | "admin" | "verify";

export function LoginScreen() {
  const router = useRouter();
  const { user, ready, signInWithEmail } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("Made Prasetya");
  const [email, setEmail] = useState("member@balibusinessclub.com");
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
    setStatus(mode === "admin" ? "Preparing admin access code..." : "Preparing verification code...");
    setPreviewCode(null);

    const response = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name })
    });

    const result = (await response.json()) as { ok?: boolean; message?: string; error?: string; code?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Unable to generate the access code.");
      return;
    }

    setMode("verify");
    setPreviewCode(result.code ?? null);
    setStatus(mode === "admin" ? "Admin code ready." : "Verification code ready.");
  }

  async function verifyCode() {
    setStatus("Checking your code...");

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

    const sessionUser = signInWithEmail(email, name);
    router.push(sessionUser.role === "admin" ? "/admin" : "/dashboard");
  }

  function continueWithEmail() {
    if (mode === "signin") {
      const sessionUser = signInWithEmail(email, name);
      router.push(sessionUser.role === "admin" ? "/admin" : "/dashboard");
      return;
    }

    void sendCode();
  }

  function continueWithGoogle() {
    setStatus("Google sign-in still needs real Google OAuth credentials to work live.");
  }

  if (!ready) {
    return <main className="auth-screen simple" />;
  }

  return (
    <main className="auth-screen simple">
      <section className="auth-center auth-center-minimal">
        <div className="auth-logo-wrap compact">
          <Image
            src="/bali-business-club-logo-white.png"
            alt="Bali Business Club"
            width={286}
            height={94}
            className="login-logo-image"
          />
        </div>

        <div className="auth-switch compact">
          <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>
            Sign in
          </button>
          <button type="button" className={mode === "create" ? "active" : ""} onClick={() => {
            setMode("create");
            setEmail("member@balibusinessclub.com");
          }}>
            Create account
          </button>
          <button type="button" className={mode === "admin" ? "active" : ""} onClick={() => {
            setMode("admin");
            setEmail("admin@balibusinessclub.com");
          }}>
            Admin
          </button>
        </div>

        <div className="auth-card clean minimal-login-card">
          {mode === "create" ? (
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
          ) : null}

          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>

          {mode === "verify" ? (
            <label>
              Code
              <input value={code} onChange={(event) => setCode(event.target.value)} />
            </label>
          ) : null}

          {mode === "verify" ? (
            <div className="minimal-login-actions">
              <button type="button" className="primary-button compact" onClick={verifyCode}>
                <LockKeyhole size={14} />
                Continue
              </button>
              <button type="button" className="ghost-button compact" onClick={() => setMode(email.includes("admin") ? "admin" : "create")}>
                Back
              </button>
            </div>
          ) : (
            <div className="minimal-login-actions">
              <button type="button" className="primary-button compact" onClick={continueWithEmail}>
                <Mail size={14} />
                {mode === "signin" ? "Sign in" : mode === "admin" ? "Send admin code" : "Create account"}
              </button>
              <button type="button" className="google-button compact-google" onClick={continueWithGoogle}>
                Continue with Google
              </button>
            </div>
          )}

          {status ? <p className="status-banner">{status}</p> : null}
          {previewCode ? <p className="preview-banner">Preview code: {previewCode}</p> : null}
        </div>
      </section>
    </main>
  );
}
