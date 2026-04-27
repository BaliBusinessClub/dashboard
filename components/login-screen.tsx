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
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            prompt?: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

type Mode = "signin" | "create" | "verify";
type CreateStep = 1 | 2;

const GOOGLE_CLIENT_ID_FALLBACK = "137292364348-1a8kb9k2fdr7qpo3gcqfku9281omlahh.apps.googleusercontent.com";
const PENDING_SIGNUP_KEY = "bbc-pending-signup";

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
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID_FALLBACK;

  useEffect(() => {
    if (!ready || !user) {
      return;
    }

    router.replace(user.role === "admin" ? "/admin?tab=database" : "/dashboard");
  }, [ready, router, user]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(PENDING_SIGNUP_KEY);
      if (!raw) {
        return;
      }

      const pending = JSON.parse(raw) as {
        name?: string;
        email?: string;
        whatsapp?: string;
        ageRange?: string;
        memberType?: string;
        password?: string;
        confirmPassword?: string;
      };

      if (pending.name) setName(pending.name);
      if (pending.email) setEmail(pending.email);
      if (pending.whatsapp) setWhatsapp(pending.whatsapp);
      if (pending.ageRange) setAgeRange(pending.ageRange);
      if (pending.memberType) setMemberType(pending.memberType);
      if (pending.password) setPassword(pending.password);
      if (pending.confirmPassword) setConfirmPassword(pending.confirmPassword);
    } catch {
      window.localStorage.removeItem(PENDING_SIGNUP_KEY);
    }
  }, []);

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

  function storePendingSignup() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      PENDING_SIGNUP_KEY,
      JSON.stringify({
        name,
        email,
        whatsapp: normalizePhoneNumber(whatsapp),
        ageRange,
        memberType,
        memberTypeOther,
        password,
        confirmPassword
      })
    );
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
    storePendingSignup();

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

  async function resendCode() {
    await sendCreateVerification();
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

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(PENDING_SIGNUP_KEY);
    }

    router.push(sessionUser.role === "admin" ? "/admin?tab=database" : "/dashboard");
  }

  function handleSignIn() {
    const sessionUser = signInWithPassword(email, password);

    if (!sessionUser) {
      setStatus("We could not sign you in. Check your email, password, or verify your account first.");
      return;
    }

    router.push(sessionUser.role === "admin" ? "/admin?tab=database" : "/dashboard");
  }

  async function handleGoogleAccessToken(accessToken: string) {
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!profileResponse.ok) {
      setStatus("Google sign-in could not load your account details.");
      return;
    }

    const profile = (await profileResponse.json()) as {
      email?: string;
      name?: string;
      picture?: string;
    };

    if (!profile.email) {
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

    router.push(result.user.role === "admin" ? "/admin?tab=database" : "/dashboard");
  }

  function continueWithGoogle() {
    if (!googleClientId || !googleReady || !window.google?.accounts?.oauth2) {
      setStatus("Google sign-in is not ready yet.");
      return;
    }

    if (mode === "create" && !validateCreateStepOne()) {
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: googleClientId,
      scope: "openid email profile",
      prompt: "select_account",
      callback: (response) => {
        if (!response.access_token) {
          setStatus(response.error ? `Google sign-in failed: ${response.error}` : "Google sign-in could not start.");
          return;
        }
        handleGoogleAccessToken(response.access_token).catch(() => {
          setStatus("Google sign-in could not load your account details.");
        });
      }
    });
    tokenClient.requestAccessToken();
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
                <button type="button" className="google-button compact-google google-live-button" onClick={continueWithGoogle}>
                  <GoogleIcon />
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
                <button type="button" className="ghost-button compact auth-back-button" onClick={() => setCreateStep(1)}>
                  Back
                </button>
                <button type="button" className="primary-button compact" onClick={sendCreateVerification}>
                  <Mail size={14} />
                  Confirm account email
                </button>
                <button type="button" className="google-button compact-google google-live-button" onClick={continueWithGoogle}>
                  <GoogleIcon />
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
                <button type="button" className="google-button compact-google google-live-button" onClick={continueWithGoogle}>
                  <GoogleIcon />
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
                  className="ghost-button compact auth-back-button"
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
                <button type="button" className="table-link-button" onClick={resendCode}>
                  <Mail size={14} />
                  Resend code
                </button>
              </div>
            </>
          ) : null}

          {status ? <p className="status-banner">{status}</p> : null}
          {previewCode ? <p className="preview-banner">Preview code: {previewCode}</p> : null}
        </div>
      </section>
    </main>
  );
}
  function GoogleIcon() {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" width="14" height="14">
        <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.8-5.4 3.8-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.4 14.5 2.5 12 2.5 6.8 2.5 2.6 6.8 2.6 12S6.8 21.5 12 21.5c6.9 0 9.1-4.8 9.1-7.3 0-.5 0-.9-.1-1.3H12Z"/>
        <path fill="#34A853" d="M2.6 12c0 1.9.7 3.7 2 5l3-2.3c-.8-.7-1.3-1.7-1.3-2.7s.5-2 1.3-2.7l-3-2.3c-1.3 1.3-2 3.1-2 5Z"/>
        <path fill="#FBBC05" d="M12 21.5c2.5 0 4.6-.8 6.2-2.3l-3-2.4c-.8.6-1.9 1-3.2 1-2.4 0-4.5-1.6-5.2-3.8l-3 2.3c1.6 3.1 4.8 5.2 9 5.2Z"/>
        <path fill="#4285F4" d="M18.2 19.2c1.7-1.6 2.9-4 2.9-7.2 0-.5 0-.9-.1-1.3H12v3.9h5.4c-.3 1.2-1 2.5-2.4 3.4l3.2 1.2Z"/>
      </svg>
    );
  }
