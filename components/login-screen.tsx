"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type Mode = "signin" | "create" | "verify";
type CreateStep = 1 | 2;

const ADMIN_EMAIL = "admin@balibusinessclub.com";
const MEMBER_EMAIL = "member@balibusinessclub.com";
const MEMBER_PASSWORD = "BBCmember2026!";
const ADMIN_PASSWORD = "BBCadmin2026!";

const memberTypeOptions = [
  "Business owner",
  "Investor",
  "Developer",
  "Operator",
  "Broker",
  "Consultant",
  "Creator",
  "Hotel owner",
  "Agent",
  "Service provider",
  "Other"
] as const;

function normalizePhoneNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return `${hasPlus ? "+" : ""}${digits}`;
}

function isValidWhatsapp(value: string) {
  const normalized = normalizePhoneNumber(value);
  const digits = normalized.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function decodeGoogleCredential(token: string) {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return {
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      picture: String(payload.picture ?? "")
    };
  } catch {
    return null;
  }
}

export function LoginScreen() {
  const router = useRouter();
  const { user, ready, signInWithPassword, registerMember, signInWithGoogleProfile } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [createStep, setCreateStep] = useState<CreateStep>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("+62");
  const [code, setCode] = useState("");
  const [ageRange, setAgeRange] = useState("25-34");
  const [memberType, setMemberType] = useState("Business owner");
  const [memberTypeOther, setMemberTypeOther] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);

  const effectiveMemberType = memberType === "Other" ? memberTypeOther.trim() : memberType;
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!ready || !user) {
      return;
    }

    router.replace(user.role === "admin" ? "/admin" : "/dashboard");
  }, [ready, router, user]);

  useEffect(() => {
    if (!googleClientId || typeof window === "undefined") {
      return;
    }

    if (window.google?.accounts?.id) {
      setGoogleReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [googleClientId]);

  function resetCreateFlow() {
    setCreateStep(1);
    setCode("");
    setPreviewCode(null);
  }

  function goToMode(nextMode: Mode) {
    setMode(nextMode);
    setStatus(null);
    if (nextMode !== "verify") {
      setCode("");
      setPreviewCode(null);
    }
    if (nextMode === "create") {
      setCreateStep(1);
    }
  }

  function validateCreateStepOne() {
    if (!name.trim()) {
      setStatus("Please add your name.");
      return false;
    }

    if (!effectiveMemberType) {
      setStatus("Please choose what best describes you.");
      return false;
    }

    return true;
  }

  function validateCreateStepTwo() {
    if (!email.trim()) {
      setStatus("Please add your email.");
      return false;
    }

    if (!isValidWhatsapp(whatsapp)) {
      setStatus("Please add a valid WhatsApp number.");
      return false;
    }

    if (!password || !confirmPassword) {
      setStatus("Please enter and confirm your password.");
      return false;
    }

    if (password !== confirmPassword) {
      setStatus("Your passwords do not match yet.");
      return false;
    }

    return true;
  }

  async function sendCreateVerification() {
    if (!validateCreateStepOne() || !validateCreateStepTwo()) {
      return;
    }

    setStatus("Sending account confirmation email...");
    setPreviewCode(null);

    const response = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, flow: "create" })
    });

    const result = (await response.json()) as { ok?: boolean; message?: string; error?: string; code?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Unable to generate the verification code.");
      return;
    }

    setMode("verify");
    setPreviewCode(result.code ?? null);
    setStatus("Account confirmation code sent.");
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

    const sessionUser = registerMember({
      email,
      name,
      password,
      ageRange,
      memberType: effectiveMemberType,
      whatsapp: normalizePhoneNumber(whatsapp),
      provider: "email"
    });

    router.push(sessionUser.role === "admin" ? "/admin" : "/dashboard");
  }

  function handleSignIn() {
    const sessionUser = signInWithPassword(email, password);

    if (!sessionUser) {
      setStatus("We could not find a member with those credentials.");
      return;
    }

    router.push(sessionUser.role === "admin" ? "/admin" : "/dashboard");
  }

  function continueWithGoogle() {
    if (!googleClientId || !googleReady || !window.google?.accounts?.id) {
      setStatus("Google sign-in is ready to wire, but I still need the live Google OAuth client ID to activate it.");
      return;
    }

    if (mode === "create" && !validateCreateStepOne()) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response) => {
        const profile = response.credential ? decodeGoogleCredential(response.credential) : null;

        if (!profile?.email) {
          setStatus("Google sign-in could not read your account details.");
          return;
        }

        const normalizedWhatsapp = normalizePhoneNumber(whatsapp);
        const result = signInWithGoogleProfile({
          email: profile.email,
          name: profile.name || name,
          picture: profile.picture,
          ageRange,
          memberType: effectiveMemberType,
          whatsapp: mode === "create" ? normalizedWhatsapp : undefined
        });

        if (mode === "create" && !result.created) {
          setStatus("That Google email already has a BBC account, so we signed you in directly.");
        }

        router.push(result.user.role === "admin" ? "/admin" : "/dashboard");
      }
    });

    window.google.accounts.id.prompt();
  }

  if (!ready) {
    return <main className="auth-screen simple" />;
  }

  return (
    <main className="auth-screen simple">
      <section className="auth-center auth-center-minimal">
        <div className="auth-logo-wrap compact lifted">
          <Image
            src="/bali-business-club-logo-white.png"
            alt="Bali Business Club"
            width={286}
            height={94}
            className="login-logo-image"
          />
        </div>

        <div className="auth-switch compact">
          <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => goToMode("signin")}>
            Sign in
          </button>
          <button type="button" className={mode === "create" || mode === "verify" ? "active" : ""} onClick={() => goToMode("create")}>
            Create account
          </button>
        </div>

        <div className="auth-card clean minimal-login-card wide-auth-card">
          {mode === "create" && createStep === 1 ? (
            <>
              <label>
                Name
                <input value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label>
                Age range
                <select value={ageRange} onChange={(event) => setAgeRange(event.target.value)}>
                  <option>18-24</option>
                  <option>25-34</option>
                  <option>35-44</option>
                  <option>45-54</option>
                  <option>55+</option>
                </select>
              </label>
              <label>
                What best describes you?
                <select value={memberType} onChange={(event) => setMemberType(event.target.value)}>
                  {memberTypeOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              {memberType === "Other" ? (
                <label>
                  Tell us more
                  <input value={memberTypeOther} onChange={(event) => setMemberTypeOther(event.target.value)} placeholder="Write your role" />
                </label>
              ) : null}

              <div className="minimal-login-actions">
                <button
                  type="button"
                  className="primary-button compact"
                  onClick={() => {
                    if (!validateCreateStepOne()) {
                      return;
                    }
                    setCreateStep(2);
                    setStatus(null);
                  }}
                >
                  <ArrowRight size={14} />
                  Continue
                </button>
                <button type="button" className="google-button compact-google" onClick={continueWithGoogle}>
                  Continue with Google
                </button>
              </div>
            </>
          ) : null}

          {mode === "create" && createStep === 2 ? (
            <>
              <label>
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label>
                WhatsApp number
                <input
                  type="tel"
                  inputMode="numeric"
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(normalizePhoneNumber(event.target.value))}
                  placeholder="+62 812 3456 7890"
                />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              <label>
                Confirm password
                <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
              </label>

              <div className="minimal-login-actions two-button-row">
                <button type="button" className="ghost-button compact" onClick={() => setCreateStep(1)}>
                  Back
                </button>
                <button type="button" className="primary-button compact" onClick={sendCreateVerification}>
                  <Mail size={14} />
                  Confirm account email
                </button>
                <button type="button" className="google-button compact-google" onClick={continueWithGoogle}>
                  Continue with Google
                </button>
              </div>
            </>
          ) : null}

          {mode === "signin" ? (
            <>
              <label>
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              <div className="minimal-login-actions">
                <button type="button" className="primary-button compact" onClick={handleSignIn}>
                  <LockKeyhole size={14} />
                  Sign in
                </button>
                <button type="button" className="google-button compact-google" onClick={continueWithGoogle}>
                  Continue with Google
                </button>
              </div>
            </>
          ) : null}

          {mode === "verify" ? (
            <>
              <label>
                Confirmation code
                <input value={code} onChange={(event) => setCode(event.target.value)} />
              </label>
              <div className="minimal-login-actions two-button-row">
                <button
                  type="button"
                  className="ghost-button compact"
                  onClick={() => {
                    setMode("create");
                    setCreateStep(2);
                    setStatus(null);
                  }}
                >
                  Back
                </button>
                <button type="button" className="primary-button compact" onClick={verifyCode}>
                  <LockKeyhole size={14} />
                  Continue
                </button>
              </div>
            </>
          ) : null}

          {status ? <p className="status-banner">{status}</p> : null}
          {previewCode ? <p className="preview-banner">Preview code: {previewCode}</p> : null}
          {mode === "signin" ? (
            <p className="preview-banner">
              Member demo: {MEMBER_EMAIL} / {MEMBER_PASSWORD} - Admin demo: {ADMIN_EMAIL} / {ADMIN_PASSWORD}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
